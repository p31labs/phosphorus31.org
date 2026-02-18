import os
import json
import time
import threading
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Callable
from pathlib import Path

# Try to import schedule, fallback to basic threading if not available
try:
    import schedule
    SCHEDULE_AVAILABLE = True
except ImportError:
    SCHEDULE_AVAILABLE = False
    # Create a minimal schedule-like interface for basic functionality
    class MockSchedule:
        def __init__(self):
            self.jobs = []
        
        def every(self, interval):
            return self
        
        def minutes(self):
            return self
        
        def hours(self):
            return self
        
        def days(self):
            return self
        
        def weeks(self):
            return self
        
        def do(self, func, *args, **kwargs):
            pass  # No-op for mock
        
        def clear(self):
            pass  # No-op for mock
        
        def run_pending(self):
            pass  # No-op for mock
    
    schedule = MockSchedule()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('agent_service.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class ServiceManager:
    """Manages background service operations for the agent team."""
    
    def __init__(self, service_config: Dict[str, Any]):
        """
        Initialize the service manager with configuration.
        
        Args:
            service_config: Dictionary containing service configuration
        """
        self.config = service_config
        self.is_running = False
        self.scheduler_thread = None
        self.agents = {}
        self.last_run_times = {}
        self.stats = {
            "total_runs": 0,
            "successful_runs": 0,
            "failed_runs": 0,
            "last_run": None,
            "uptime": 0
        }
        
        # Setup monitoring
        self.monitoring_interval = self.config.get("monitoring_interval", 60)  # seconds
        self.health_check_interval = self.config.get("health_check_interval", 300)  # 5 minutes
        
    def register_agent(self, agent_name: str, agent_callback: Callable, 
                      schedule_config: Dict[str, Any]) -> None:
        """
        Register an agent with the service manager.
        
        Args:
            agent_name: Name of the agent
            agent_callback: Function to call for agent execution
            schedule_config: Scheduling configuration for the agent
        """
        self.agents[agent_name] = {
            "callback": agent_callback,
            "schedule": schedule_config,
            "enabled": schedule_config.get("enabled", True),
            "last_run": None,
            "run_count": 0,
            "success_count": 0,
            "error_count": 0
        }
        
        # Setup schedule based on configuration
        self._setup_agent_schedule(agent_name, schedule_config)
        logger.info(f"Registered agent: {agent_name}")
    
    def _setup_agent_schedule(self, agent_name: str, schedule_config: Dict[str, Any]) -> None:
        """Setup the schedule for an agent based on configuration."""
        frequency = schedule_config.get("frequency", "hourly")
        interval = schedule_config.get("interval", 1)
        
        agent_job = None
        
        if frequency == "minute":
            schedule.every(interval).minutes.do(self._run_agent_safely, agent_name)
            logger.info(f"Setup schedule for {agent_name}: every {interval} minute(s)")
        elif frequency == "hourly":
            schedule.every(interval).hours.do(self._run_agent_safely, agent_name)
            logger.info(f"Setup schedule for {agent_name}: every {interval} hour(s)")
        elif frequency == "daily":
            schedule.every(interval).days.do(self._run_agent_safely, agent_name)
            logger.info(f"Setup schedule for {agent_name}: every {interval} day(s)")
        elif frequency == "weekly":
            schedule.every(interval).weeks.do(self._run_agent_safely, agent_name)
            logger.info(f"Setup schedule for {agent_name}: every {interval} week(s)")
        elif frequency == "custom":
            # Custom cron-like scheduling
            cron_schedule = schedule_config.get("cron", "0 * * * *")  # Default: every hour
            # For simplicity, we'll use basic schedule patterns
            if "*/" in cron_schedule:
                minutes = int(cron_schedule.split("*/")[1].split(" ")[0])
                schedule.every(minutes).minutes.do(self._run_agent_safely, agent_name)
                logger.info(f"Setup custom schedule for {agent_name}: every {minutes} minute(s)")
    
    def _run_agent_safely(self, agent_name: str) -> None:
        """Safely execute an agent with error handling."""
        agent_info = self.agents.get(agent_name)
        if not agent_info or not agent_info["enabled"]:
            return
        
        try:
            logger.info(f"Starting scheduled run for agent: {agent_name}")
            start_time = datetime.now()
            
            # Execute the agent
            result = agent_info["callback"]()
            
            # Update statistics
            agent_info["last_run"] = datetime.now().isoformat()
            agent_info["run_count"] += 1
            agent_info["success_count"] += 1
            self.stats["successful_runs"] += 1
            self.stats["total_runs"] += 1
            self.stats["last_run"] = datetime.now().isoformat()
            
            duration = (datetime.now() - start_time).total_seconds()
            logger.info(f"Agent {agent_name} completed successfully in {duration:.2f} seconds")
            
            # Log detailed results if available
            if isinstance(result, dict):
                logger.info(f"Agent {agent_name} results: {result}")
                
        except Exception as e:
            logger.error(f"Agent {agent_name} failed: {str(e)}")
            agent_info["error_count"] += 1
            self.stats["failed_runs"] += 1
            self.stats["total_runs"] += 1
    
    def start_service(self) -> None:
        """Start the background service."""
        if self.is_running:
            logger.warning("Service is already running")
            return
        
        self.is_running = True
        self.stats["start_time"] = datetime.now().isoformat()
        
        # Start the scheduler thread
        self.scheduler_thread = threading.Thread(target=self._scheduler_loop, daemon=True)
        self.scheduler_thread.start()
        
        # Start monitoring thread
        self.monitoring_thread = threading.Thread(target=self._monitoring_loop, daemon=True)
        self.monitoring_thread.start()
        
        logger.info("Background service started")
    
    def stop_service(self) -> None:
        """Stop the background service."""
        if not self.is_running:
            logger.warning("Service is not running")
            return
        
        self.is_running = False
        schedule.clear()
        
        logger.info("Background service stopped")
    
    def _scheduler_loop(self) -> None:
        """Main scheduler loop."""
        while self.is_running:
            try:
                schedule.run_pending()
                time.sleep(1)
            except Exception as e:
                logger.error(f"Scheduler error: {str(e)}")
                time.sleep(5)  # Wait before retrying
    
    def _monitoring_loop(self) -> None:
        """Monitoring loop for health checks and statistics."""
        while self.is_running:
            try:
                # Update uptime
                if "start_time" in self.stats:
                    start_time = datetime.fromisoformat(self.stats["start_time"])
                    self.stats["uptime"] = (datetime.now() - start_time).total_seconds()
                
                # Log statistics periodically
                if self.stats["total_runs"] > 0:
                    success_rate = (self.stats["successful_runs"] / self.stats["total_runs"]) * 100
                    logger.info(f"Service stats - Total: {self.stats['total_runs']}, "
                              f"Success: {self.stats['successful_runs']}, "
                              f"Failed: {self.stats['failed_runs']}, "
                              f"Success Rate: {success_rate:.1f}%")
                
                time.sleep(self.monitoring_interval)
                
            except Exception as e:
                logger.error(f"Monitoring error: {str(e)}")
                time.sleep(10)
    
    def get_status(self) -> Dict[str, Any]:
        """Get current service status and statistics."""
        status = {
            "service_running": self.is_running,
            "start_time": self.stats.get("start_time"),
            "uptime_seconds": self.stats.get("uptime", 0),
            "total_runs": self.stats.get("total_runs", 0),
            "successful_runs": self.stats.get("successful_runs", 0),
            "failed_runs": self.stats.get("failed_runs", 0),
            "last_run": self.stats.get("last_run"),
            "agents": {}
        }
        
        for agent_name, agent_info in self.agents.items():
            status["agents"][agent_name] = {
                "enabled": agent_info["enabled"],
                "last_run": agent_info["last_run"],
                "run_count": agent_info["run_count"],
                "success_count": agent_info["success_count"],
                "error_count": agent_info["error_count"]
            }
        
        return status
    
    def enable_agent(self, agent_name: str) -> bool:
        """Enable a specific agent."""
        if agent_name in self.agents:
            self.agents[agent_name]["enabled"] = True
            logger.info(f"Enabled agent: {agent_name}")
            return True
        return False
    
    def disable_agent(self, agent_name: str) -> bool:
        """Disable a specific agent."""
        if agent_name in self.agents:
            self.agents[agent_name]["enabled"] = False
            logger.info(f"Disabled agent: {agent_name}")
            return True
        return False
    
    def run_agent_now(self, agent_name: str) -> Dict[str, Any]:
        """Manually trigger an agent run."""
        if agent_name not in self.agents:
            return {"success": False, "error": f"Agent {agent_name} not found"}
        
        try:
            self._run_agent_safely(agent_name)
            return {"success": True, "message": f"Agent {agent_name} triggered successfully"}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def save_state(self, state_file: str = "service_state.json") -> None:
        """Save current service state to file."""
        state = {
            "agents": self.agents,
            "stats": self.stats,
            "last_save": datetime.now().isoformat()
        }
        
        try:
            with open(state_file, 'w') as f:
                json.dump(state, f, indent=2)
            logger.info(f"Service state saved to {state_file}")
        except Exception as e:
            logger.error(f"Error saving service state: {str(e)}")
    
    def load_state(self, state_file: str = "service_state.json") -> None:
        """Load service state from file."""
        if not os.path.exists(state_file):
            return
        
        try:
            with open(state_file, 'r') as f:
                state = json.load(f)
            
            self.agents = state.get("agents", {})
            self.stats = state.get("stats", {})
            logger.info(f"Service state loaded from {state_file}")
        except Exception as e:
            logger.error(f"Error loading service state: {str(e)}")

def create_service_manager_from_config(config: Dict[str, Any]) -> ServiceManager:
    """Create a service manager instance from configuration."""
    service_config = config.get("service", {
        "monitoring_interval": 60,
        "health_check_interval": 300,
        "auto_start": True,
        "log_level": "INFO"
    })
    
    return ServiceManager(service_config)

if __name__ == "__main__":
    # Example usage
    test_config = {
        "service": {
            "monitoring_interval": 30,
            "health_check_interval": 120,
            "auto_start": False,
            "log_level": "INFO"
        }
    }
    
    service_manager = create_service_manager_from_config(test_config)
    
    # Example agent callback
    def example_agent():
        print("Example agent running...")
        return {"status": "completed", "files_processed": 10}
    
    # Register an example agent
    service_manager.register_agent(
        "example_agent",
        example_agent,
        {
            "enabled": True,
            "frequency": "minute",
            "interval": 5
        }
    )
    
    print("Service manager initialized successfully!")
    print("To start the service, call: service_manager.start_service()")
    print("To check status, call: service_manager.get_status()")