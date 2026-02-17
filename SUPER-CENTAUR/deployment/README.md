# SUPER CENTAUR - 1-Click Deployment Guide

🦄 **The Ultimate Legal & Autonomous Agent System**  
💜 **With love and light - As above, so below**

## 🚀 Quick Start

SUPER CENTAUR provides multiple deployment options for different environments and use cases.

### Option 1: Local 1-Click Deploy (Windows)

For Windows users, simply run the deployment script:

```bash
# Run as Administrator
./deployment/1-click-deploy.bat
```

This will:
- ✅ Install Node.js if needed
- ✅ Install all dependencies
- ✅ Build the project
- ✅ Create Windows service
- ✅ Create desktop shortcuts
- ✅ Start the application

### Option 2: Cross-Platform Deploy (Linux/macOS)

For Linux and macOS users:

```bash
# Make script executable
chmod +x deployment/deploy.sh

# Run deployment
./deployment/deploy.sh
```

This will:
- ✅ Install Node.js if needed
- ✅ Install all dependencies
- ✅ Build the project
- ✅ Create system service (systemd/launchd)
- ✅ Create start/CLI scripts
- ✅ Start the application

### Option 3: Docker Deployment

For containerized deployment:

```bash
# Build and run with Docker Compose
cd deployment/docker
docker-compose up -d
```

This will deploy:
- 🐳 SUPER CENTAUR application
- 📊 PostgreSQL database
- 🚀 Redis cache
- 🌐 Nginx reverse proxy
- 📈 Prometheus monitoring
- 📊 Grafana dashboards
- 🔍 ELK stack for logging

### Option 4: Cloud Deployment

#### AWS CloudFormation

Deploy to AWS with a single click:

1. Go to AWS CloudFormation Console
2. Upload `deployment/cloud/aws/cloudformation.yml`
3. Fill in parameters (KeyPair, Database Password, etc.)
4. Click "Create Stack"

#### Azure Resource Manager

Coming soon...

#### Google Cloud Deployment Manager

Coming soon...

## 📋 System Requirements

### Minimum Requirements
- **OS**: Windows 10+, macOS 10.14+, Linux (Ubuntu 18.04+)
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 2GB free space
- **Node.js**: 18.0.0+

### Recommended Requirements
- **OS**: Latest version
- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 10GB SSD
- **Network**: Stable internet connection

## 🔧 Configuration

After deployment, configuration files are located in:

- **Local**: `./config/super-centaur.config.json`
- **Docker**: `./deployment/docker/config/`
- **Cloud**: Managed via environment variables

### Key Configuration Options

```json
{
  "server": {
    "port": 3002,
    "host": "localhost",
    "cors": {
      "origin": "*",
      "credentials": true
    }
  },
  "database": {
    "type": "sqlite",
    "path": "./data/super-centaur.db"
  },
  "ai": {
    "provider": "openai",
    "model": "gpt-4",
    "apiKey": "your-api-key-here"
  },
  "legal": {
    "jurisdiction": "US",
    "documentTypes": ["contract", "motion", "complaint", "agreement"],
    "emergencyResponse": true
  },
  "medical": {
    "enableDocumentation": true,
    "enableExpertWitness": true,
    "conditions": ["hypoparathyroidism", "intellectual-gaps", "generational-trauma"]
  },
  "blockchain": {
    "provider": "infura",
    "network": "testnet",
    "wallet": {
      "privateKey": "",
      "mnemonic": ""
    }
  }
}
```

## 🌐 Accessing SUPER CENTAUR

After deployment, access SUPER CENTAUR at:

- **Main API**: `http://localhost:3002`
- **Frontend**: `http://localhost:3003`
- **Health Check**: `http://localhost:3002/health`
- **CLI**: `npm run cli` or desktop shortcut

## 🛠️ Management Commands

### Starting Services
```bash
# Windows
sc start SUPER_CENTAUR

# Linux/macOS
sudo systemctl start super-centaur
# or
launchctl start com.supercentaur.service
```

### Stopping Services
```bash
# Windows
sc stop SUPER_CENTAUR

# Linux/macOS
sudo systemctl stop super-centaur
# or
launchctl stop com.supercentaur.service
```

### Checking Status
```bash
# Windows
sc query SUPER_CENTAUR

# Linux/macOS
sudo systemctl status super-centaur
# or
launchctl list com.supercentaur.service
```

### Viewing Logs
```bash
# Windows
Get-EventLog -LogName Application -Source SUPER_CENTAUR

# Linux
sudo journalctl -u super-centaur -f

# macOS
tail -f ~/Library/Logs/com.supercentaur.service.log
```

## 🐳 Docker Management

### View Running Containers
```bash
docker-compose ps
```

### View Logs
```bash
docker-compose logs -f
```

### Scale Services
```bash
docker-compose up -d --scale super-centaur=3
```

### Update Application
```bash
docker-compose pull
docker-compose up -d
```

## ☁️ Cloud Management

### AWS Management
- **EC2 Instances**: Via AWS Console or CLI
- **RDS Database**: Managed via RDS Console
- **Load Balancer**: Via EC2 Console
- **Monitoring**: Via CloudWatch Console

### Azure Management
Coming soon...

### Google Cloud Management
Coming soon...

## 🔒 Security Considerations

### Local Deployment
- Run as non-root user where possible
- Use strong passwords for database
- Enable firewall rules
- Regular system updates

### Cloud Deployment
- Use IAM roles instead of access keys
- Enable encryption at rest and in transit
- Use security groups/VPCs
- Enable logging and monitoring
- Regular security assessments

### Docker Deployment
- Use official images
- Enable container security scanning
- Use secrets management
- Regular image updates

## 🚨 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Find process using port
lsof -i :3002
# Kill process
kill -9 <PID>
```

**Permission Denied**
```bash
# Windows: Run as Administrator
# Linux/macOS: Use sudo
sudo ./deployment/deploy.sh
```

**Node.js Not Found**
```bash
# Install Node.js
# Windows: Download from nodejs.org
# macOS: brew install node
# Linux: apt-get install nodejs npm
```

**Docker Issues**
```bash
# Check Docker status
docker info
# Restart Docker
sudo systemctl restart docker
```

### Getting Help

1. **Check Logs**: Look at application and system logs
2. **Health Check**: Visit `http://localhost:3002/health`
3. **CLI Status**: Run `npm run cli -- status`
4. **Documentation**: Check this README and project docs
5. **Community**: Join our Discord/Slack channels

## 🔄 Updates and Maintenance

### Local Updates
```bash
# Pull latest code
git pull

# Rebuild
npm run build

# Restart service
sudo systemctl restart super-centaur
```

### Docker Updates
```bash
# Pull latest images
docker-compose pull

# Restart with new images
docker-compose up -d
```

### Cloud Updates
- **AWS**: Update CloudFormation stack
- **Azure**: Update ARM template
- **GCP**: Update Deployment Manager

## 📞 Support

For support and questions:

- **Documentation**: [Project Wiki](https://github.com/your-repo/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discord**: [Join our Discord](https://discord.gg/your-invite)
- **Email**: support@supercentaur.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

💜 **With love and light - As above, so below**  
🦄 **SUPER CENTAUR - Empowering Justice and Autonomy**