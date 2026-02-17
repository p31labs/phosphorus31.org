#!/usr/bin/env python3
"""
🔮 PREDICTIVE MAINTENANCE MODULE

Predicts system failures before they happen.
Uses historical data and heuristics to anticipate problems.
"""

import json
import time
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any, Optional
import statistics

logger = logging.getLogger("predictive_maintenance")

class MaintenancePredictor:
    """Predicts maintenance needs based on system behavior"""
    
    def __init__(self, data_dir: str = "orchestrator_state"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(exist_ok=True)
        
        # Historical failure patterns
        self.failure_patterns = {
            "dashboard_crash": {
                "indicators": ["high_memory", "frequent_restarts", "slow_response"],
                "recovery_time": 120,  # seconds
                "severity": "high"
            },
            "database_slow": {
                "indicators": ["high_disk_io", "connection_timeouts", "query_slowdown"],
                "recovery_time": 300,
                "severity": "medium"
            },
            "redis_memory_full": {
                "indicators": ["high_memory_usage", "evictions", "slow_commands"],
                "recovery_time": 60,
                "severity": "medium"
            },
            "docker_daemon_fail": {
                "indicators": ["container_crashes", "startup_failures", "network_issues"],
                "recovery_time": 180,
                "severity": "critical"
            }
        }
        
        # Component health thresholds
        self.thresholds = {
            "dashboard_response_time": 2.0,  # seconds
            "backend_response_time": 1.0,
            "database_response_time": 0.5,
            "memory_usage_percent": 80.0,
            "cpu_usage_percent": 70.0,
            "disk_usage_percent": 85.0,
            "error_rate_per_hour": 10
        }
    
    def load_historical_data(self) -> List[Dict[str, Any]]:
        """Load historical system state data"""
        historical_files = list(self.data_dir.glob("system_state_*.json"))
        historical_files.sort()
        
        data = []
        for file_path in historical_files[-100:]:  # Last 100 records
            try:
                with open(file_path, 'r') as f:
                    record = json.load(f)
                    data.append(record)
            except Exception as e:
                logger.warning(f"Failed to load historical data from {file_path}: {e}")
        
        return data
    
    def analyze_trends(self, historical_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze trends in historical data"""
        if len(historical_data) < 5:
            return {"status": "insufficient_data", "message": "Need more historical data"}
        
        trends = {
            "dashboard_uptime": [],
            "backend_uptime": [],
            "database_uptime": [],
            "error_counts": [],
            "response_times": []
        }
        
        for record in historical_data:
            state = record.get("state", {})
            
            # Convert booleans to 1/0 for trend analysis
            trends["dashboard_uptime"].append(1 if state.get("dashboard_running", False) else 0)
            trends["backend_uptime"].append(1 if state.get("backend_running", False) else 0)
            trends["database_uptime"].append(1 if state.get("database_running", False) else 0)
            
            # Count errors
            error_count = len(state.get("errors", []))
            trends["error_counts"].append(error_count)
        
        # Calculate trends
        analysis = {
            "dashboard_reliability": statistics.mean(trends["dashboard_uptime"]) * 100,
            "backend_reliability": statistics.mean(trends["backend_uptime"]) * 100,
            "database_reliability": statistics.mean(trends["database_uptime"]) * 100,
            "avg_errors_per_check": statistics.mean(trends["error_counts"]),
            "trending_up": len([x for x in trends["error_counts"][-5:] if x > statistics.mean(trends["error_counts"])]) > 3,
            "data_points": len(historical_data)
        }
        
        return analysis
    
    def predict_failures(self, current_state: Dict[str, Any], historical_analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Predict potential failures"""
        predictions = []
        
        # Check dashboard reliability trend
        if historical_analysis.get("dashboard_reliability", 100) < 95:
            predictions.append({
                "component": "dashboard",
                "issue": "declining_reliability",
                "confidence": 0.7,
                "recommendation": "Check for memory leaks or update dependencies",
                "estimated_time_to_failure": "1-3 days"
            })
        
        # Check error trend
        if historical_analysis.get("trending_up", False):
            predictions.append({
                "component": "system",
                "issue": "increasing_error_rate",
                "confidence": 0.8,
                "recommendation": "Review error logs and implement fixes",
                "estimated_time_to_failure": "2-7 days"
            })
        
        # Check current state issues
        errors = current_state.get("errors", [])
        for error in errors:
            if "database" in error.lower():
                predictions.append({
                    "component": "database",
                    "issue": "current_errors_detected",
                    "confidence": 0.9,
                    "recommendation": "Check database connections and performance",
                    "estimated_time_to_failure": "immediate"
                })
            
            if "docker" in error.lower():
                predictions.append({
                    "component": "docker",
                    "issue": "container_management_issues",
                    "confidence": 0.85,
                    "recommendation": "Restart Docker service and check container health",
                    "estimated_time_to_failure": "1-2 days"
                })
        
        # Check if system has been running continuously for a long time
        if historical_analysis.get("data_points", 0) > 50:
            # System has many data points, might need maintenance
            predictions.append({
                "component": "system",
                "issue": "extended_uptime",
                "confidence": 0.6,
                "recommendation": "Schedule routine maintenance window",
                "estimated_time_to_failure": "1-4 weeks"
            })
        
        return predictions
    
    def generate_maintenance_schedule(self, predictions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate maintenance schedule based on predictions"""
        schedule = {
            "immediate": [],
            "today": [],
            "this_week": [],
            "this_month": []
        }
        
        for prediction in predictions:
            ttf = prediction.get("estimated_time_to_failure", "").lower()
            confidence = prediction.get("confidence", 0)
            
            if ttf == "immediate" or confidence > 0.9:
                schedule["immediate"].append(prediction)
            elif "day" in ttf and confidence > 0.7:
                schedule["today"].append(prediction)
            elif "week" in ttf:
                schedule["this_week"].append(prediction)
            else:
                schedule["this_month"].append(prediction)
        
        return schedule
    
    def generate_preventive_actions(self, predictions: List[Dict[str, Any]]) -> List[str]:
        """Generate preventive actions to avoid predicted failures"""
        actions = []
        
        for prediction in predictions:
            component = prediction["component"]
            issue = prediction["issue"]
            recommendation = prediction.get("recommendation", "")
            
            if component == "dashboard":
                if "reliability" in issue:
                    actions.append("Run dashboard diagnostics and memory profiling")
                    actions.append("Update npm dependencies if outdated")
                actions.append("Clear browser cache and localStorage if needed")
            
            elif component == "database":
                actions.append("Run database vacuum and analyze")
                actions.append("Check for long-running queries")
                actions.append("Review connection pool settings")
            
            elif component == "docker":
                actions.append("Clean up unused Docker images and volumes")
                actions.append("Update Docker to latest stable version")
                actions.append("Check Docker daemon logs for warnings")
            
            elif component == "system":
                actions.append("Review system logs for patterns")
                actions.append("Update system packages")
                actions.append("Check disk space and cleanup if needed")
            
            # Add specific recommendation if provided
            if recommendation and recommendation not in actions:
                actions.append(recommendation)
        
        # Remove duplicates
        unique_actions = []
        for action in actions:
            if action not in unique_actions:
                unique_actions.append(action)
        
        return unique_actions
    
    def save_prediction_report(self, predictions: List[Dict[str, Any]], 
                              schedule: Dict[str, Any],
                              actions: List[str]) -> Path:
        """Save prediction report to file"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_path = self.data_dir / f"prediction_report_{timestamp}.json"
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "predictions": predictions,
            "maintenance_schedule": schedule,
            "preventive_actions": actions,
            "summary": {
                "total_predictions": len(predictions),
                "immediate_issues": len(schedule["immediate"]),
                "urgent_issues": len(schedule["today"]),
                "scheduled_issues": len(schedule["this_week"]) + len(schedule["this_month"])
            }
        }
        
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info(f"📋 Prediction report saved to {report_path}")
        return report_path
    
    def run_prediction_cycle(self) -> Dict[str, Any]:
        """Run complete prediction cycle"""
        logger.info("🔮 Starting predictive maintenance cycle...")
        
        # Load historical data
        historical_data = self.load_historical_data()
        
        if not historical_data:
            logger.warning("No historical data found for predictions")
            return {"status": "no_data", "message": "Need historical data for predictions"}
        
        # Get most recent state
        current_state = historical_data[-1].get("state", {}) if historical_data else {}
        
        # Analyze trends
        analysis = self.analyze_trends(historical_data)
        
        # Make predictions
        predictions = self.predict_failures(current_state, analysis)
        
        # Generate schedule
        schedule = self.generate_maintenance_schedule(predictions)
        
        # Generate actions
        actions = self.generate_preventive_actions(predictions)
        
        # Save report
        report_path = self.save_prediction_report(predictions, schedule, actions)
        
        # Return results
        return {
            "status": "success",
            "predictions": predictions,
            "schedule": schedule,
            "actions": actions,
            "analysis": analysis,
            "report_path": str(report_path),
            "timestamp": datetime.now().isoformat()
        }

def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Predictive maintenance for Sovereign system")
    parser.add_argument("--run", action="store_true", help="Run prediction cycle")
    parser.add_argument("--report", action="store_true", help="Generate human-readable report")
    
    args = parser.parse_args()
    
    predictor = MaintenancePredictor()
    
    if args.run or args.report or (not args.run and not args.report):
        # Default: run prediction cycle and generate report
        results = predictor.run_prediction_cycle()
        
        if args.report or (not args.run and not args.report):
            # Generate human-readable report
            print("🔮 PREDICTIVE MAINTENANCE REPORT")
            print("=" * 50)
            print(f"Generated: {datetime.now().isoformat()}")
            print(f"Status: {results.get('status', 'unknown')}")
            print()
            
            predictions = results.get('predictions', [])
            if predictions:
                print("📊 PREDICTIONS")
                print("-" * 40)
                for i, pred in enumerate(predictions, 1):
                    print(f"{i}. {pred['component'].upper()}: {pred['issue']}")
                    print(f"   Confidence: {pred['confidence']*100:.1f}%")
                    print(f"   Recommendation: {pred.get('recommendation', 'None')}")
                    print(f"   Estimated TTF: {pred.get('estimated_time_to_failure', 'Unknown')}")
                    print()
            else:
                print("✅ No issues predicted. System appears healthy.")
                print()
            
            schedule = results.get('schedule', {})
            if any(schedule.values()):
                print("📅 MAINTENANCE SCHEDULE")
                print("-" * 40)
                for timeframe, items in schedule.items():
                    if items:
                        print(f"{timeframe.replace('_', ' ').title()}: {len(items)} items")
                        for item in items:
                            print(f"  • {item['component']}: {item['issue']}")
                        print()
            
            actions = results.get('actions', [])
            if actions:
                print("🔧 RECOMMENDED ACTIONS")
                print("-" * 40)
                for i, action in enumerate(actions, 1):
                    print(f"{i}. {action}")
                print()
            
            analysis = results.get('analysis', {})
            if analysis.get('status') != 'insufficient_data':
                print("📈 SYSTEM HEALTH ANALYSIS")
                print("-" * 40)
                print(f"Dashboard Reliability: {analysis.get('dashboard_reliability', 0):.1f}%")
                print(f"Backend Reliability: {analysis.get('backend_reliability', 0):.1f}%")
                print(f"Database Reliability: {analysis.get('database_reliability', 0):.1f}%")
                print(f"Average Errors: {analysis.get('avg_errors_per_check', 0):.1f}")
                print(f"Data Points Analyzed: {analysis.get('data_points', 0)}")
                print()
            
            print("💜 PREVENTIVE MAINTENANCE ENABLED. THE MESH HOLDS. 🔺")
        
        return results

if __name__ == "__main__":
    main()
