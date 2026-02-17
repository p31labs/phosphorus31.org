#!/usr/bin/env python3
"""
🤖 SOVEREIGN ORCHESTRATOR - AUTOMATION TO 11/10

This is the brain of the automation system.
It coordinates all parts of the Sovereign ecosystem:
- Setup
- Deployment
- Monitoring
- Healing
- Documentation
- Everything

THE MESH HOLDS. 🔺
"""

import asyncio
import logging
import json
import subprocess
import sys
import time
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict, field
import requests

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("sovereign_orchestrator")

@dataclass
class SystemState:
    """Current state of the entire system"""
    dashboard_running: bool = False
    backend_running: bool = False
    database_running: bool = False
    redis_running: bool = False
    ollama_running: bool = False
    docker_healthy: bool = False
    last_health_check: Optional[datetime] = None
    errors: Optional[List[str]] = None
    warnings: Optional[List[str]] = None
    performance_metrics: Optional[Dict[str, Any]] = None
    
    def __post_init__(self):
        if self.errors is None:
            self.errors = []
        if self.warnings is None:
            self.warnings = []
        if self.performance_metrics is None:
            self.performance_metrics = {}

class HealthChecker:
    """Check health of all system components"""
    
    @staticmethod
    def check_dashboard() -> bool:
        """Check if React dashboard is running"""
        try:
            response = requests.get("http://localhost:5173", timeout=5)
            return response.status_code == 200
        except:
            return False
    
    @staticmethod
    def check_backend() -> bool:
        """Check if Python backend is running"""
        try:
            response = requests.get("http://localhost:8000/api/health", timeout=5)
            return response.status_code == 200
        except:
            return False
    
    @staticmethod
    def check_database() -> bool:
        """Check if PostgreSQL is running"""
        try:
            result = subprocess.run(
                ["docker", "ps", "--filter", "name=postgres", "--format", "{{.Status}}"],
                capture_output=True,
                text=True
            )
            return "Up" in result.stdout
        except:
            return False
    
    @staticmethod
    def check_redis() -> bool:
        """Check if Redis is running"""
        try:
            result = subprocess.run(
                ["docker", "ps", "--filter", "name=redis", "--format", "{{.Status}}"],
                capture_output=True,
                text=True
            )
            return "Up" in result.stdout
        except:
            return False
    
    @staticmethod
    def check_ollama() -> bool:
        """Check if Ollama is running"""
        try:
            result = subprocess.run(["ollama", "list"], capture_output=True, text=True)
            return result.returncode == 0
        except:
            return False
    
    @staticmethod
    def check_docker() -> bool:
        """Check if Docker is running"""
        try:
            result = subprocess.run(["docker", "info"], capture_output=True, text=True)
            return result.returncode == 0
        except:
            return False

class AutoHealer:
    """Automatically heal broken components"""
    
    def __init__(self):
        self.healing_actions = {
            "dashboard": self.heal_dashboard,
            "backend": self.heal_backend,
            "database": self.heal_database,
            "redis": self.heal_redis,
            "docker": self.heal_docker
        }
    
    def heal_dashboard(self) -> bool:
        """Restart the dashboard"""
        logger.info("🔄 Healing dashboard...")
        try:
            # Kill existing dashboard processes
            subprocess.run(["taskkill", "/F", "/IM", "node.exe"], capture_output=True)
            time.sleep(2)
            
            # Start dashboard
            proc = subprocess.Popen(
                ["powershell", "-NoExit", "-Command", "cd dashboard; npm run dev"],
                creationflags=subprocess.CREATE_NEW_CONSOLE
            )
            time.sleep(10)  # Give it time to start
            return True
        except Exception as e:
            logger.error(f"Failed to heal dashboard: {e}")
            return False
    
    def heal_backend(self) -> bool:
        """Restart the backend"""
        logger.info("🔄 Healing backend...")
        try:
            # Kill existing Python processes
            subprocess.run(["taskkill", "/F", "/IM", "python.exe"], capture_output=True)
            time.sleep(2)
            
            # Start backend
            proc = subprocess.Popen(
                ["powershell", "-NoExit", "-Command", "cd backend; python backend_core.py"],
                creationflags=subprocess.CREATE_NEW_CONSOLE
            )
            time.sleep(5)
            return True
        except Exception as e:
            logger.error(f"Failed to heal backend: {e}")
            return False
    
    def heal_database(self) -> bool:
        """Restart PostgreSQL"""
        logger.info("🔄 Healing database...")
        try:
            subprocess.run(["docker-compose", "restart", "postgres"], check=True)
            time.sleep(10)
            return True
        except Exception as e:
            logger.error(f"Failed to heal database: {e}")
            return False
    
    def heal_redis(self) -> bool:
        """Restart Redis"""
        logger.info("🔄 Healing redis...")
        try:
            subprocess.run(["docker-compose", "restart", "redis"], check=True)
            time.sleep(5)
            return True
        except Exception as e:
            logger.error(f"Failed to heal redis: {e}")
            return False
    
    def heal_docker(self) -> bool:
        """Restart Docker service"""
        logger.info("🔄 Restarting Docker service...")
        try:
            subprocess.run(["net", "stop", "docker"], check=True)
            time.sleep(5)
            subprocess.run(["net", "start", "docker"], check=True)
            time.sleep(10)
            return True
        except Exception as e:
            logger.error(f"Failed to restart Docker: {e}")
            return False
    
    def heal_system(self, state: SystemState) -> SystemState:
        """Heal whatever is broken"""
        healed_state = SystemState()
        
        # Check and heal each component
        if not state.docker_healthy:
            logger.warning("🚨 Docker is unhealthy, attempting to heal...")
            if self.heal_docker():
                state.docker_healthy = True
        
        if state.docker_healthy:
            # Only try to heal Docker-dependent services if Docker is healthy
            if not state.database_running:
                logger.warning("🚨 Database is down, attempting to heal...")
                if self.heal_database():
                    state.database_running = True
            
            if not state.redis_running:
                logger.warning("🚨 Redis is down, attempting to heal...")
                if self.heal_redis():
                    state.redis_running = True
        
        if not state.dashboard_running:
            logger.warning("🚨 Dashboard is down, attempting to heal...")
            if self.heal_dashboard():
                state.dashboard_running = True
        
        if not state.backend_running:
            logger.warning("🚨 Backend is down, attempting to heal...")
            if self.heal_backend():
                state.backend_running = True
        
        return state

class AutoDeployer:
    """Automatically deploy the entire system"""
    
    def __init__(self):
        self.deployment_steps = [
            self.step_check_prerequisites,
            self.step_setup_dashboard,
            self.step_setup_backend,
            self.step_setup_database,
            self.step_setup_monitoring,
            self.step_start_services,
            self.step_verify_deployment
        ]
    
    def step_check_prerequisites(self) -> bool:
        """Check if all prerequisites are installed"""
        logger.info("🔍 Checking prerequisites...")
        checks = [
            ("Node.js", ["node", "--version"]),
            ("npm", ["npm", "--version"]),
            ("Python", ["python", "--version"]),
            ("Docker", ["docker", "--version"]),
            ("Git", ["git", "--version"])
        ]
        
        all_ok = True
        for name, cmd in checks:
            try:
                result = subprocess.run(cmd, capture_output=True, text=True)
                if result.returncode == 0:
                    logger.info(f"  ✅ {name}: {result.stdout.strip()}")
                else:
                    logger.error(f"  ❌ {name} not found")
                    all_ok = False
            except:
                logger.error(f"  ❌ {name} not found")
                all_ok = False
        
        return all_ok
    
    def step_setup_dashboard(self) -> bool:
        """Setup dashboard dependencies"""
        logger.info("📊 Setting up dashboard...")
        try:
            subprocess.run(["cd", "dashboard", "&&", "npm", "install"], 
                         shell=True, check=True, capture_output=True)
            logger.info("  ✅ Dashboard dependencies installed")
            return True
        except Exception as e:
            logger.error(f"  ❌ Dashboard setup failed: {e}")
            return False
    
    def step_setup_backend(self) -> bool:
        """Setup backend dependencies"""
        logger.info("🐍 Setting up backend...")
        try:
            subprocess.run(["pip", "install", "-r", "backend/requirements.txt", "-q"], 
                         check=True, capture_output=True)
            logger.info("  ✅ Backend dependencies installed")
            return True
        except Exception as e:
            logger.error(f"  ❌ Backend setup failed: {e}")
            return False
    
    def step_setup_database(self) -> bool:
        """Setup database and run migrations"""
        logger.info("🗄️ Setting up database...")
        try:
            # Start PostgreSQL
            subprocess.run(["docker-compose", "up", "-d", "postgres"], check=True)
            time.sleep(10)
            
            # Run migrations if they exist
            if Path("phenix_data/init/phenix_schema.sql").exists():
                subprocess.run(
                    ["docker", "exec", "-i", "postgres", "psql", "-U", "postgres", "-d", "phenix"],
                    input=Path("phenix_data/init/phenix_schema.sql").read_text(),
                    text=True,
                    capture_output=True
                )
            
            logger.info("  ✅ Database setup complete")
            return True
        except Exception as e:
            logger.error(f"  ❌ Database setup failed: {e}")
            return False
    
    def step_setup_monitoring(self) -> bool:
        """Setup monitoring stack"""
        logger.info("📈 Setting up monitoring...")
        try:
            subprocess.run(["docker-compose", "-f", "docker-compose.monitoring.yml", "up", "-d"], 
                         check=True, capture_output=True)
            time.sleep(15)
            logger.info("  ✅ Monitoring stack started")
            return True
        except Exception as e:
            logger.error(f"  ❌ Monitoring setup failed: {e}")
            return False
    
    def step_start_services(self) -> bool:
        """Start all services"""
        logger.info("🚀 Starting all services...")
        try:
            # Start dashboard
            subprocess.Popen(
                ["powershell", "-NoExit", "-Command", "cd dashboard; npm run dev"],
                creationflags=subprocess.CREATE_NEW_CONSOLE
            )
            
            # Start backend
            subprocess.Popen(
                ["powershell", "-NoExit", "-Command", "cd backend; python backend_core.py"],
                creationflags=subprocess.CREATE_NEW_CONSOLE
            )
            
            time.sleep(10)
            logger.info("  ✅ Services started")
            return True
        except Exception as e:
            logger.error(f"  ❌ Failed to start services: {e}")
            return False
    
    def step_verify_deployment(self) -> bool:
        """Verify everything is working"""
        logger.info("🔍 Verifying deployment...")
        time.sleep(15)  # Give services time to start
        
        checker = HealthChecker()
        checks = [
            ("Dashboard", checker.check_dashboard()),
            ("Backend", checker.check_backend()),
            ("Database", checker.check_database()),
            ("Docker", checker.check_docker())
        ]
        
        all_ok = True
        for name, status in checks:
            if status:
                logger.info(f"  ✅ {name}: OK")
            else:
                logger.error(f"  ❌ {name}: FAILED")
                all_ok = False
        
        return all_ok
    
    def deploy_full_system(self) -> bool:
        """Run full deployment pipeline"""
        logger.info("🚀 Starting full system deployment...")
        
        results = []
        for i, step in enumerate(self.deployment_steps, 1):
            logger.info(f"\nStep {i}/{len(self.deployment_steps)}...")
            try:
                success = step()
                results.append(success)
                if not success:
                    logger.error(f"Step {i} failed, stopping deployment")
                    return False
            except Exception as e:
                logger.error(f"Step {i} crashed: {e}")
                results.append(False)
                return False
        
        success_count = sum(results)
        total_steps = len(results)
        
        if success_count == total_steps:
            logger.info(f"\n🎉 Deployment successful! {success_count}/{total_steps} steps passed")
            return True
        else:
            logger.error(f"\n💥 Deployment failed! {success_count}/{total_steps} steps passed")
            return False

class AutoDocumenter:
    """Automatically generate and update documentation"""
    
    @staticmethod
    def generate_system_report(state: SystemState) -> str:
        """Generate a system status report"""
        report = [
            "⚡ SOVEREIGN SYSTEM REPORT",
            f"Generated: {datetime.now().isoformat()}",
            "",
            "📊 SYSTEM STATUS",
            f"Dashboard: {'✅ Running' if state.dashboard_running else '❌ Down'}",
            f"Backend: {'✅ Running' if state.backend_running else '❌ Down'}",
            f"Database: {'✅ Running' if state.database_running else '❌ Down'}",
            f"Redis: {'✅ Running' if state.redis_running else '❌ Down'}",
            f"Ollama: {'✅ Running' if state.ollama_running else '❌ Down'}",
            f"Docker: {'✅ Healthy' if state.docker_healthy else '❌ Unhealthy'}",
            "",
            "⚠️ ERRORS" if state.errors else "✅ No errors",
        ]
        
        for error in state.errors:
            report.append(f"  • {error}")
        
        if state.warnings:
            report.append("")
            report.append("⚠️ WARNINGS")
            for warning in state.warnings:
                report.append(f"  • {warning}")
        
        report.append("")
        report.append("💜 THE MESH HOLDS. 🔺")
        
        return "\n".join(report)
    
    @staticmethod
    def update_documentation():
        """Update all documentation files"""
        logger.info("📝 Updating documentation...")
        # This would update AGENT_INSTRUCTIONS.md, SYSTEM_CONNECTIONS.md, etc.
        # with current system state
        pass

class SovereignOrchestrator:
    """Main orchestrator class"""
    
    def __init__(self):
        self.state = SystemState()
        self.health_checker = HealthChecker()
        self.auto_healer = AutoHealer()
        self.auto_deployer = AutoDeployer()
        self.auto_documenter = AutoDocumenter()
        self.running = True
        
        # Create state directory
        self.state_dir = Path("orchestrator_state")
        self.state_dir.mkdir(exist_ok=True)
    
    def check_health(self) -> SystemState:
        """Check health of all components"""
        logger.info("🏥 Performing health check...")
        
        self.state = SystemState(
            dashboard_running=self.health_checker.check_dashboard(),
            backend_running=self.health_checker.check_backend(),
            database_running=self.health_checker.check_database(),
            redis_running=self.health_checker.check_redis(),
            ollama_running=self.health_checker.check_ollama(),
            docker_healthy=self.health_checker.check_docker(),
            last_health_check=datetime.now()
        )
        
        # Log results
        status = {
            "Dashboard": self.state.dashboard_running,
            "Backend": self.state.backend_running,
            "Database": self.state.database_running,
            "Redis": self.state.redis_running,
            "Ollama": self.state.ollama_running,
            "Docker": self.state.docker_healthy
        }
        
        for component, healthy in status.items():
            if healthy:
                logger.info(f"  ✅ {component}: Healthy")
            else:
                logger.warning(f"  ⚠️ {component}: Unhealthy")
                self.state.errors.append(f"{component} is unhealthy")
        
        return self.state
    
    def save_state(self):
        """Save current state to disk"""
        state_file = self.state_dir / "system_state.json"
        state_data = {
            "state": asdict(self.state),
            "timestamp": datetime.now().isoformat()
        }
        state_file.write_text(json.dumps(state_data, indent=2))
    
    def load_state(self):
        """Load previous state from disk"""
        state_file = self.state_dir / "system_state.json"
        if state_file.exists():
            try:
                state_data = json.loads(state_file.read_text())
                # Convert back to SystemState object
                self.state = SystemState(**state_data["state"])
            except Exception as e:
                logger.error(f"Failed to load state: {e}")
    
    async def monitor_loop(self, interval_seconds: int = 60):
        """Main monitoring loop"""
        logger.info("👁️ Starting monitoring loop...")
        
        while self.running:
            try:
                # Check health
                self.check_health()
                
                # Save state
                self.save_state()
                
                # Generate report
                report = self.auto_documenter.generate_system_report(self.state)
                report_file = self.state_dir / "latest_report.md"
                report_file.write_text(report)
                
                # Auto-heal if needed
                unhealthy_components = [
                    ("dashboard", not self.state.dashboard_running),
                    ("backend", not self.state.backend_running),
                    ("database", not self.state.database_running),
                    ("redis", not self.state.redis_running),
                    ("docker", not self.state.docker_healthy)
                ]
                
                if any(unhealthy for _, unhealthy in unhealthy_components):
                    logger.warning("🚨 Unhealthy components detected, starting auto-heal...")
                    self.state = self.auto_healer.heal_system(self.state)
                
                # Wait for next check
                await asyncio.sleep(interval_seconds)
                
            except KeyboardInterrupt:
                logger.info("🛑 Monitoring stopped by user")
                self.running = False
                break
            except Exception as e:
                logger.error(f"Monitoring loop error: {e}")
                await asyncio.sleep(interval_seconds)
    
    def deploy(self) -> bool:
        """Deploy the entire system"""
        return self.auto_deployer.deploy_full_system()
    
    def run_forever(self):
        """Run orchestrator forever"""
        logger.info("🤖 SOVEREIGN ORCHESTRATOR STARTING...")
        logger.info("Version: 11/10")
        logger.info("Mission: Protect, organize, and empower")
        logger.info("")
        logger.info("💜 THE MESH HOLDS. 🔺")
        logger.info("")
        
        # Check if system is already deployed
        self.load_state()
        self.check_health()
        
        # If system is broken, auto-heal
        if (not self.state.dashboard_running or 
            not self.state.backend_running or
            not self.state.database_running):
            logger.warning("⚠️ System is broken, attempting auto-heal...")
            self.state = self.auto_healer.heal_system(self.state)
        
        # Start monitoring loop
        try:
            asyncio.run(self.monitor_loop())
        except KeyboardInterrupt:
            logger.info("👋 Shutting down...")
            self.running = False

def main():
    """Main entry point"""
    orchestrator = SovereignOrchestrator()
    
    # Parse command line arguments
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "deploy":
            success = orchestrator.deploy()
            sys.exit(0 if success else 1)
        elif command == "health":
            orchestrator.check_health()
            report = orchestrator.auto_documenter.generate_system_report(orchestrator.state)
            print(report)
            sys.exit(0)
        elif command == "heal":
            orchestrator.check_health()
            orchestrator.state = orchestrator.auto_healer.heal_system(orchestrator.state)
            sys.exit(0)
        elif command == "monitor":
            orchestrator.run_forever()
        elif command == "help":
            print("""
Sovereign Orchestrator Commands:
  deploy    - Deploy the entire system
  health    - Check system health
  heal      - Auto-heal broken components
  monitor   - Start continuous monitoring
  help      - Show this help
            """)
        else:
            print(f"Unknown command: {command}")
            print("Use 'help' to see available commands")
            sys.exit(1)
    else:
        # Default: start monitoring
        orchestrator.run_forever()

if __name__ == "__main__":
    main()
