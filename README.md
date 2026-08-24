# Analytics Service

Central metrics collection and aggregation microservice for the **SKONGA AI** platform.

## Intentions

| Intention                    | Description                                                                 |
|-----------------------------|-----------------------------------------------------------------------------|
| **Monitoring System Health** | Collects request count, error rate & response time to track health of every microservice. |
| **Performance Tracking**     | Detects bottlenecks and measures service latency.                          |
| **Usage Insights**           | Shows how users and services interact with SKONGA AI.                      |
| **Decision Support**         | Provides data for scaling, optimization and feature prioritization.        |
| **Dashboard Integration**    | Ready for Grafana / Kibana / Prometheus.                                   |

## Endpoints

| Method | Endpoint             | Description                        |
|--------|----------------------|------------------------------------|
| POST   | `/analytics`         | Save a new metric entry            |
| GET    | `/analytics`         | Get raw metrics (filterable)       |
| GET    | `/analytics/stats`   | Get aggregated statistics          |
| GET    | `/health`            | Health check                       |

### Example POST body
```json
{
  "service": "auth-service",
  "metric": "response_time",
  "value": 87,
  "metadata": {
    "endpoint": "/login",
    "statusCode": 200
  }
}
