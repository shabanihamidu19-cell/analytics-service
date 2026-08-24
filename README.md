# Analytics Service

**Production-ready metrics collection & aggregation service** for the SKONGA AI ecosystem.

Built with Express, MongoDB, Winston, Joi, and proper observability patterns.

---

## Intentions

| Intention | Description |
|-----------|-------------|
| **Monitoring System Health** | Collect request count, error rate & response time from every microservice |
| **Performance Tracking** | Identify bottlenecks and measure latency |
| **Usage Insights** | Understand how services and users interact with the platform |
| **Decision Support** | Provide data for scaling, optimization and feature prioritization |
| **Dashboard Ready** | Designed to feed Grafana / Kibana / Prometheus |

---

## Tech Stack

- Express + Helmet + Rate Limiting
- MongoDB + Mongoose (with optimized indexes)
- **Winston** – Structured logging
- **Joi** – Request validation
- Graceful shutdown & health checks
- Docker + docker-compose ready

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/analytics` | Save a new metric |
| `GET` | `/analytics` | Get raw metrics (filterable + paginated) |
| `GET` | `/analytics/stats` | Aggregated stats + derived KPIs |
| `GET` | `/analytics/services` | List of services that have reported metrics |
| `GET` | `/health` | Health check (includes DB status) |

### Example: Save a metric

```http
POST /analytics
Content-Type: application/json

{
  "service": "auth-service",
  "metric": "response_time",
  "value": 87,
  "metadata": {
    "endpoint": "/login",
    "statusCode": 200
  }
}
```

### Example: Get stats

```http
GET /analytics/stats?service=auth-service&from=2026-08-01
```

Response includes derived KPIs such as `errorPercentage` and `avgResponseTime`.

---

## Quick Start

```bash
git clone https://github.com/shabanihamidu19-cell/analytics-service.git
cd analytics-service
cp .env.example .env
npm install
npm run dev
```

Service runs on `http://localhost:4000`

---

## Docker

```bash
docker-compose up -d
```

Or build manually:

```bash
docker build -t analytics-service .
docker run -p 4000:4000 --env-file .env analytics-service
```

---

## Project Structure

```
src/
├── config/             # Environment & app config
├── middleware/         # Error handler + Joi validation
├── models/             # Metric schema (with indexes)
├── services/           # Business logic & aggregations
├── controllers/        # Request handlers
├── routes/             # API routes
├── utils/              # Winston logger
└── app.js              # Bootstrap + graceful shutdown
```

---

## License

MIT © SKONGA AI Team
