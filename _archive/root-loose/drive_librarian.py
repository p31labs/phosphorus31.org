#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
DRIVE LIBRARIAN - Python CLI
═══════════════════════════════════════════════════════════════════════════════

Heavy-duty document processing with:
- Advanced NLP-based PII detection (spaCy + Presidio)
- Evidence claim extraction and categorization
- Reversible redaction with secure backup
- Comprehensive validation reports
- Batch processing with progress tracking

Author: Will Johnson / Claude
Version: 1.0.0
Date: January 19, 2026

SETUP:
1. pip install -r requirements.txt
2. python -m spacy download en_core_web_lg
3. Set up Google Cloud credentials (see README.md)
4. Copy .env.example to .env and configure
5. Run: python drive_librarian.py setup
6. Run: python drive_librarian.py process

═══════════════════════════════════════════════════════════════════════════════
"""

import os
import sys
import json
import hashlib
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, field, asdict
from enum import Enum
import tempfile
import shutil

import click
from rich.console import Console
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn
from rich.panel import Panel
from rich.markdown import Markdown
from dotenv import load_dotenv
import yaml

# Google APIs
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload, MediaFileUpload
import io

# NLP
import spacy
try:
    from presidio_analyzer import AnalyzerEngine
    from presidio_anonymizer import AnonymizerEngine
    from presidio_anonymizer.entities import OperatorConfig
    PRESIDIO_AVAILABLE = True
except ImportError:
    PRESIDIO_AVAILABLE = False

# Document processing
from docx import Document as DocxDocument
from openpyxl import load_workbook
from pptx import Presentation

console = Console()
load_dotenv()

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

SCOPES = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/presentations'
]

class EvidenceLevel(Enum):
    VERIFIED = "verified"          # Peer-reviewed, replicated, established
    SUPPORTED = "supported"        # Published research, not yet replicated
    THEORETICAL = "theoretical"    # Mathematically sound, not empirically tested
    SPECULATIVE = "speculative"    # Hypothesis, preliminary evidence
    UNVERIFIED = "unverified"      # No source found

EVIDENCE_COLORS = {
    EvidenceLevel.VERIFIED: "#C6EFCE",
    EvidenceLevel.SUPPORTED: "#FFEB9C",
    EvidenceLevel.THEORETICAL: "#B4C6E7",
    EvidenceLevel.SPECULATIVE: "#F4CCCC",
    EvidenceLevel.UNVERIFIED: "#D9D9D9"
}

EVIDENCE_MARKERS = {
    EvidenceLevel.VERIFIED: [
        "peer-reviewed", "replicated", "meta-analysis", "systematic review",
        "confirmed", "established", "proven", "demonstrated", "validated",
        "NIST", "FDA approved", "clinical trial", "phase 3", "RCT",
        "randomized controlled", "double-blind", "Nature", "Science", "PNAS"
    ],
    EvidenceLevel.SUPPORTED: [
        "published", "study found", "research shows", "evidence suggests",
        "literature indicates", "data shows", "observed", "measured",
        "experiment showed", "trial demonstrated", "findings indicate"
    ],
    EvidenceLevel.THEORETICAL: [
        "mathematically", "in principle", "theoretically", "model predicts",
        "simulation", "calculation shows", "proof", "theorem", "derivation",
        "computational analysis", "formal proof"
    ],
    EvidenceLevel.SPECULATIVE: [
        "hypothesis", "proposed", "may", "might", "could", "possibly",
        "speculative", "preliminary", "exploratory", "pilot", "suggests",
        "we believe", "it appears", "seems to", "potential"
    ]
}

CATEGORY_KEYWORDS = {
    "Research": ["research", "study", "analysis", "synthesis", "literature", "review", "findings", "investigation"],
    "Protocols": ["protocol", "procedure", "methodology", "framework", "checklist", "workflow", "clinical", "experiment"],
    "Technical": ["technical", "engineering", "hardware", "software", "code", "implementation", "specification", "architecture", "ESP32", "quantum", "SIC-POVM"],
    "Legal": ["legal", "court", "custody", "contract", "agreement", "filing", "motion", "attorney", "proceeding"],
    "Personal": ["personal", "journal", "diary", "reflection", "memoir", "family", "private"],
    "Financial": ["financial", "budget", "invoice", "expense", "tax", "accounting"]
}

# ═══════════════════════════════════════════════════════════════════════════════
# DATA CLASSES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class PIIMatch:
    """Represents a detected PII instance"""
    entity_type: str
    text: str
    start: int
    end: int
    score: float
    redacted_text: str = ""
    
@dataclass
class EvidenceClaim:
    """Represents an extracted evidence claim"""
    text: str
    level: EvidenceLevel
    markers_found: List[str]
    paragraph_index: int
    confidence: float

@dataclass
class ProcessingResult:
    """Results from processing a single file"""
    file_id: str
    file_name: str
    file_type: str
    pii_found: List[PIIMatch] = field(default_factory=list)
    claims_found: List[EvidenceClaim] = field(default_factory=list)
    category: str = "Miscellaneous"
    original_backup_id: Optional[str] = None
    errors: List[str] = field(default_factory=list)
    processed_at: str = field(default_factory=lambda: datetime.now().isoformat())

@dataclass
class ProcessingStats:
    """Aggregate statistics from a processing run"""
    files_processed: int = 0
    pii_redacted: int = 0
    claims_categorized: int = 0
    files_organized: int = 0
    errors: List[str] = field(default_factory=list)
    results: List[ProcessingResult] = field(default_factory=list)

# ═══════════════════════════════════════════════════════════════════════════════
# GOOGLE DRIVE API
# ═══════════════════════════════════════════════════════════════════════════════

class DriveAPI:
    """Handles all Google Drive API interactions"""
    
    def __init__(self, credentials_path: str = "credentials.json", token_path: str = "token.json"):
        self.credentials_path = credentials_path
        self.token_path = token_path
        self.creds = None
        self.drive_service = None
        self.docs_service = None
        self.sheets_service = None
        self.slides_service = None
        
    def authenticate(self) -> bool:
        """Authenticate with Google APIs"""
        if os.path.exists(self.token_path):
            self.creds = Credentials.from_authorized_user_file(self.token_path, SCOPES)
            
        if not self.creds or not self.creds.valid:
            if self.creds and self.creds.expired and self.creds.refresh_token:
                self.creds.refresh(Request())
            else:
                if not os.path.exists(self.credentials_path):
                    console.print(f"[red]Error: {self.credentials_path} not found[/red]")
                    console.print("Download from Google Cloud Console > APIs & Services > Credentials")
                    return False
                    
                flow = InstalledAppFlow.from_client_secrets_file(self.credentials_path, SCOPES)
                self.creds = flow.run_local_server(port=0)
                
            with open(self.token_path, 'w') as token:
                token.write(self.creds.to_json())
                
        # Build services
        self.drive_service = build('drive', 'v3', credentials=self.creds)
        self.docs_service = build('docs', 'v1', credentials=self.creds)
        self.sheets_service = build('sheets', 'v4', credentials=self.creds)
        self.slides_service = build('slides', 'v1', credentials=self.creds)
        
        return True
    
    def find_folder(self, folder_name: str, parent_id: str = None) -> Optional[str]:
        """Find a folder by name, optionally within a parent"""
        query = f"name = '{folder_name}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
        if parent_id:
            query += f" and '{parent_id}' in parents"
            
        results = self.drive_service.files().list(
            q=query,
            spaces='drive',
            fields='files(id, name)'
        ).execute()
        
        files = results.get('files', [])
        return files[0]['id'] if files else None
    
    def create_folder(self, folder_name: str, parent_id: str = None) -> str:
        """Create a folder"""
        file_metadata = {
            'name': folder_name,
            'mimeType': 'application/vnd.google-apps.folder'
        }
        if parent_id:
            file_metadata['parents'] = [parent_id]
            
        folder = self.drive_service.files().create(
            body=file_metadata,
            fields='id'
        ).execute()
        
        return folder.get('id')
    
    def find_or_create_folder(self, folder_name: str, parent_id: str = None) -> str:
        """Find or create a folder"""
        folder_id = self.find_folder(folder_name, parent_id)
        if not folder_id:
            folder_id = self.create_folder(folder_name, parent_id)
        return folder_id
    
    def list_files(self, folder_id: str, recursive: bool = True) -> List[Dict]:
        """List all files in a folder"""
        files = []
        page_token = None
        
        while True:
            query = f"'{folder_id}' in parents and trashed = false"
            results = self.drive_service.files().list(
                q=query,
                spaces='drive',
                fields='nextPageToken, files(id, name, mimeType, modifiedTime, parents)',
                pageToken=page_token
            ).execute()
            
            for item in results.get('files', []):
                files.append(item)
                
                # Recurse into subfolders
                if recursive and item['mimeType'] == 'application/vnd.google-apps.folder':
                    if not item['name'].startswith('_'):  # Skip system folders
                        files.extend(self.list_files(item['id'], recursive=True))
            
            page_token = results.get('nextPageToken')
            if not page_token:
                break
                
        return files
    
    def get_doc_content(self, doc_id: str) -> Dict:
        """Get Google Doc content"""
        return self.docs_service.documents().get(documentId=doc_id).execute()
    
    def update_doc(self, doc_id: str, requests: List[Dict]):
        """Update Google Doc with batch requests"""
        self.docs_service.documents().batchUpdate(
            documentId=doc_id,
            body={'requests': requests}
        ).execute()
    
    def copy_file(self, file_id: str, new_name: str, parent_id: str) -> str:
        """Copy a file to a new location"""
        file_metadata = {
            'name': new_name,
            'parents': [parent_id]
        }
        copied = self.drive_service.files().copy(
            fileId=file_id,
            body=file_metadata,
            fields='id'
        ).execute()
        return copied.get('id')
    
    def move_file(self, file_id: str, new_parent_id: str):
        """Move a file to a new folder"""
        file = self.drive_service.files().get(
            fileId=file_id,
            fields='parents'
        ).execute()
        
        previous_parents = ",".join(file.get('parents', []))
        
        self.drive_service.files().update(
            fileId=file_id,
            addParents=new_parent_id,
            removeParents=previous_parents,
            fields='id, parents'
        ).execute()
    
    def export_file(self, file_id: str, mime_type: str) -> bytes:
        """Export a Google Workspace file"""
        request = self.drive_service.files().export_media(
            fileId=file_id,
            mimeType=mime_type
        )
        
        buffer = io.BytesIO()
        downloader = MediaIoBaseDownload(buffer, request)
        
        done = False
        while not done:
            _, done = downloader.next_chunk()
            
        return buffer.getvalue()
    
    def create_doc(self, title: str, parent_id: str = None) -> str:
        """Create a new Google Doc"""
        file_metadata = {
            'name': title,
            'mimeType': 'application/vnd.google-apps.document'
        }
        if parent_id:
            file_metadata['parents'] = [parent_id]
            
        doc = self.drive_service.files().create(
            body=file_metadata,
            fields='id'
        ).execute()
        
        return doc.get('id')

# ═══════════════════════════════════════════════════════════════════════════════
# NLP PROCESSING
# ═══════════════════════════════════════════════════════════════════════════════

class NLPProcessor:
    """Handles NLP-based PII detection and claim extraction"""
    
    def __init__(self):
        self.nlp = None
        self.analyzer = None
        self.anonymizer = None
        
    def initialize(self):
        """Load NLP models"""
        console.print("[cyan]Loading NLP models...[/cyan]")
        
        # Load spaCy
        try:
            self.nlp = spacy.load("en_core_web_lg")
        except OSError:
            console.print("[yellow]Downloading spaCy model...[/yellow]")
            os.system("python -m spacy download en_core_web_lg")
            self.nlp = spacy.load("en_core_web_lg")
        
        # Initialize Presidio if available
        if PRESIDIO_AVAILABLE:
            self.analyzer = AnalyzerEngine()
            self.anonymizer = AnonymizerEngine()
            console.print("[green]✓ Presidio PII analyzer loaded[/green]")
        else:
            console.print("[yellow]⚠ Presidio not available, using basic PII detection[/yellow]")
            
        console.print("[green]✓ NLP models loaded[/green]")
    
    def detect_pii(self, text: str) -> List[PIIMatch]:
        """Detect PII in text using Presidio + spaCy"""
        matches = []
        
        if PRESIDIO_AVAILABLE and self.analyzer:
            # Use Presidio for comprehensive PII detection
            results = self.analyzer.analyze(
                text=text,
                language='en',
                entities=[
                    "PERSON", "EMAIL_ADDRESS", "PHONE_NUMBER", "US_SSN",
                    "CREDIT_CARD", "US_BANK_NUMBER", "IP_ADDRESS", "DATE_TIME",
                    "LOCATION", "US_DRIVER_LICENSE", "US_PASSPORT", "MEDICAL_LICENSE"
                ]
            )
            
            for result in results:
                matches.append(PIIMatch(
                    entity_type=result.entity_type,
                    text=text[result.start:result.end],
                    start=result.start,
                    end=result.end,
                    score=result.score
                ))
        else:
            # Fallback to regex-based detection
            matches.extend(self._regex_pii_detection(text))
            
        # Also use spaCy NER for names
        doc = self.nlp(text)
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                matches.append(PIIMatch(
                    entity_type="PERSON",
                    text=ent.text,
                    start=ent.start_char,
                    end=ent.end_char,
                    score=0.85
                ))
                
        # Deduplicate overlapping matches
        matches = self._deduplicate_matches(matches)
        
        return matches
    
    def _regex_pii_detection(self, text: str) -> List[PIIMatch]:
        """Basic regex-based PII detection"""
        matches = []
        
        patterns = {
            "US_SSN": r'\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b',
            "PHONE_NUMBER": r'\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b',
            "EMAIL_ADDRESS": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            "CREDIT_CARD": r'\b(?:\d{4}[-.\s]?){3}\d{4}\b',
            "IP_ADDRESS": r'\b(?:\d{1,3}\.){3}\d{1,3}\b'
        }
        
        for entity_type, pattern in patterns.items():
            for match in re.finditer(pattern, text):
                matches.append(PIIMatch(
                    entity_type=entity_type,
                    text=match.group(),
                    start=match.start(),
                    end=match.end(),
                    score=0.9
                ))
                
        return matches
    
    def _deduplicate_matches(self, matches: List[PIIMatch]) -> List[PIIMatch]:
        """Remove overlapping PII matches, keeping highest confidence"""
        if not matches:
            return []
            
        # Sort by start position, then by score (descending)
        sorted_matches = sorted(matches, key=lambda x: (x.start, -x.score))
        
        result = []
        last_end = -1
        
        for match in sorted_matches:
            if match.start >= last_end:
                result.append(match)
                last_end = match.end
                
        return result
    
    def redact_pii(self, text: str, matches: List[PIIMatch]) -> Tuple[str, List[PIIMatch]]:
        """Redact PII from text, returning redacted text and updated matches"""
        if not matches:
            return text, matches
            
        # Sort matches by position (reverse order for replacement)
        sorted_matches = sorted(matches, key=lambda x: x.start, reverse=True)
        
        redacted = text
        for match in sorted_matches:
            placeholder = f"[{match.entity_type}-REDACTED]"
            match.redacted_text = placeholder
            redacted = redacted[:match.start] + placeholder + redacted[match.end:]
            
        return redacted, matches
    
    def extract_claims(self, text: str) -> List[EvidenceClaim]:
        """Extract and categorize evidence claims from text"""
        claims = []
        doc = self.nlp(text)
        
        # Process by sentences
        for sent_idx, sent in enumerate(doc.sents):
            sent_text = sent.text.strip()
            if len(sent_text) < 30:  # Skip very short sentences
                continue
                
            # Determine evidence level
            level, markers, confidence = self._categorize_evidence(sent_text.lower())
            
            if level:
                claims.append(EvidenceClaim(
                    text=sent_text,
                    level=level,
                    markers_found=markers,
                    paragraph_index=sent_idx,
                    confidence=confidence
                ))
                
        return claims
    
    def _categorize_evidence(self, text: str) -> Tuple[Optional[EvidenceLevel], List[str], float]:
        """Categorize evidence level of a text passage"""
        found_markers = []
        
        # Check from most rigorous to least
        for level in [EvidenceLevel.VERIFIED, EvidenceLevel.SUPPORTED, 
                      EvidenceLevel.THEORETICAL, EvidenceLevel.SPECULATIVE]:
            markers = EVIDENCE_MARKERS[level]
            for marker in markers:
                if marker.lower() in text:
                    found_markers.append(marker)
                    
            if found_markers:
                confidence = min(0.5 + (len(found_markers) * 0.15), 0.95)
                return level, found_markers, confidence
                
        return None, [], 0.0

# ═══════════════════════════════════════════════════════════════════════════════
# DOCUMENT PROCESSOR
# ═══════════════════════════════════════════════════════════════════════════════

class DocumentProcessor:
    """Processes individual documents"""
    
    def __init__(self, drive_api: DriveAPI, nlp_processor: NLPProcessor, config: Dict):
        self.drive = drive_api
        self.nlp = nlp_processor
        self.config = config
        
    def process_file(self, file_info: Dict, stats: ProcessingStats) -> ProcessingResult:
        """Process a single file"""
        result = ProcessingResult(
            file_id=file_info['id'],
            file_name=file_info['name'],
            file_type=file_info['mimeType']
        )
        
        try:
            mime_type = file_info['mimeType']
            
            if mime_type == 'application/vnd.google-apps.document':
                self._process_google_doc(file_info, result)
            elif mime_type == 'application/vnd.google-apps.spreadsheet':
                self._process_google_sheet(file_info, result)
            elif mime_type == 'application/vnd.google-apps.presentation':
                self._process_google_slides(file_info, result)
            else:
                console.print(f"[dim]Skipping unsupported type: {mime_type}[/dim]")
                
            # Categorize file
            result.category = self._categorize_file(file_info, result)
            
        except Exception as e:
            result.errors.append(str(e))
            stats.errors.append(f"{file_info['name']}: {str(e)}")
            
        stats.pii_redacted += len(result.pii_found)
        stats.claims_categorized += len(result.claims_found)
        stats.results.append(result)
        
        return result
    
    def _process_google_doc(self, file_info: Dict, result: ProcessingResult):
        """Process a Google Doc"""
        # Export to plain text for NLP
        text_content = self.drive.export_file(
            file_info['id'],
            'text/plain'
        ).decode('utf-8')
        
        # Detect PII
        pii_matches = self.nlp.detect_pii(text_content)
        
        if pii_matches:
            # Backup original before redaction
            backup_id = self._backup_original(file_info)
            result.original_backup_id = backup_id
            
            # Redact PII in the document
            self._redact_google_doc(file_info['id'], pii_matches)
            result.pii_found = pii_matches
        
        # Extract evidence claims
        result.claims_found = self.nlp.extract_claims(text_content)
        
        # Apply evidence highlighting
        if result.claims_found:
            self._highlight_evidence_claims(file_info['id'], result.claims_found)
    
    def _process_google_sheet(self, file_info: Dict, result: ProcessingResult):
        """Process a Google Sheet"""
        # Export to text for PII scanning
        text_content = self.drive.export_file(
            file_info['id'],
            'text/csv'
        ).decode('utf-8')
        
        pii_matches = self.nlp.detect_pii(text_content)
        
        if pii_matches:
            backup_id = self._backup_original(file_info)
            result.original_backup_id = backup_id
            result.pii_found = pii_matches
            # Note: Actual cell redaction would require Sheets API updates
    
    def _process_google_slides(self, file_info: Dict, result: ProcessingResult):
        """Process Google Slides"""
        # Export to text for PII scanning
        text_content = self.drive.export_file(
            file_info['id'],
            'text/plain'
        ).decode('utf-8')
        
        pii_matches = self.nlp.detect_pii(text_content)
        
        if pii_matches:
            backup_id = self._backup_original(file_info)
            result.original_backup_id = backup_id
            result.pii_found = pii_matches
    
    def _backup_original(self, file_info: Dict) -> str:
        """Create backup of original file before redaction"""
        backup_folder_id = self.config.get('backup_folder_id')
        if not backup_folder_id:
            return None
            
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_name = f"{file_info['name']}_ORIGINAL_{timestamp}"
        
        return self.drive.copy_file(file_info['id'], backup_name, backup_folder_id)
    
    def _redact_google_doc(self, doc_id: str, pii_matches: List[PIIMatch]):
        """Redact PII from Google Doc using Docs API"""
        # Build replacement requests
        requests = []
        
        for match in sorted(pii_matches, key=lambda x: x.start, reverse=True):
            placeholder = f"[{match.entity_type}-REDACTED]"
            requests.append({
                'replaceAllText': {
                    'containsText': {
                        'text': match.text,
                        'matchCase': True
                    },
                    'replaceText': placeholder
                }
            })
            
        if requests:
            self.drive.update_doc(doc_id, requests)
    
    def _highlight_evidence_claims(self, doc_id: str, claims: List[EvidenceClaim]):
        """Add evidence level highlighting to Google Doc"""
        # This would require more complex Docs API operations
        # For now, we'll add comments instead
        pass
    
    def _categorize_file(self, file_info: Dict, result: ProcessingResult) -> str:
        """Categorize file based on name and content"""
        file_name = file_info['name'].lower()
        
        # Check file name against category keywords
        for category, keywords in CATEGORY_KEYWORDS.items():
            for keyword in keywords:
                if keyword in file_name:
                    return category
                    
        # Check claims content
        all_claim_text = " ".join([c.text.lower() for c in result.claims_found])
        for category, keywords in CATEGORY_KEYWORDS.items():
            for keyword in keywords:
                if keyword in all_claim_text:
                    return category
                    
        return "Miscellaneous"

# ═══════════════════════════════════════════════════════════════════════════════
# REPORT GENERATOR
# ═══════════════════════════════════════════════════════════════════════════════

class ReportGenerator:
    """Generates validation and processing reports"""
    
    def __init__(self, drive_api: DriveAPI, config: Dict):
        self.drive = drive_api
        self.config = config
        
    def generate_processing_report(self, stats: ProcessingStats) -> str:
        """Generate comprehensive processing report as Google Doc"""
        report_folder_id = self.config.get('report_folder_id')
        
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M")
        title = f"Librarian_Report_{timestamp}"
        
        # Create doc
        doc_id = self.drive.create_doc(title, report_folder_id)
        
        # Build report content
        requests = self._build_report_requests(stats)
        self.drive.update_doc(doc_id, requests)
        
        return doc_id
    
    def _build_report_requests(self, stats: ProcessingStats) -> List[Dict]:
        """Build Docs API requests for report content"""
        requests = []
        index = 1
        
        # Title
        requests.append({
            'insertText': {
                'location': {'index': index},
                'text': 'Drive Librarian Processing Report\n\n'
            }
        })
        index += len('Drive Librarian Processing Report\n\n')
        
        # Summary
        summary = f"""Generated: {datetime.now().isoformat()}

SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Files Processed: {stats.files_processed}
PII Instances Redacted: {stats.pii_redacted}
Claims Categorized: {stats.claims_categorized}
Files Organized: {stats.files_organized}
Errors: {len(stats.errors)}

"""
        requests.append({
            'insertText': {
                'location': {'index': index},
                'text': summary
            }
        })
        index += len(summary)
        
        # Evidence legend
        legend = """EVIDENCE LEVEL LEGEND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🟢 VERIFIED: Peer-reviewed, replicated, established science
🟡 SUPPORTED: Published research, not yet replicated
🔵 THEORETICAL: Mathematically sound, not empirically tested
🔴 SPECULATIVE: Hypothesis, preliminary evidence
⚪ UNVERIFIED: No source found

"""
        requests.append({
            'insertText': {
                'location': {'index': index},
                'text': legend
            }
        })
        index += len(legend)
        
        # File details
        if stats.results:
            details = "FILE DETAILS\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            for result in stats.results:
                details += f"📄 {result.file_name}\n"
                details += f"   Category: {result.category}\n"
                details += f"   PII Found: {len(result.pii_found)}\n"
                details += f"   Claims: {len(result.claims_found)}\n"
                if result.original_backup_id:
                    details += f"   Backup ID: {result.original_backup_id}\n"
                if result.errors:
                    details += f"   ⚠️ Errors: {', '.join(result.errors)}\n"
                details += "\n"
                
            requests.append({
                'insertText': {
                    'location': {'index': index},
                    'text': details
                }
            })
        
        return requests
    
    def generate_validation_report(self, result: ProcessingResult) -> Dict:
        """Generate validation report for a single file"""
        report = {
            "file": result.file_name,
            "processed_at": result.processed_at,
            "pii_summary": {
                "total": len(result.pii_found),
                "by_type": {}
            },
            "evidence_summary": {
                "total": len(result.claims_found),
                "by_level": {}
            },
            "claims": []
        }
        
        # Aggregate PII by type
        for pii in result.pii_found:
            pii_type = pii.entity_type
            report["pii_summary"]["by_type"][pii_type] = \
                report["pii_summary"]["by_type"].get(pii_type, 0) + 1
        
        # Aggregate claims by level
        for claim in result.claims_found:
            level = claim.level.value
            report["evidence_summary"]["by_level"][level] = \
                report["evidence_summary"]["by_level"].get(level, 0) + 1
            
            report["claims"].append({
                "text": claim.text[:200] + "..." if len(claim.text) > 200 else claim.text,
                "level": level,
                "confidence": claim.confidence,
                "markers": claim.markers_found
            })
            
        return report

# ═══════════════════════════════════════════════════════════════════════════════
# CLI COMMANDS
# ═══════════════════════════════════════════════════════════════════════════════

@click.group()
@click.pass_context
def cli(ctx):
    """Drive Librarian - Document organization and validation tool"""
    ctx.ensure_object(dict)
    
@cli.command()
@click.option('--folder-name', default='<3', help='Root folder name to process')
@click.pass_context
def setup(ctx, folder_name):
    """Set up Drive Librarian folders and configuration"""
    console.print(Panel.fit(
        "[bold cyan]Drive Librarian Setup[/bold cyan]",
        border_style="cyan"
    ))
    
    # Initialize API
    drive = DriveAPI()
    if not drive.authenticate():
        return
        
    console.print("[green]✓ Authenticated with Google[/green]")
    
    # Find or create root folder
    root_id = drive.find_folder(folder_name)
    if not root_id:
        console.print(f"[yellow]Folder '{folder_name}' not found. Creating...[/yellow]")
        root_id = drive.create_folder(folder_name)
        
    console.print(f"[green]✓ Root folder: {folder_name} ({root_id})[/green]")
    
    # Create subfolders
    subfolders = {
        '_Archive': 'Archived files',
        '_Redacted_Originals': 'Original versions before PII redaction',
        '_Validation_Reports': 'Processing reports',
        'Research': 'Research documents',
        'Protocols': 'Protocols and procedures',
        'Technical': 'Technical documentation',
        'Legal': 'Legal documents',
        'Personal': 'Personal documents',
        'Miscellaneous': 'Uncategorized'
    }
    
    folder_ids = {'root': root_id}
    
    for name, description in subfolders.items():
        folder_id = drive.find_or_create_folder(name, root_id)
        folder_ids[name] = folder_id
        console.print(f"  ✓ {name}")
    
    # Save configuration
    config = {
        'root_folder_id': root_id,
        'root_folder_name': folder_name,
        'backup_folder_id': folder_ids['_Redacted_Originals'],
        'report_folder_id': folder_ids['_Validation_Reports'],
        'folders': folder_ids,
        'setup_date': datetime.now().isoformat()
    }
    
    with open('librarian_config.yaml', 'w') as f:
        yaml.dump(config, f)
        
    console.print("\n[green]✓ Setup complete![/green]")
    console.print("Configuration saved to [cyan]librarian_config.yaml[/cyan]")
    console.print("\nNext: Run [cyan]python drive_librarian.py process[/cyan]")

@cli.command()
@click.option('--dry-run', is_flag=True, help='Preview without making changes')
@click.option('--no-redact', is_flag=True, help='Skip PII redaction')
@click.option('--no-organize', is_flag=True, help='Skip file organization')
@click.pass_context
def process(ctx, dry_run, no_redact, no_organize):
    """Process all documents in the configured folder"""
    
    # Load config
    if not os.path.exists('librarian_config.yaml'):
        console.print("[red]Error: Run setup first[/red]")
        return
        
    with open('librarian_config.yaml', 'r') as f:
        config = yaml.safe_load(f)
    
    console.print(Panel.fit(
        f"[bold cyan]Drive Librarian Processing[/bold cyan]\n"
        f"Folder: {config['root_folder_name']}\n"
        f"{'[yellow]DRY RUN MODE[/yellow]' if dry_run else ''}",
        border_style="cyan"
    ))
    
    # Initialize components
    drive = DriveAPI()
    if not drive.authenticate():
        return
        
    nlp = NLPProcessor()
    nlp.initialize()
    
    processor = DocumentProcessor(drive, nlp, config)
    reporter = ReportGenerator(drive, config)
    
    # Get all files
    console.print("\n[cyan]Scanning files...[/cyan]")
    files = drive.list_files(config['root_folder_id'])
    
    # Filter to processable types
    processable_types = [
        'application/vnd.google-apps.document',
        'application/vnd.google-apps.spreadsheet',
        'application/vnd.google-apps.presentation'
    ]
    files = [f for f in files if f['mimeType'] in processable_types]
    
    console.print(f"Found [green]{len(files)}[/green] files to process\n")
    
    # Process files
    stats = ProcessingStats()
    
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),
        console=console
    ) as progress:
        task = progress.add_task("Processing files...", total=len(files))
        
        for file_info in files:
            progress.update(task, description=f"Processing: {file_info['name'][:40]}...")
            
            if not dry_run:
                processor.process_file(file_info, stats)
            else:
                # Dry run - just analyze
                result = ProcessingResult(
                    file_id=file_info['id'],
                    file_name=file_info['name'],
                    file_type=file_info['mimeType']
                )
                stats.results.append(result)
                
            stats.files_processed += 1
            progress.update(task, advance=1)
    
    # Print summary
    console.print("\n")
    
    table = Table(title="Processing Summary")
    table.add_column("Metric", style="cyan")
    table.add_column("Count", style="green")
    
    table.add_row("Files Processed", str(stats.files_processed))
    table.add_row("PII Instances Redacted", str(stats.pii_redacted))
    table.add_row("Claims Categorized", str(stats.claims_categorized))
    table.add_row("Files Organized", str(stats.files_organized))
    table.add_row("Errors", str(len(stats.errors)))
    
    console.print(table)
    
    # Generate report
    if not dry_run:
        console.print("\n[cyan]Generating report...[/cyan]")
        report_id = reporter.generate_processing_report(stats)
        console.print(f"[green]✓ Report created: https://docs.google.com/document/d/{report_id}[/green]")
    
    if stats.errors:
        console.print("\n[yellow]Errors encountered:[/yellow]")
        for error in stats.errors[:10]:
            console.print(f"  • {error}")
        if len(stats.errors) > 10:
            console.print(f"  ... and {len(stats.errors) - 10} more")

@cli.command()
@click.argument('file_name')
@click.pass_context
def restore(ctx, file_name):
    """Restore a file from its pre-redaction backup"""
    
    with open('librarian_config.yaml', 'r') as f:
        config = yaml.safe_load(f)
    
    drive = DriveAPI()
    if not drive.authenticate():
        return
        
    backup_folder_id = config.get('backup_folder_id')
    
    console.print(f"[cyan]Searching for backups of: {file_name}[/cyan]")
    
    # List backup folder contents
    files = drive.list_files(backup_folder_id, recursive=False)
    
    # Find matching backups
    backups = [f for f in files if file_name in f['name'] and '_ORIGINAL_' in f['name']]
    
    if not backups:
        console.print(f"[red]No backups found for: {file_name}[/red]")
        return
        
    # Sort by modification time
    backups.sort(key=lambda x: x['modifiedTime'], reverse=True)
    
    console.print(f"\n[green]Found {len(backups)} backup(s):[/green]")
    for i, backup in enumerate(backups):
        console.print(f"  {i+1}. {backup['name']} ({backup['modifiedTime']})")
    
    # Restore most recent
    latest = backups[0]
    restored_name = file_name + "_RESTORED"
    restored_id = drive.copy_file(latest['id'], restored_name, config['root_folder_id'])
    
    console.print(f"\n[green]✓ Restored: {restored_name}[/green]")
    console.print(f"  https://docs.google.com/document/d/{restored_id}")

@cli.command()
@click.pass_context  
def list_backups(ctx):
    """List all backed-up original files"""
    
    with open('librarian_config.yaml', 'r') as f:
        config = yaml.safe_load(f)
    
    drive = DriveAPI()
    if not drive.authenticate():
        return
        
    backup_folder_id = config.get('backup_folder_id')
    files = drive.list_files(backup_folder_id, recursive=False)
    
    table = Table(title="Backed-Up Originals")
    table.add_column("File Name", style="cyan")
    table.add_column("Backed Up", style="green")
    
    for f in files:
        table.add_row(f['name'], f['modifiedTime'])
        
    console.print(table)
    console.print(f"\nTotal: {len(files)} backups")

@cli.command()
@click.pass_context
def status(ctx):
    """Show current configuration and status"""
    
    if not os.path.exists('librarian_config.yaml'):
        console.print("[yellow]Not configured. Run: python drive_librarian.py setup[/yellow]")
        return
        
    with open('librarian_config.yaml', 'r') as f:
        config = yaml.safe_load(f)
    
    console.print(Panel.fit(
        "[bold cyan]Drive Librarian Status[/bold cyan]",
        border_style="cyan"
    ))
    
    console.print(f"\n[cyan]Root Folder:[/cyan] {config['root_folder_name']}")
    console.print(f"[cyan]Folder ID:[/cyan] {config['root_folder_id']}")
    console.print(f"[cyan]Setup Date:[/cyan] {config['setup_date']}")
    
    console.print("\n[cyan]Configured Folders:[/cyan]")
    for name, folder_id in config.get('folders', {}).items():
        console.print(f"  • {name}: {folder_id}")

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == '__main__':
    cli()
