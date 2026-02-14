# P31 Monitoring and Observability

Complete guide to monitoring and observability in the P31 ecosystem.

## Overview

P31 provides comprehensive monitoring and observability across all components:
- **Health Monitoring** - System health checks
- **Performance Metrics** - Real-time performance tracking
- **Logging** - Centralized logging
- **Alerting** - Automated alerts
- **Tracing** - Request tracing

## Health Monitoring

### Health Endpoints

#### The Centaur

```bash
# Overall health
curl http://localhost:3000/health

# Quantum Brain health
curl http://localhost:3000/api/health/quantum-brain/status
```

#### The Buffer

```bash
# Buffer health
curl http://localhost:4000/health
```

#### Node One

Monitor via serial output:
```bash
idf.py monitor
```

### Health Check Response

```json
{
  "status": "healthy",
  "timestamp": "2026-02-13T12:00:00.000Z",
  "systems": {
    "legalAI": "active",
    "medical": "active",
    "blockchain": "active",
    "agents": "active"
  }
}
```

## Performance Metrics

### The Centaur Metrics

```bash
# Get system metrics
curl http://localhost:3000/api/system/metrics
```

Response includes:
- Request count
- Response times
- Error rates
- Resource usage
- Queue depths

### The Scope Metrics

The Scope provides real-time performance monitoring:
- Frame rate
- Render time
- Memory usage
- Network latency

### Custom Metrics

Add custom metrics in your code:

```typescript
import { MonitoringSystem } from '@p31/monitoring';

const monitoring = MonitoringSystem.getInstance();

// Record custom metric
monitoring.recordMetric('custom.metric', value, {
  component: 'my-component',
  operation: 'my-operation',
});
```

## Logging

### Log Levels

- **ERROR** - Error conditions
- **WARN** - Warning conditions
- **INFO** - Informational messages
- **DEBUG** - Debug messages
- **TRACE** - Trace messages

### Log Locations

- **The Centaur**: `SUPER-CENTAUR/logs/`
- **The Buffer**: Console output (configurable)
- **Node One**: Serial monitor

### Structured Logging

```typescript
import { Logger } from '@p31/logger';

const logger = new Logger('MyComponent');

logger.info('Operation started', {
  userId: 'user-123',
  operation: 'process-message',
});

logger.error('Operation failed', {
  error: error.message,
  stack: error.stack,
});
```

### Log Aggregation

For production, use log aggregation:
- **Loki** - Log aggregation
- **Grafana** - Log visualization
- **ELK Stack** - Elasticsearch, Logstash, Kibana

## Alerting

### Alert Types

1. **Health Alerts** - System health degradation
2. **Performance Alerts** - Performance degradation
3. **Error Alerts** - Error rate thresholds
4. **Resource Alerts** - Resource usage limits

### Alert Configuration

```typescript
// Configure alerts
const alerts = {
  health: {
    threshold: 0.9, // 90% health required
    interval: 60, // Check every 60 seconds
  },
  performance: {
    responseTime: 1000, // 1 second max
    errorRate: 0.05, // 5% max error rate
  },
};
```

### Alert Channels

- **Email** - Email notifications
- **Webhook** - HTTP webhook
- **Slack** - Slack integration
- **PagerDuty** - PagerDuty integration

## Tracing

### Request Tracing

Trace requests across components:

```typescript
import { Tracer } from '@p31/tracing';

const tracer = Tracer.startSpan('operation-name', {
  component: 'my-component',
});

try {
  // Your operation
  tracer.addEvent('operation-started');
  // ...
  tracer.addEvent('operation-completed');
} finally {
  tracer.end();
}
```

### Distributed Tracing

For distributed systems, use:
- **Jaeger** - Distributed tracing
- **Zipkin** - Distributed tracing
- **OpenTelemetry** - Observability framework

## Monitoring Dashboard

### The Scope Dashboard

The Scope provides a monitoring dashboard:
- System health overview
- Performance metrics
- Error rates
- Resource usage
- Network status

### Custom Dashboards

Create custom dashboards using:
- **Grafana** - Visualization platform
- **Prometheus** - Metrics collection
- **The Scope** - Built-in dashboard

## Best Practices

### 1. Monitor Key Metrics

- Request rate
- Response time
- Error rate
- Resource usage
- Queue depth

### 2. Set Appropriate Thresholds

- Not too sensitive (avoid alert fatigue)
- Not too loose (catch issues early)
- Based on SLOs/SLAs

### 3. Log Strategically

- Log important events
- Include context
- Use structured logging
- Don't log sensitive data

### 4. Alert on What Matters

- User-facing issues
- System degradation
- Security events
- Data loss risks

### 5. Review Regularly

- Review metrics weekly
- Analyze trends
- Adjust thresholds
- Improve monitoring

## Tools and Integrations

### Monitoring Tools

- **Prometheus** - Metrics collection
- **Grafana** - Visualization
- **Loki** - Log aggregation
- **Jaeger** - Distributed tracing

### APM Tools

- **New Relic** - Application performance monitoring
- **Datadog** - Monitoring and analytics
- **Sentry** - Error tracking

## Configuration

### Environment Variables

```bash
# Monitoring configuration
MONITORING_ENABLED=true
METRICS_PORT=9090
LOG_LEVEL=info
ALERT_WEBHOOK_URL=https://hooks.example.com/alerts
```

### Monitoring Config

```typescript
// config/monitoring.ts
export const MonitoringConfig = {
  enabled: true,
  metrics: {
    port: 9090,
    path: '/metrics',
  },
  logging: {
    level: 'info',
    format: 'json',
  },
  alerting: {
    enabled: true,
    channels: ['email', 'webhook'],
  },
};
```

## Documentation

- [Architecture](architecture.md)
- [Deployment](deployment.md)
- [Troubleshooting](troubleshooting.md)
- [API Documentation](api/index.md)

## The Mesh Holds 🔺

Monitor everything. Know your system.
