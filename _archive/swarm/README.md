# Project Swarm Intelligence

A sophisticated, multi-agent system designed to autonomously manage, organize, and optimize complex software projects. Inspired by swarm intelligence principles, this system provides comprehensive project management capabilities through specialized, cooperative agents.

## 🚀 Features

### Core Capabilities
- **Intelligent File System Monitoring**: Real-time tracking of file changes, patterns, and anomalies
- **Comprehensive Project Analysis**: Deep code quality, dependency, and architecture analysis
- **Automated Organization**: Smart file categorization, naming, and structure optimization
- **Research & Updates**: Continuous monitoring of dependencies, security vulnerabilities, and best practices
- **Repair & Maintenance**: Automated issue detection and resolution
- **Resource Scaling**: Dynamic agent scaling based on project complexity and resource availability

### Agent Types
- **File System Monitor**: Tracks file changes and detects patterns
- **Project Analyzer**: Performs comprehensive code and architecture analysis
- **Research Agent**: Monitors dependencies and security updates
- **Update Agent**: Manages dependency updates and security patches
- **Repair Agent**: Identifies and fixes common issues
- **Organization Agent**: Optimizes project structure and file organization

## 🏗️ Architecture

The swarm system follows a distributed agent architecture with the following key components:

```
┌─────────────────────────────────────────────────────────────┐
│                    Project Swarm Intelligence               │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Coordinator   │  │   Agent         │  │   CLI        │ │
│  │   (Orchestrator)│  │   Registry      │  │   Interface  │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ File System │  │ Project     │  │ Research    │         │
│  │ Monitor     │  │ Analyzer    │  │ Agent       │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Update      │  │ Repair      │  │ Organization│         │
│  │ Agent       │  │ Agent       │  │ Agent       │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Configuration   │  │ Logging         │  │ Utilities    │ │
│  │ Management      │  │ System          │  │              │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- TypeScript compiler (optional)

### Quick Start

1. **Clone and Install**
```bash
cd c:\Users\sandra\Downloads\USE ME-phenix-navigator-creator\swarm
npm install
```

2. **Build the Project**
```bash
npm run build
```

3. **Run the Swarm**
```bash
# Start in swarm mode
npm run start swarm

# Start in daemon mode
npm run start daemon

# Start in scan-only mode
npm run start scan
```

## 🎯 Usage

### CLI Commands

```bash
# Start the swarm
swarm start [mode]

# Stop the swarm
swarm stop

# Check status
swarm status

# Execute specific agent
swarm execute <agent-name>

# Scale the swarm
swarm scale <factor>

# Emergency shutdown
swarm emergency
```

### Available Modes

- **swarm**: Full swarm mode with all agents (default)
- **daemon**: Background daemon mode
- **scan**: File system scanning only
- **analyze**: Project analysis only
- **organize**: File organization only
- **update**: Dependency updates only
- **repair**: Issue repair only

### Configuration

Create a `swarm.config.json` file in your project root:

```json
{
  "swarm": {
    "enabled": true,
    "mode": "swarm",
    "logLevel": "info",
    "maxAgents": 10,
    "resourceLimits": {
      "cpu": 80,
      "memory": 80,
      "disk": 80
    }
  },
  "agents": {
    "file-system-monitor": {
      "enabled": true,
      "priority": 1,
      "scanInterval": 30000,
      "patterns": ["**/*.{ts,js,tsx,jsx}"]
    },
    "project-analyzer": {
      "enabled": true,
      "priority": 2,
      "analysisInterval": 300000
    }
  }
}
```

## 🔧 Configuration Options

### Swarm Configuration
- `enabled`: Enable/disable the swarm
- `mode`: Operating mode (swarm, daemon, scan, etc.)
- `logLevel`: Logging verbosity (debug, info, warn, error)
- `maxAgents`: Maximum number of concurrent agents
- `resourceLimits`: CPU, memory, and disk usage limits

### Agent Configuration
- `enabled`: Enable/disable specific agent
- `priority`: Execution priority (1-10)
- `timeout`: Maximum execution time in milliseconds
- `retryAttempts`: Number of retry attempts on failure
- `dependencies`: Agent dependencies

## 📊 Monitoring

### Status Dashboard
```bash
swarm status
```

Output includes:
- Agent health and status
- Resource utilization
- Performance metrics
- Error logs and warnings

### Logging
The system provides comprehensive logging with multiple output formats:
- Console output with colors
- File logging with rotation
- JSON format for programmatic processing

## 🤖 Agent Development

### Creating Custom Agents

1. **Implement the Agent Interface**
```typescript
import { Agent, AgentConfig } from './types/agent-types';

class CustomAgent implements Agent {
  private config: AgentConfig;
  private logger: Logger;

  constructor(config: AgentConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  async initialize(): Promise<void> {
    this.logger.info(`Initializing ${this.config.name}`);
    // Initialization logic
  }

  async start(): Promise<void> {
    this.logger.info(`Starting ${this.config.name}`);
    // Start logic
  }

  async stop(): Promise<void> {
    this.logger.info(`Stopping ${this.config.name}`);
    // Stop logic
  }

  async execute(): Promise<any> {
    this.logger.info(`Executing ${this.config.name}`);
    // Execution logic
    return { result: 'success' };
  }

  getStatus(): any {
    return {
      name: this.config.name,
      status: 'running',
      metrics: {}
    };
  }
}
```

2. **Register Your Agent**
```typescript
import { ProjectSwarmIntelligence } from './index';

const swarm = new ProjectSwarmIntelligence();
swarm.registerAgent('custom-agent', new CustomAgent(config, logger));
```

## 🔒 Security

The swarm system includes several security features:
- **File Pattern Validation**: Prevents dangerous file operations
- **Resource Limits**: Prevents resource exhaustion
- **Agent Isolation**: Agents run in isolated environments
- **Audit Logging**: All operations are logged for security review

## 🚨 Emergency Procedures

### Emergency Shutdown
```bash
swarm emergency
```

This command:
- Stops all running agents immediately
- Saves current state
- Performs cleanup operations
- Logs all actions for review

### Agent Recovery
If an agent fails, the system will:
1. Log the error with full context
2. Attempt to restart the agent (configurable attempts)
3. If restart fails, mark the agent as failed
4. Continue operation with remaining agents

## 📈 Performance

### Resource Management
- **Dynamic Scaling**: Agents scale based on available resources
- **Priority-Based Execution**: High-priority agents get resources first
- **Memory Management**: Automatic cleanup and garbage collection
- **CPU Optimization**: Efficient algorithms and parallel processing

### Monitoring Metrics
- Agent performance and response times
- Resource utilization (CPU, memory, disk)
- Error rates and recovery times
- File system activity and patterns

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### Performance Tests
```bash
npm run test:performance
```

## 📚 Documentation

- [API Reference](./docs/api.md)
- [Configuration Guide](./docs/configuration.md)
- [Agent Development](./docs/agents.md)
- [Troubleshooting](./docs/troubleshooting.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by swarm intelligence research
- Built on Node.js and TypeScript
- Uses industry-standard libraries and patterns

## 📞 Support

For support and questions:
- Create an issue in our [GitHub repository](https://github.com/your-org/project-swarm-intelligence)
- Join our [Discord community](https://discord.gg/your-invite)
- Email us at support@your-org.com

---

**Project Swarm Intelligence** - Making complex project management simple, one agent at a time. 🦾