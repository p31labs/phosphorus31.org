import os
import fnmatch
import re
import json
from datetime import datetime
from typing import Dict, List, Any, Optional

def get_file_type(filepath: str) -> str:
    """Determines the generic type of a file based on its extension."""
    _, ext = os.path.splitext(filepath)
    ext = ext.lower()
    
    if ext in [".txt", ".md", ".json", ".py", ".js", ".html", ".css", ".xml", ".yaml", ".yml"]:
        return "text"
    elif ext in [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp"]:
        return "image"
    elif ext in [".pdf", ".docx", ".xlsx", ".pptx", ".odt", ".ods", ".odp"]:
        return "document"
    elif ext in [".zip", ".gz", ".tar", ".rar", ".7z"]:
        return "archive"
    elif ext in [".mp3", ".wav", ".ogg", ".flac", ".aac"]:
        return "audio"
    elif ext in [".mp4", ".mov", ".avi", ".mkv", ".webm"]:
        return "video"
    elif ext in [".exe", ".dll", ".so", ".dylib", ".bin"]:
        return "executable"
    else:
        return "binary"

def categorize_file(filepath: str, categorization_rules: List[Dict]) -> str:
    """Categorizes a file based on a list of pattern-matching rules."""
    filename = os.path.basename(filepath)
    
    # First check filename patterns
    for rule in categorization_rules:
        if fnmatch.fnmatch(filename, rule["pattern"]):
            return rule["category"]
    
    # If no pattern matches, return default category
    return "uncategorized"

def extract_keywords(content: str, keyword_patterns: Dict[str, List[str]]) -> List[str]:
    """Extracts keywords from content based on predefined patterns."""
    tags = []
    content_lower = content.lower()
    
    for category, patterns in keyword_patterns.items():
        for pattern in patterns:
            if re.search(pattern, content_lower):
                tags.append(category)
    
    return list(set(tags))  # Remove duplicates

def detect_sensitive_info(content: str, sensitive_patterns: Dict[str, str]) -> List[Dict[str, Any]]:
    """Detects sensitive information in content."""
    sensitive_found = []
    
    for info_type, pattern in sensitive_patterns.items():
        matches = re.findall(pattern, content, re.IGNORECASE)
        if matches:
            sensitive_found.append({
                "type": info_type,
                "matches": matches,
                "count": len(matches)
            })
    
    return sensitive_found

def summarize_text(content: str, max_length: int = 200) -> str:
    """Creates a simple summary of text content."""
    # Remove extra whitespace and newlines
    clean_content = ' '.join(content.split())
    
    if len(clean_content) <= max_length:
        return clean_content
    
    # Find a good breaking point (sentence end)
    summary = clean_content[:max_length]
    last_period = summary.rfind('.')
    last_space = summary.rfind(' ')
    
    if last_period > max_length * 0.8:  # If period is close to end
        summary = summary[:last_period + 1]
    elif last_space > max_length * 0.8:  # If space is close to end
        summary = summary[:last_space]
    else:
        summary = summary + "..."
    
    return summary.strip()

def read_file_content(filepath: str, file_type: str) -> Optional[str]:
    """Reads file content based on file type."""
    try:
        if file_type == "text":
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                return f.read()
        elif file_type == "document":
            # For now, we'll treat documents as binary since we don't have
            # specialized libraries for PDF/Office files
            return None
        else:
            return None
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return None

def analyze_file(filepath: str, agent_rules: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyzes a single file, applying categorization and content analysis.
    Returns a dictionary of metadata.
    """
    file_type = get_file_type(filepath)
    category = categorize_file(filepath, agent_rules.get("categorize", []))
    
    # Get file stats
    try:
        stat = os.stat(filepath)
        size_bytes = stat.st_size
        modified_time = datetime.fromtimestamp(stat.st_mtime)
    except Exception as e:
        print(f"Error getting stats for {filepath}: {e}")
        size_bytes = 0
        modified_time = None
    
    # Initialize metadata
    metadata = {
        "path": filepath,
        "filename": os.path.basename(filepath),
        "size_bytes": size_bytes,
        "type": file_type,
        "category": category,
        "analysis_timestamp": datetime.now().isoformat(),
        "modified_time": modified_time.isoformat() if modified_time else None,
        "summary": None,
        "tags": [],
        "sensitive_info_found": [],
        "content_preview": None
    }
    
    # Content analysis for text files
    if file_type == "text":
        content = read_file_content(filepath, file_type)
        if content:
            # Generate summary
            metadata["summary"] = summarize_text(content)
            
            # Extract keywords/tags
            keyword_patterns = agent_rules.get("keywords", {})
            if keyword_patterns:
                metadata["tags"] = extract_keywords(content, keyword_patterns)
            
            # Detect sensitive information
            sensitive_patterns = agent_rules.get("sensitive_patterns", {})
            if sensitive_patterns:
                metadata["sensitive_info_found"] = detect_sensitive_info(content, sensitive_patterns)
            
            # Create content preview (first 500 chars)
            metadata["content_preview"] = content[:500] if len(content) > 500 else content
    
    return metadata

def save_metadata_to_catalog(metadata: Dict[str, Any], catalog_path: str) -> None:
    """Saves file metadata to the card catalog database."""
    try:
        # For now, we'll use a simple JSON file as our catalog
        # In a real implementation, this would be a proper database
        catalog_data = []
        
        if os.path.exists(catalog_path):
            with open(catalog_path, 'r') as f:
                catalog_data = json.load(f)
        
        catalog_data.append(metadata)
        
        with open(catalog_path, 'w') as f:
            json.dump(catalog_data, f, indent=2)
            
    except Exception as e:
        print(f"Error saving to catalog: {e}")

if __name__ == "__main__":
    # Example usage for testing the library
    test_rules = {
        "categorize": [
            {"pattern": "*.jpg", "category": "image_jpeg"},
            {"pattern": "*.txt", "category": "text_plain"},
            {"pattern": "project_*.zip", "category": "project_archive"}
        ],
        "keywords": {
            "business": ["jls", "business", "opportunity", "plan"],
            "personal": ["personal", "private", "confidential"],
            "legal": ["legal", "contract", "agreement", "law"]
        },
        "sensitive_patterns": {
            "email": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            "phone": r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
            "ssn": r'\b\d{3}-\d{2}-\d{4}\b'
        }
    }
    
    test_files = [
        "C:/Users/test/photo.jpg",
        "C:/Users/test/document.txt",
        "C:/Users/test/project_alpha.zip",
        "C:/Users/test/unknown.dll"
    ]
    
    for f in test_files:
        # Simulate file stats for testing
        try:
            # Create a test file for demonstration
            if f.endswith('.txt'):
                with open(f, 'w') as test_file:
                    test_file.write("This is a test document about JLS business opportunities and personal information like email@example.com")
            
            analysis = analyze_file(f, test_rules)
            print(f"Analysis for {f}:")
            print(json.dumps(analysis, indent=2))
            print("-" * 50)
        except Exception as e:
            # Handle cases where files don't actually exist in a test environment
            print(f"Could not analyze {f}: {e}")


