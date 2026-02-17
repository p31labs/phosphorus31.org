import re
import os
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime

class SensitiveDataScrubber:
    """Handles detection and scrubbing of sensitive information from files."""
    
    def __init__(self, scrub_rules: Dict[str, Any]):
        """
        Initialize the scrubber with rules for what to scrub and how.
        
        Args:
            scrub_rules: Dictionary containing scrubbing configuration
        """
        self.scrub_rules = scrub_rules
        self.patterns = self._compile_patterns()
        
    def _compile_patterns(self) -> Dict[str, re.Pattern]:
        """Compile regex patterns for performance."""
        patterns = {}
        
        # Default sensitive patterns
        default_patterns = {
            "email": r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            "phone": r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
            "ssn": r'\b\d{3}-\d{2}-\d{4}\b',
            "credit_card": r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b',
            "ip_address": r'\b(?:\d{1,3}\.){3}\d{1,3}\b',
            "social_security": r'\b\d{3}-\d{2}-\d{4}\b',
            "passport": r'\b[A-Z0-9]{6,9}\b',
            "bank_account": r'\b\d{8,17}\b',
            "routing_number": r'\b\d{9}\b'
        }
        
        # Add custom patterns from configuration
        custom_patterns = self.scrub_rules.get("custom_patterns", {})
        all_patterns = {**default_patterns, **custom_patterns}
        
        # Compile patterns for performance
        for name, pattern in all_patterns.items():
            try:
                patterns[name] = re.compile(pattern, re.IGNORECASE)
            except re.error as e:
                print(f"Warning: Invalid regex pattern for {name}: {e}")
        
        return patterns
    
    def detect_sensitive_data(self, content: str) -> List[Dict[str, Any]]:
        """
        Detect sensitive information in content.
        
        Args:
            content: The content to scan
            
        Returns:
            List of detected sensitive information
        """
        detections = []
        
        for data_type, pattern in self.patterns.items():
            matches = pattern.findall(content)
            if matches:
                detections.append({
                    "type": data_type,
                    "matches": matches,
                    "count": len(matches),
                    "locations": self._find_locations(content, pattern)
                })
        
        return detections
    
    def _find_locations(self, content: str, pattern: re.Pattern) -> List[Dict[str, int]]:
        """Find character positions of matches in content."""
        locations = []
        for match in pattern.finditer(content):
            locations.append({
                "start": match.start(),
                "end": match.end(),
                "text": match.group()
            })
        return locations
    
    def scrub_content(self, content: str, scrub_mode: str = "replace") -> Tuple[str, List[Dict[str, Any]]]:
        """
        Scrub sensitive information from content.
        
        Args:
            content: The content to scrub
            scrub_mode: How to handle sensitive data ("replace", "remove", "mask")
            
        Returns:
            Tuple of (scrubbed_content, scrubbing_report)
        """
        scrubbed_content = content
        scrubbing_report = []
        
        # Sort patterns by length to handle overlapping matches properly
        sorted_patterns = sorted(
            self.patterns.items(), 
            key=lambda x: len(x[1].pattern), 
            reverse=True
        )
        
        for data_type, pattern in sorted_patterns:
            matches = pattern.findall(content)
            if matches:
                if scrub_mode == "replace":
                    scrubbed_content = pattern.sub(f"[REDACTED_{data_type.upper()}]", scrubbed_content)
                elif scrub_mode == "remove":
                    scrubbed_content = pattern.sub("", scrubbed_content)
                elif scrub_mode == "mask":
                    scrubbed_content = self._mask_matches(scrubbed_content, pattern)
                
                scrubbing_report.append({
                    "type": data_type,
                    "original_count": len(matches),
                    "scrubbed_count": len(pattern.findall(scrubbed_content)) if scrub_mode != "remove" else 0,
                    "action": scrub_mode
                })
        
        return scrubbed_content, scrubbing_report
    
    def _mask_matches(self, content: str, pattern: re.Pattern) -> str:
        """Mask sensitive data by replacing with asterisks while preserving length."""
        def mask_replacement(match):
            matched_text = match.group()
            if '@' in matched_text:  # Email masking
                local, domain = matched_text.split('@', 1)
                masked_local = local[0] + '*' * (len(local) - 2) + local[-1] if len(local) > 2 else '*'
                return f"{masked_local}@{domain}"
            else:  # General masking
                return '*' * len(matched_text)
        
        return pattern.sub(mask_replacement, content)
    
    def scrub_file(self, filepath: str, backup: bool = True) -> Dict[str, Any]:
        """
        Scrub sensitive information from a file.
        
        Args:
            filepath: Path to the file to scrub
            backup: Whether to create a backup before scrubbing
            
        Returns:
            Dictionary containing scrubbing results
        """
        result = {
            "filepath": filepath,
            "success": False,
            "original_size": 0,
            "scrubbed_size": 0,
            "detections": [],
            "scrubbing_report": [],
            "backup_created": False,
            "timestamp": datetime.now().isoformat()
        }
        
        try:
            # Read original content
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                original_content = f.read()
            
            result["original_size"] = len(original_content)
            
            # Create backup if requested
            if backup:
                backup_path = f"{filepath}.backup"
                with open(backup_path, 'w', encoding='utf-8') as f:
                    f.write(original_content)
                result["backup_created"] = True
                result["backup_path"] = backup_path
            
            # Detect sensitive information
            result["detections"] = self.detect_sensitive_data(original_content)
            
            # Only scrub if sensitive data was found
            if result["detections"]:
                scrub_mode = self.scrub_rules.get("mode", "replace")
                scrubbed_content, scrubbing_report = self.scrub_content(original_content, scrub_mode)
                
                result["scrubbing_report"] = scrubbing_report
                result["scrubbed_size"] = len(scrubbed_content)
                
                # Write scrubbed content back
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(scrubbed_content)
                
                result["success"] = True
            else:
                result["message"] = "No sensitive information detected"
                
        except Exception as e:
            result["error"] = str(e)
            result["success"] = False
        
        return result
    
    def generate_scrubbing_summary(self, scrubbing_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate a summary of scrubbing operations."""
        summary = {
            "total_files_processed": len(scrubbing_results),
            "files_with_sensitive_data": 0,
            "total_detections": 0,
            "detection_types": {},
            "scrubbing_actions": {},
            "total_original_size": 0,
            "total_scrubbed_size": 0,
            "space_saved": 0
        }
        
        for result in scrubbing_results:
            if result.get("success", False):
                summary["files_with_sensitive_data"] += 1
                
                # Count detections
                for detection in result.get("detections", []):
                    summary["total_detections"] += detection["count"]
                    summary["detection_types"][detection["type"]] = \
                        summary["detection_types"].get(detection["type"], 0) + detection["count"]
                
                # Count scrubbing actions
                for action in result.get("scrubbing_report", []):
                    summary["scrubbing_actions"][action["action"]] = \
                        summary["scrubbing_actions"].get(action["action"], 0) + 1
            
            summary["total_original_size"] += result.get("original_size", 0)
            summary["total_scrubbed_size"] += result.get("scrubbed_size", 0)
        
        summary["space_saved"] = summary["total_original_size"] - summary["total_scrubbed_size"]
        summary["timestamp"] = datetime.now().isoformat()
        
        return summary

def create_scrubber_from_config(config: Dict[str, Any]) -> SensitiveDataScrubber:
    """Create a scrubber instance from agent configuration."""
    scrub_rules = config.get("scrubbing", {
        "mode": "replace",
        "custom_patterns": {},
        "enabled": True
    })
    
    return SensitiveDataScrubber(scrub_rules)

if __name__ == "__main__":
    # Example usage
    test_config = {
        "scrubbing": {
            "mode": "mask",
            "custom_patterns": {
                "jls_references": r'\bJLS\b',
                "personal_names": r'\b(Sandra|Will)\b'
            },
            "enabled": True
        }
    }
    
    scrubber = create_scrubber_from_config(test_config)
    
    test_content = """
    Contact information:
    Email: sandra@example.com
    Phone: 555-123-4567
    SSN: 123-45-6789
    
    This document contains JLS business plans and personal information.
    """
    
    print("Original content:")
    print(test_content)
    print("\n" + "="*50 + "\n")
    
    # Detect sensitive data
    detections = scrubber.detect_sensitive_data(test_content)
    print("Detected sensitive data:")
    for detection in detections:
        print(f"- {detection['type']}: {detection['matches']}")
    
    print("\n" + "="*50 + "\n")
    
    # Scrub content
    scrubbed_content, report = scrubber.scrub_content(test_content, "mask")
    print("Scrubbed content:")
    print(scrubbed_content)
    print("\nScrubbing report:")
    for item in report:
        print(f"- {item['type']}: {item['original_count']} instances {item['action']}d")