import os
import json
import time
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
from pathlib import Path
import hashlib

class DriveSync:
    """Handles synchronization between local files and Google Drive."""
    
    def __init__(self, drive_config: Dict[str, Any]):
        """
        Initialize the Drive sync with configuration.
        
        Args:
            drive_config: Dictionary containing Google Drive configuration
        """
        self.config = drive_config
        self.sync_state_file = self.config.get("sync_state_file", "drive_sync_state.json")
        self.local_base_dir = self.config.get("local_base_dir", "")
        self.drive_base_folder = self.config.get("drive_base_folder", "GENESIS_GATE_ORGANIZED")
        self.sync_state = self._load_sync_state()
        
    def _load_sync_state(self) -> Dict[str, Any]:
        """Load the previous sync state from file."""
        if os.path.exists(self.sync_state_file):
            try:
                with open(self.sync_state_file, 'r') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading sync state: {e}")
        
        return {
            "last_sync": None,
            "file_states": {},
            "drive_file_ids": {}
        }
    
    def _save_sync_state(self) -> None:
        """Save the current sync state to file."""
        try:
            with open(self.sync_state_file, 'w') as f:
                json.dump(self.sync_state, f, indent=2)
        except Exception as e:
            print(f"Error saving sync state: {e}")
    
    def calculate_file_hash(self, filepath: str) -> str:
        """Calculate MD5 hash of a file for change detection."""
        hash_md5 = hashlib.md5()
        try:
            with open(filepath, "rb") as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hash_md5.update(chunk)
            return hash_md5.hexdigest()
        except Exception as e:
            print(f"Error calculating hash for {filepath}: {e}")
            return ""
    
    def get_file_metadata(self, filepath: str) -> Dict[str, Any]:
        """Get file metadata for sync tracking."""
        try:
            stat = os.stat(filepath)
            return {
                "size": stat.st_size,
                "mtime": stat.st_mtime,
                "hash": self.calculate_file_hash(filepath),
                "relative_path": os.path.relpath(filepath, self.local_base_dir)
            }
        except Exception as e:
            print(f"Error getting metadata for {filepath}: {e}")
            return {}
    
    def detect_changes(self, local_files: List[str]) -> Dict[str, List[str]]:
        """
        Detect which files have changed since last sync.
        
        Args:
            local_files: List of local file paths to check
            
        Returns:
            Dictionary with 'new', 'modified', 'deleted' file lists
        """
        changes = {
            "new": [],
            "modified": [],
            "deleted": [],
            "unchanged": []
        }
        
        current_files = set(local_files)
        previous_files = set(self.sync_state["file_states"].keys())
        
        # Check for new and modified files
        for filepath in current_files:
            metadata = self.get_file_metadata(filepath)
            if not metadata:
                continue
                
            relative_path = metadata["relative_path"]
            
            if relative_path not in self.sync_state["file_states"]:
                # New file
                changes["new"].append(filepath)
            else:
                # Check if file has changed
                prev_state = self.sync_state["file_states"][relative_path]
                if (metadata["hash"] != prev_state.get("hash") or 
                    metadata["mtime"] != prev_state.get("mtime")):
                    changes["modified"].append(filepath)
                else:
                    changes["unchanged"].append(filepath)
        
        # Check for deleted files
        for relative_path in previous_files:
            if relative_path not in [os.path.relpath(f, self.local_base_dir) for f in current_files]:
                changes["deleted"].append(relative_path)
        
        return changes
    
    def should_sync_file(self, filepath: str, metadata: Dict[str, Any]) -> bool:
        """Determine if a file should be synced based on rules."""
        # Skip certain file types
        skip_extensions = self.config.get("skip_extensions", [
            ".tmp", ".log", ".cache", ".bak", ".swp"
        ])
        
        _, ext = os.path.splitext(filepath)
        if ext.lower() in skip_extensions:
            return False
        
        # Skip files that are too large (configurable limit)
        max_size = self.config.get("max_file_size_mb", 100) * 1024 * 1024
        if metadata.get("size", 0) > max_size:
            print(f"Skipping {filepath} - file too large ({metadata['size'] / 1024 / 1024:.2f}MB)")
            return False
        
        # Skip files in certain directories
        skip_dirs = self.config.get("skip_directories", [
            "__pycache__", ".git", "node_modules", ".vscode"
        ])
        
        path_parts = Path(filepath).parts
        for skip_dir in skip_dirs:
            if skip_dir in path_parts:
                return False
        
        return True
    
    def simulate_sync(self, changes: Dict[str, List[str]]) -> Dict[str, Any]:
        """
        Simulate the sync operation without actually uploading to Drive.
        
        Args:
            changes: Dictionary of file changes from detect_changes()
            
        Returns:
            Simulation results
        """
        simulation = {
            "timestamp": datetime.now().isoformat(),
            "total_files": len(changes["new"]) + len(changes["modified"]) + len(changes["deleted"]),
            "new_files": len(changes["new"]),
            "modified_files": len(changes["modified"]),
            "deleted_files": len(changes["deleted"]),
            "operations": [],
            "estimated_time": 0,
            "estimated_bandwidth": 0
        }
        
        # Simulate new and modified files
        for filepath in changes["new"] + changes["modified"]:
            metadata = self.get_file_metadata(filepath)
            if metadata and self.should_sync_file(filepath, metadata):
                operation = {
                    "action": "upload" if filepath in changes["new"] else "update",
                    "file": filepath,
                    "size": metadata["size"],
                    "relative_path": metadata["relative_path"]
                }
                simulation["operations"].append(operation)
                simulation["estimated_bandwidth"] += metadata["size"]
        
        # Simulate deletions
        for relative_path in changes["deleted"]:
            operation = {
                "action": "delete",
                "file": relative_path,
                "size": 0
            }
            simulation["operations"].append(operation)
        
        # Estimate time (rough calculation: 10MB per minute)
        estimated_mb = simulation["estimated_bandwidth"] / (1024 * 1024)
        simulation["estimated_time"] = estimated_mb / 10  # minutes
        
        return simulation
    
    def update_sync_state(self, local_files: List[str]) -> None:
        """Update the sync state with current file information."""
        for filepath in local_files:
            metadata = self.get_file_metadata(filepath)
            if metadata:
                relative_path = metadata["relative_path"]
                self.sync_state["file_states"][relative_path] = {
                    "size": metadata["size"],
                    "mtime": metadata["mtime"],
                    "hash": metadata["hash"],
                    "last_synced": datetime.now().isoformat()
                }
        
        self.sync_state["last_sync"] = datetime.now().isoformat()
        self._save_sync_state()
    
    def generate_sync_report(self, simulation: Dict[str, Any], success: bool = True) -> Dict[str, Any]:
        """Generate a detailed sync report."""
        report = {
            "sync_session": {
                "start_time": simulation["timestamp"],
                "end_time": datetime.now().isoformat(),
                "success": success,
                "mode": "simulation" if self.config.get("simulation_mode", True) else "live"
            },
            "file_operations": simulation,
            "summary": {
                "total_operations": len(simulation["operations"]),
                "upload_operations": len([op for op in simulation["operations"] if op["action"] in ["upload", "update"]]),
                "delete_operations": len([op for op in simulation["operations"] if op["action"] == "delete"]),
                "skipped_files": simulation["total_files"] - len(simulation["operations"])
            },
            "performance": {
                "estimated_bandwidth_mb": simulation["estimated_bandwidth"] / (1024 * 1024),
                "estimated_time_minutes": simulation["estimated_time"],
                "files_per_minute": len(simulation["operations"]) / max(simulation["estimated_time"], 0.1)
            }
        }
        
        return report
    
    def sync_directory(self, local_dir: str, dry_run: bool = True) -> Dict[str, Any]:
        """
        Synchronize a local directory with Google Drive.
        
        Args:
            local_dir: Local directory to sync
            dry_run: If True, only simulate the sync
            
        Returns:
            Sync results and report
        """
        print(f"Starting Drive sync for: {local_dir}")
        
        # Get all local files
        local_files = []
        for root, dirs, files in os.walk(local_dir):
            # Skip hidden directories and common system directories
            dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['__pycache__', '.git', 'node_modules']]
            
            for file in files:
                if not file.startswith('.'):  # Skip hidden files
                    local_files.append(os.path.join(root, file))
        
        print(f"Found {len(local_files)} local files to process")
        
        # Detect changes
        changes = self.detect_changes(local_files)
        print(f"Detected changes: {len(changes['new'])} new, {len(changes['modified'])} modified, {len(changes['deleted'])} deleted")
        
        # Simulate or perform actual sync
        if dry_run or self.config.get("simulation_mode", True):
            simulation = self.simulate_sync(changes)
            report = self.generate_sync_report(simulation, success=True)
            
            print("\n=== SYNC SIMULATION RESULTS ===")
            print(f"New files: {simulation['new_files']}")
            print(f"Modified files: {simulation['modified_files']}")
            print(f"Deleted files: {simulation['deleted_files']}")
            print(f"Estimated bandwidth: {simulation['estimated_bandwidth'] / (1024*1024):.2f} MB")
            print(f"Estimated time: {simulation['estimated_time']:.2f} minutes")
            
        else:
            # Actual sync would go here
            # This would require Google Drive API implementation
            print("Live sync mode - would upload to Google Drive")
            simulation = self.simulate_sync(changes)
            report = self.generate_sync_report(simulation, success=True)
        
        # Update sync state
        if not dry_run:
            self.update_sync_state(local_files)
        
        return report

def create_drive_sync_from_config(config: Dict[str, Any]) -> DriveSync:
    """Create a Drive sync instance from agent configuration."""
    drive_config = config.get("drive_sync", {
        "simulation_mode": True,
        "sync_state_file": "drive_sync_state.json",
        "local_base_dir": "",
        "drive_base_folder": "GENESIS_GATE_ORGANIZED",
        "skip_extensions": [".tmp", ".log", ".cache", ".bak", ".swp"],
        "skip_directories": ["__pycache__", ".git", "node_modules", ".vscode"],
        "max_file_size_mb": 100
    })
    
    return DriveSync(drive_config)

if __name__ == "__main__":
    # Example usage
    test_config = {
        "drive_sync": {
            "simulation_mode": True,
            "sync_state_file": "test_sync_state.json",
            "local_base_dir": "/test/local",
            "drive_base_folder": "Test_Organized",
            "skip_extensions": [".tmp", ".log"],
            "max_file_size_mb": 50
        }
    }
    
    drive_sync = create_drive_sync_from_config(test_config)
    
    # Test with a sample directory (this would need actual files to work properly)
    print("Drive sync module initialized successfully!")
    print("Note: Actual Google Drive integration would require:")
    print("1. Google Drive API credentials")
    print("2. OAuth2 authentication setup")
    print("3. Proper API client implementation")