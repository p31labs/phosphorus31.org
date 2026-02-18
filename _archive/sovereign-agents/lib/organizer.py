import os
import re
import shutil
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
from pathlib import Path

class SmartOrganizer:
    """Handles intelligent file renaming and organization based on content analysis."""
    
    def __init__(self, organization_rules: Dict[str, Any]):
        """
        Initialize the organizer with rules for how to organize files.
        
        Args:
            organization_rules: Dictionary containing organization configuration
        """
        self.rules = organization_rules
        self.naming_templates = self.rules.get("naming_templates", {})
        self.category_paths = self.rules.get("category_paths", {})
        self.date_format = self.rules.get("date_format", "%Y-%m-%d")
        
    def generate_smart_filename(self, metadata: Dict[str, Any]) -> str:
        """
        Generate a smart filename based on file metadata and content analysis.
        
        Args:
            metadata: File metadata from analysis
            
        Returns:
            Generated filename
        """
        filename = metadata["filename"]
        file_type = metadata["type"]
        category = metadata["category"]
        tags = metadata.get("tags", [])
        summary = metadata.get("summary", "")
        modified_time = metadata.get("modified_time")
        
        # Extract base name and extension
        base_name, ext = os.path.splitext(filename)
        
        # Get naming template for this category
        template = self.naming_templates.get(category, self.naming_templates.get("default", "{date}_{category}_{base}{ext}"))
        
        # Extract date from modified time or use current date
        if modified_time:
            try:
                date_obj = datetime.fromisoformat(modified_time.replace('Z', '+00:00'))
                date_str = date_obj.strftime(self.date_format)
            except:
                date_str = datetime.now().strftime(self.date_format)
        else:
            date_str = datetime.now().strftime(self.date_format)
        
        # Generate keywords from tags and summary
        keywords = []
        if tags:
            keywords.extend(tags[:3])  # Use first 3 tags
        
        if summary:
            # Extract key terms from summary
            key_terms = self._extract_key_terms(summary)
            keywords.extend(key_terms[:2])  # Use first 2 key terms
        
        # Clean and format keywords
        clean_keywords = []
        for kw in keywords:
            # Remove special characters and convert to lowercase
            clean_kw = re.sub(r'[^a-zA-Z0-9]', '', kw.lower())
            if clean_kw and len(clean_kw) > 2:  # Only include meaningful keywords
                clean_keywords.append(clean_kw)
        
        # Remove duplicates while preserving order
        unique_keywords = []
        for kw in clean_keywords:
            if kw not in unique_keywords:
                unique_keywords.append(kw)
        
        # Build keyword string
        keyword_str = "-".join(unique_keywords[:3]) if unique_keywords else "doc"
        
        # Format the template
        try:
            new_filename = template.format(
                date=date_str,
                category=category.replace(" ", "-").lower(),
                base=base_name[:20] if base_name else "file",  # Limit base name length
                ext=ext,
                keywords=keyword_str,
                type=file_type
            )
        except KeyError as e:
            # Fallback if template has unknown variables
            new_filename = f"{date_str}_{category.replace(' ', '-').lower()}_{keyword_str}{ext}"
        
        # Ensure filename is valid for the filesystem
        new_filename = self._sanitize_filename(new_filename)
        
        return new_filename
    
    def _extract_key_terms(self, text: str) -> List[str]:
        """Extract key terms from text content."""
        # Remove common stop words
        stop_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
            'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
            'could', 'can', 'may', 'might', 'must', 'shall'
        }
        
        # Extract words (alphanumeric only)
        words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
        
        # Filter out stop words and common terms
        key_terms = []
        for word in words:
            if word not in stop_words and word not in key_terms:
                key_terms.append(word)
        
        return key_terms[:5]  # Return top 5 key terms
    
    def _sanitize_filename(self, filename: str) -> str:
        """Remove or replace characters that are invalid in filenames."""
        # Replace invalid characters with underscores
        invalid_chars = r'[<>:"/\\|?*]'
        sanitized = re.sub(invalid_chars, '_', filename)
        
        # Remove leading/trailing spaces and dots
        sanitized = sanitized.strip(' .')
        
        # Ensure filename isn't too long (Windows limit is 255 chars)
        if len(sanitized) > 250:  # Leave some buffer
            name, ext = os.path.splitext(sanitized)
            sanitized = name[:240] + ext
        
        # Ensure we have a valid filename
        if not sanitized or sanitized in ['.', '..']:
            sanitized = 'file_' + datetime.now().strftime('%Y%m%d_%H%M%S')
        
        return sanitized
    
    def determine_target_path(self, metadata: Dict[str, Any], base_target_dir: str) -> str:
        """
        Determine the target directory path for a file based on its metadata.
        
        Args:
            metadata: File metadata from analysis
            base_target_dir: Base directory where files should be organized
            
        Returns:
            Target directory path
        """
        category = metadata["category"]
        file_type = metadata["type"]
        
        # Get category-specific path
        category_path = self.category_paths.get(category)
        if category_path:
            target_dir = os.path.join(base_target_dir, category_path)
        else:
            # Default organization by category and file type
            target_dir = os.path.join(base_target_dir, category, file_type)
        
        # Create directory if it doesn't exist
        os.makedirs(target_dir, exist_ok=True)
        
        return target_dir
    
    def organize_file(self, source_path: str, metadata: Dict[str, Any], 
                     base_target_dir: str, dry_run: bool = True) -> Dict[str, Any]:
        """
        Organize a file by renaming and moving it to the appropriate location.
        
        Args:
            source_path: Current path of the file
            metadata: File metadata from analysis
            base_target_dir: Base directory where files should be organized
            dry_run: If True, only simulate the operation
            
        Returns:
            Dictionary containing organization results
        """
        result = {
            "source_path": source_path,
            "target_path": None,
            "new_filename": None,
            "success": False,
            "action": "dry_run" if dry_run else "moved",
            "timestamp": datetime.now().isoformat()
        }
        
        try:
            # Generate new filename
            new_filename = self.generate_smart_filename(metadata)
            result["new_filename"] = new_filename
            
            # Determine target directory
            target_dir = self.determine_target_path(metadata, base_target_dir)
            target_path = os.path.join(target_dir, new_filename)
            result["target_path"] = target_path
            
            # Handle filename conflicts
            if os.path.exists(target_path) and target_path != source_path:
                target_path = self._handle_filename_conflict(target_path)
                result["new_filename"] = os.path.basename(target_path)
                result["target_path"] = target_path
            
            if not dry_run:
                # Perform the actual move
                shutil.move(source_path, target_path)
                result["success"] = True
                result["action"] = "moved"
            else:
                # For dry run, just verify the target path is valid
                result["success"] = True
                result["action"] = "dry_run"
                
        except Exception as e:
            result["error"] = str(e)
            result["success"] = False
        
        return result
    
    def _handle_filename_conflict(self, target_path: str) -> str:
        """Handle filename conflicts by adding a number suffix."""
        base, ext = os.path.splitext(target_path)
        counter = 1
        
        while os.path.exists(target_path):
            target_path = f"{base}_{counter}{ext}"
            counter += 1
        
        return target_path
    
    def organize_directory(self, source_dir: str, base_target_dir: str, 
                          recursive: bool = True, dry_run: bool = True) -> List[Dict[str, Any]]:
        """
        Organize all files in a directory.
        
        Args:
            source_dir: Directory to organize
            base_target_dir: Base directory where files should be organized
            recursive: Whether to process subdirectories
            dry_run: If True, only simulate the operations
            
        Returns:
            List of organization results for each file
        """
        results = []
        
        if recursive:
            # Process all files recursively
            for root, dirs, files in os.walk(source_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    # Skip if it's already in the target directory
                    if not file_path.startswith(base_target_dir):
                        # For now, we'll skip actual analysis and use basic metadata
                        # In a real implementation, this would call the file analysis
                        basic_metadata = {
                            "filename": file,
                            "type": self._guess_file_type(file),
                            "category": "uncategorized",
                            "tags": [],
                            "summary": "",
                            "modified_time": None
                        }
                        
                        result = self.organize_file(file_path, basic_metadata, base_target_dir, dry_run)
                        results.append(result)
        else:
            # Process only top-level files
            for file in os.listdir(source_dir):
                file_path = os.path.join(source_dir, file)
                if os.path.isfile(file_path):
                    # Skip if it's already in the target directory
                    if not file_path.startswith(base_target_dir):
                        basic_metadata = {
                            "filename": file,
                            "type": self._guess_file_type(file),
                            "category": "uncategorized",
                            "tags": [],
                            "summary": "",
                            "modified_time": None
                        }
                        
                        result = self.organize_file(file_path, basic_metadata, base_target_dir, dry_run)
                        results.append(result)
        
        return results
    
    def _guess_file_type(self, filename: str) -> str:
        """Guess file type based on extension."""
        _, ext = os.path.splitext(filename)
        ext = ext.lower()
        
        if ext in [".txt", ".md", ".json", ".py", ".js", ".html", ".css"]:
            return "text"
        elif ext in [".jpg", ".jpeg", ".png", ".gif", ".bmp"]:
            return "image"
        elif ext in [".pdf", ".docx", ".xlsx", ".pptx"]:
            return "document"
        elif ext in [".zip", ".gz", ".tar"]:
            return "archive"
        elif ext in [".mp3", ".wav", ".ogg"]:
            return "audio"
        elif ext in [".mp4", ".mov", ".avi"]:
            return "video"
        else:
            return "binary"
    
    def generate_organization_report(self, results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate a summary report of organization operations."""
        report = {
            "total_files_processed": len(results),
            "files_moved": 0,
            "files_skipped": 0,
            "errors": 0,
            "category_breakdown": {},
            "file_type_breakdown": {},
            "dry_run": True,
            "timestamp": datetime.now().isoformat()
        }
        
        for result in results:
            if result.get("dry_run", False):
                report["dry_run"] = True
            
            if result.get("success", False):
                if result.get("action") == "moved":
                    report["files_moved"] += 1
                else:
                    report["files_skipped"] += 1
            else:
                report["errors"] += 1
        
        return report

def create_organizer_from_config(config: Dict[str, Any]) -> SmartOrganizer:
    """Create an organizer instance from agent configuration."""
    organization_rules = config.get("organization", {
        "naming_templates": {
            "default": "{date}_{category}_{keywords}{ext}",
            "business": "{date}_business_{keywords}{ext}",
            "personal": "{date}_personal_{keywords}{ext}",
            "legal": "{date}_legal_{keywords}{ext}"
        },
        "category_paths": {
            "business": "Business/Documents",
            "personal": "Personal/Documents", 
            "legal": "Legal/Documents",
            "images": "Media/Images",
            "audio": "Media/Audio",
            "video": "Media/Video"
        },
        "date_format": "%Y-%m-%d"
    })
    
    return SmartOrganizer(organization_rules)

if __name__ == "__main__":
    # Example usage
    test_config = {
        "organization": {
            "naming_templates": {
                "default": "{date}_{category}_{keywords}{ext}",
                "business": "{date}_business_{keywords}{ext}",
                "personal": "{date}_personal_{keywords}{ext}"
            },
            "category_paths": {
                "business": "Business/Documents",
                "personal": "Personal/Documents",
                "images": "Media/Images"
            },
            "date_format": "%Y-%m-%d"
        }
    }
    
    organizer = create_organizer_from_config(test_config)
    
    # Test metadata
    test_metadata = {
        "filename": "document.txt",
        "type": "text",
        "category": "business",
        "tags": ["jls", "business", "plan"],
        "summary": "This document contains JLS business plans and strategies",
        "modified_time": "2026-02-02T10:30:00"
    }
    
    # Test filename generation
    new_filename = organizer.generate_smart_filename(test_metadata)
    print(f"Generated filename: {new_filename}")
    
    # Test target path determination
    target_dir = organizer.determine_target_path(test_metadata, "/organized")
    print(f"Target directory: {target_dir}")
    
    print("\nSmart organizer initialized successfully!")