#!/usr/bin/env python3
"""
🔍 AUTO-DISCOVERY MODULE

Automatically discovers all components in the Sovereign ecosystem.
Builds a dynamic map of everything that exists.
"""

import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional
import logging

logger = logging.getLogger("auto_discovery")

class SystemDiscoverer:
    """Discovers all components in the system"""
    
    def __init__(self, root_path: str = "."):
        self.root_path = Path(root_path)
        self.components = {
            "frontend": [],
            "backend": [], 
            "databases": [],
            "services": [],
            "hardware": [],
            "scripts": [],
            "configs": [],
            "docs": []
        }
    
    def discover_frontend(self):
        """Discover frontend components"""
        logger.info("🔍 Discovering frontend...")
        
        # Dashboard
        dashboard_path = self.root_path / "dashboard"
        if dashboard_path.exists():
            self.components["frontend"].append({
                "name": "Sovereign Dashboard",
                "type": "React",
                "path": str(dashboard_path),
                "package_json": dashboard_path / "package.json" if (dashboard_path / "package.json").exists() else None,
                "port": 5173,
                "status": "unknown"
            })
        
        # Wonky Sprout (kids zone)
        wonky_path = self.root_path / "wonky-sprout"
        if wonky_path.exists():
            self.components["frontend"].append({
                "name": "Wonky Sprout",
                "type": "React (Kids Zone)",
                "path": str(wonky_path),
                "package_json": wonky_path / "package.json" if (wonky_path / "package.json").exists() else None,
                "port": 5174,
                "status": "unknown"
            })
    
    def discover_backend(self):
        """Discover backend components"""
        logger.info("🔍 Discovering backend...")
        
        # Main backend
        backend_path = self.root_path / "backend"
        if backend_path.exists():
            self.components["backend"].append({
                "name": "Sovereign Backend",
                "type": "Python/FastAPI",
                "path": str(backend_path),
                "requirements": backend_path / "requirements.txt" if (backend_path / "requirements.txt").exists() else None,
                "port": 8000,
                "status": "unknown"
            })
        
        # Ollama models
        ollama_path = self.root_path / "backend" / "ollama_models"
        if ollama_path.exists():
            models = list(ollama_path.glob("*.modelfile"))
            self.components["backend"].append({
                "name": "Ollama AI Models",
                "type": "Local AI",
                "path": str(ollama_path),
                "models": [m.stem for m in models],
                "status": "unknown"
            })
    
    def discover_databases(self):
        """Discover databases"""
        logger.info("🔍 Discovering databases...")
        
        # PostgreSQL
        self.components["databases"].append({
            "name": "PostgreSQL",
            "type": "SQL Database",
            "port": 5432,
            "docker_service": "postgres",
            "status": "unknown"
        })
        
        # Redis
        self.components["databases"].append({
            "name": "Redis",
            "type": "Cache/Queue",
            "port": 6379,
            "docker_service": "redis",
            "status": "unknown"
        })
    
    def discover_services(self):
        """Discover services"""
        logger.info("🔍 Discovering services...")
        
        # Docker services from docker-compose.yml
        docker_compose = self.root_path / "docker-compose.yml"
        if docker_compose.exists():
            self.components["services"].append({
                "name": "Docker Orchestration",
                "type": "Container Management",
                "config": str(docker_compose),
                "status": "unknown"
            })
        
        # Monitoring services
        monitoring_compose = self.root_path / "docker-compose.monitoring.yml"
        if monitoring_compose.exists():
            self.components["services"].append({
                "name": "Monitoring Stack",
                "type": "Prometheus/Grafana",
                "config": str(monitoring_compose),
                "status": "unknown"
            })
    
    def discover_hardware(self):
        """Discover hardware components"""
        logger.info("🔍 Discovering hardware...")
        
        # Phenix Phantom (ESP32)
        phantom_path = self.root_path / "phenix_phantom"
        if phantom_path.exists():
            self.components["hardware"].append({
                "name": "Phenix Phantom",
                "type": "ESP32 Firmware",
                "path": str(phantom_path),
                "status": "unknown"
            })
    
    def discover_scripts(self):
        """Discover automation scripts"""
        logger.info("🔍 Discovering scripts...")
        
        scripts_path = self.root_path / "scripts"
        if scripts_path.exists():
            for script_file in scripts_path.glob("*.py"):
                self.components["scripts"].append({
                    "name": script_file.stem.replace("_", " ").title(),
                    "type": "Python Script",
                    "path": str(script_file),
                    "status": "exists"
                })
            
            for script_file in scripts_path.glob("*.sh"):
                self.components["scripts"].append({
                    "name": script_file.stem.replace("_", " ").title(),
                    "type": "Shell Script",
                    "path": str(script_file),
                    "status": "exists"
                })
    
    def discover_configs(self):
        """Discover configuration files"""
        logger.info("🔍 Discovering configs...")
        
        # Environment files
        env_files = list(self.root_path.glob("*.env*"))
        for env_file in env_files:
            self.components["configs"].append({
                "name": f"Environment: {env_file.name}",
                "type": "Configuration",
                "path": str(env_file),
                "status": "exists"
            })
        
        # Config directory
        config_path = self.root_path / "config"
        if config_path.exists():
            for config_file in config_path.glob("*.json*"):
                self.components["configs"].append({
                    "name": f"Config: {config_file.name}",
                    "type": "JSON Configuration",
                    "path": str(config_file),
                    "status": "exists"
                })
    
    def discover_docs(self):
        """Discover documentation"""
        logger.info("🔍 Discovering docs...")
        
        # Markdown documentation
        md_files = list(self.root_path.glob("*.md"))
        for md_file in md_files:
            self.components["docs"].append({
                "name": md_file.stem.replace("_", " ").title(),
                "type": "Documentation",
                "path": str(md_file),
                "status": "exists"
            })
        
        # Genesis Gate
        genesis_path = self.root_path / "genesis-gate"
        if genesis_path.exists():
            gs_files = list(genesis_path.glob("*.gs"))
            for gs_file in gs_files:
                self.components["docs"].append({
                    "name": f"Genesis Gate: {gs_file.name}",
                    "type": "Google Apps Script",
                    "path": str(gs_file),
                    "status": "exists"
                })
    
    def discover_all(self) -> Dict[str, List[Dict[str, Any]]]:
        """Discover everything"""
        logger.info("🚀 Starting system discovery...")
        
        discovery_methods = [
            self.discover_frontend,
            self.discover_backend,
            self.discover_databases,
            self.discover_services,
            self.discover_hardware,
            self.discover_scripts,
            self.discover_configs,
            self.discover_docs
        ]
        
        for method in discovery_methods:
            try:
                method()
            except Exception as e:
                logger.error(f"Discovery method {method.__name__} failed: {e}")
        
        # Count discoveries
        total = sum(len(components) for components in self.components.values())
        logger.info(f"🎯 Discovery complete: Found {total} components")
        
        return self.components
    
    def generate_discovery_report(self) -> str:
        """Generate a human-readable discovery report"""
        components = self.discover_all()
        
        report_lines = [
            "🔍 SOVEREIGN SYSTEM DISCOVERY REPORT",
            "=" * 50,
            f"Generated: {subprocess.check_output(['date']).decode().strip()}",
            ""
        ]
        
        for category, items in components.items():
            if items:
                report_lines.append(f"📦 {category.upper()} ({len(items)} items)")
                report_lines.append("-" * 40)
                
                for item in items:
                    report_lines.append(f"  • {item['name']}")
                    report_lines.append(f"    Type: {item.get('type', 'Unknown')}")
                    if 'path' in item:
                        report_lines.append(f"    Path: {item['path']}")
                    if 'port' in item:
                        report_lines.append(f"    Port: {item['port']}")
                    if 'models' in item:
                        report_lines.append(f"    Models: {', '.join(item['models'])}")
                    report_lines.append(f"    Status: {item.get('status', 'unknown')}")
                    report_lines.append("")
        
        # Summary
        report_lines.append("=" * 50)
        report_lines.append("📊 DISCOVERY SUMMARY")
        total_components = sum(len(items) for items in components.values())
        report_lines.append(f"Total components discovered: {total_components}")
        
        for category, items in components.items():
            if items:
                report_lines.append(f"  {category}: {len(items)}")
        
        report_lines.append("")
        report_lines.append("💜 THE SYSTEM IS KNOWN. THE MESH HOLDS. 🔺")
        
        return "\n".join(report_lines)
    
    def save_discovery_map(self, output_path: Optional[str] = None):
        """Save discovery map to JSON file"""
        if output_path is None:
            output_path = self.root_path / "discovery_map.json"
        
        discovery_data = {
            "components": self.components,
            "timestamp": subprocess.check_output(['date', '-Iseconds']).decode().strip(),
            "total_components": sum(len(items) for items in self.components.values())
        }
        
        with open(output_path, 'w') as f:
            json.dump(discovery_data, f, indent=2)
        
        logger.info(f"🗺️ Discovery map saved to {output_path}")
        return output_path

def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Discover Sovereign system components")
    parser.add_argument("--report", action="store_true", help="Generate discovery report")
    parser.add_argument("--json", action="store_true", help="Save discovery map as JSON")
    parser.add_argument("--path", default=".", help="Root path to discover from")
    
    args = parser.parse_args()
    
    discoverer = SystemDiscoverer(args.path)
    
    if args.report:
        report = discoverer.generate_discovery_report()
        print(report)
    
    if args.json:
        output_path = discoverer.save_discovery_map()
        print(f"Discovery map saved to: {output_path}")
    
    if not args.report and not args.json:
        # Default: generate report
        report = discoverer.generate_discovery_report()
        print(report)

if __name__ == "__main__":
    main()
