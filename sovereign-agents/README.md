# Digital Centaur Agent Team

A comprehensive, intelligent file management and organization system built as part of the GENESIS_GATE project. This system acts as a "universal librarian" that brings order to scattered digital environments, ensures every file has a home, and protects sensitive information.

## 🧠 System Overview

The Digital Centaur Agent Team consists of five specialized agents, each with unique capabilities and responsibilities:

### 🏛️ The Coordinator ("Librarian Prime")
- **Role**: Central intelligence and user interface for the entire agent team
- **Responsibilities**: Manages the master "card catalog," delegates tasks to specialist agents, and provides unified system visibility
- **Location**: `coordinator.py`

### 🚪 The Ingestion Agent ("The Gatekeeper")
- **Focus**: `C:\Users\sandra\Downloads`
- **Role**: Processes all incoming information
- **Responsibilities**: Scans, identifies, and performs initial categorization of new files, preparing them for routing to their correct "home"

### 📚 The Project Agent ("The Archivist")
- **Focus**: `C:\MASTER_PROJECT`
- **Role**: Meticulous guardian of creative and technical work
- **Responsibilities**: Understands code, documentation, and project structures; archives old versions; flags sensitive information like API keys

### 🛡️ The Personal Agent ("The Guardian")
- **Focus**: Personal, legal, and financial directories
- **Role**: Privacy and security specialist
- **Responsibilities**: Operates under strict privacy rules; scrubs sensitive data; encrypts files where necessary

### 🧩 The Knowledge Agent ("The Weaver")
- **Role**: Intelligence synthesizer
- **Responsibilities**: Reads and understands files; extracts key concepts, summaries, and action items; prepares briefing notes

## 🏗️ Architecture

```
sovereign-agents/
├── coordinator.py              # Main coordinator and entry point
├── requirements.txt             # Python dependencies
├── config/                     # Agent configuration files
│   ├── ingestion_agent.json     # Downloads agent settings
│   ├── project_agent.json       # Project agent settings
│   ├── personal_agent.json      # Personal agent settings
│   └── knowledge_agent.json     # Knowledge agent settings
├── lib/                        # Shared intelligence library
│   ├── file_handler.py          # File analysis and metadata extraction
│   ├── scrubber.py             # Sensitive information detection and scrubbing
│   ├── organizer.py            # Smart file renaming and organization
│   ├── drive_sync.py           # Google Drive synchronization
│   └── service_manager.py      # Background service management
└── README.md                   # This file
```

## 🚀 Quick Start

### 1. Installation

Install the required dependencies:

```bash
cd C:\MASTER_PROJECT\GENESIS_GATE\sovereign-agents
pip install -r requirements.txt
```

### 2. Configuration

Each agent has its own configuration file in the `config/` directory. Customize these files to match your specific needs:

- **Target directories**: Set the directories each agent should monitor
- **Categorization rules**: Define patterns for file categorization
- **Sensitive patterns**: Specify what constitutes sensitive information
- **Organization rules**: Configure naming conventions and directory structures

### 3. Running the System

Start the agent team:

```bash
python coordinator.py
```

The system will:
1. Initialize all agents
2. Perform an initial scan of target directories
3. Begin background monitoring and processing

## 🔧 Configuration Guide

### Agent Configuration Structure

Each agent configuration file contains:

```json
{
  "name": "Agent Name",
  "target_directory": "C:/path/to/monitor",
  "enabled": true,
  "scan_interval": 3600,
  "categorize": [
    {"pattern": "*.jpg", "category": "image_jpeg"},
    {"pattern": "*.txt", "category": "text_plain"}
  ],
  "keywords": {
    "business": ["jls", "business", "opportunity"],
    "personal": ["personal", "private", "confidential"]
  },
  "sensitive_patterns": {
    "email": "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b",
    "phone": "\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b"
  },
  "scrubbing": {
    "mode": "mask",
    "custom_patterns": {}
  },
  "organization": {
    "naming_templates": {
      "default": "{date}_{category}_{keywords}{ext}"
    },
    "category_paths": {
      "business": "Business/Documents"
    }
  },
  "drive_sync": {
    "enabled": true,
    "simulation_mode": true
  }
}
```

### Key Configuration Options

- **`scan_interval`**: How often (in seconds) the agent should scan its target directory
- **`categorize`**: File pattern matching for automatic categorization
- **`keywords`**: Content-based keyword detection for tagging
- **`sensitive_patterns`**: Regex patterns for detecting sensitive information
- **`scrubbing.mode`**: How to handle sensitive data ("replace", "remove", "mask")
- **`organization.naming_templates`**: Smart filename generation templates
- **`drive_sync.simulation_mode`**: Whether to actually sync to Google Drive or just simulate

## 📊 Features

### Content Analysis & Categorization
- **File Type Detection**: Automatically identifies file types based on extensions
- **Content Analysis**: Reads and analyzes text content for keywords and patterns
- **Smart Categorization**: Uses both filename patterns and content analysis
- **Metadata Extraction**: Extracts file size, modification time, and content summaries

### Sensitive Information Protection
- **Pattern Detection**: Identifies emails, phone numbers, SSNs, credit cards, and more
- **Custom Patterns**: Define your own sensitive information patterns
- **Multiple Scrubbing Modes**: Replace, remove, or mask sensitive data
- **Backup Creation**: Always creates backups before scrubbing

### Intelligent Organization
- **Smart Naming**: Generates meaningful filenames based on content and metadata
- **Directory Structure**: Organizes files into logical directory hierarchies
- **Conflict Resolution**: Handles filename conflicts intelligently
- **Dry Run Mode**: Preview changes before applying them

### Google Drive Integration
- **Synchronization**: Keep local and cloud storage in sync
- **Change Detection**: Only sync files that have changed
- **Bandwidth Optimization**: Estimate sync time and bandwidth usage
- **Simulation Mode**: Test sync operations without actual cloud interaction

### Background Service Management
- **Scheduled Operations**: Run agents on customizable schedules
- **Health Monitoring**: Track agent performance and success rates
- **State Persistence**: Save and restore agent states across restarts
- **Manual Triggers**: Run agents manually when needed

## 🛡️ Security Features

### Data Protection
- **Sensitive Data Detection**: Comprehensive pattern matching for PII
- **Multiple Scrubbing Options**: Choose how to handle sensitive information
- **Backup Creation**: Always preserve original files before modification
- **Dry Run Mode**: Preview all changes before applying

### Privacy Controls
- **Agent Isolation**: Each agent operates independently with specific permissions
- **Configuration-Based Rules**: All sensitive data handling is configurable
- **Audit Logging**: Track all file operations and changes
- **Simulation Mode**: Test operations without affecting real files

## 🔍 Monitoring & Logging

### Service Status
Check the status of all agents:

```python
from lib.service_manager import create_service_manager_from_config

service_manager = create_service_manager_from_config({})
status = service_manager.get_status()
print(status)
```

### Log Files
- **Agent Logs**: Each agent logs its activities to `agent_service.log`
- **Operation Logs**: Detailed logs of all file operations
- **Error Logs**: Track and troubleshoot any issues

### Performance Metrics
- **Success Rates**: Track agent performance over time
- **Processing Times**: Monitor how long operations take
- **File Counts**: See how many files are being processed
- **Uptime**: Track system availability

## 🚨 Important Notes

### Safety First
- **Always use dry-run mode** when first setting up agents
- **Review configuration carefully** before enabling scrubbing
- **Test with non-critical files** before processing important data
- **Keep backups** of important files

### Performance Considerations
- **Large directories** may take time to scan initially
- **Content analysis** is CPU-intensive for large text files
- **Google Drive sync** depends on internet connection speed
- **Background services** consume system resources

### Privacy & Security
- **Review sensitive patterns** to ensure they match your needs
- **Test scrubbing operations** thoroughly before production use
- **Monitor logs** for any unexpected behavior
- **Keep the system updated** with security patches

## 🤝 Integration with GENESIS_GATE

This agent team is designed to work seamlessly with the broader GENESIS_GATE ecosystem:

- **Card Catalog**: Integrates with the central file metadata database
- **Quantum Kernel**: Can leverage quantum computing capabilities for complex analysis
- **Love Economy**: Supports the broader economic and social protocols
- **Mesh Network**: Can operate in distributed environments

## 🐛 Troubleshooting

### Common Issues

1. **Import Errors**: Ensure all dependencies are installed
   ```bash
   pip install -r requirements.txt
   ```

2. **Permission Errors**: Run with appropriate file system permissions
   ```bash
   # On Windows, run as Administrator if needed
   ```

3. **Configuration Errors**: Validate JSON configuration files
   ```bash
   python -m json.tool config/agent_config.json
   ```

4. **Google Drive Issues**: Check API credentials and OAuth setup

### Getting Help

- Check the logs in `agent_service.log`
- Use dry-run mode to test operations
- Review configuration files for syntax errors
- Start with minimal configuration and build up

## 📈 Future Enhancements

Planned features for future versions:

- **Machine Learning**: Train models for better categorization
- **Natural Language Processing**: Enhanced content understanding
- **Real-time Monitoring**: Watch directories for immediate processing
- **Mobile Integration**: Extend to mobile device file management
- **Blockchain Integration**: Immutable audit trails for file operations
- **Advanced Encryption**: End-to-end encryption for sensitive files

## 📄 License

This project is part of the GENESIS_GATE ecosystem and follows its licensing terms.

## 🤔 Questions?

For questions about this system or the broader GENESIS_GATE project:

1. Check the logs for detailed error information
2. Review the configuration files for potential issues
3. Start with dry-run mode to understand system behavior
4. Test with small, non-critical datasets first

---

**Built with ❤️ as part of the Digital Centaur vision**