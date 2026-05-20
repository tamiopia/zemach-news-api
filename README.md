# Afrolink News API

A robust, production-ready RESTful backend API built for the Afrolink systems assessment. This system enables Authors to publish and manage articles while Readers consume the content. An integrated asynchronous Analytics Engine reliably aggregates high-frequency view counts into daily reports without blocking request cycles.

---

## 🚀 Running the Project (The Central Command)

You can run the entire infrastructure (Database, Redis Queue, Background Workers, and the API itself) with a **single command**. The Docker configuration is set up to automatically install dependencies, build the TypeScript code, generate Prisma schemas, run migrations, and execute the seed script before the server starts!

**1. Clone the repository**
```bash
git clone https://github.com/tamiopia/zemach-news-api.git
cd "news -api"
```

**2. Run everything via Docker**
```bash
docker-compose up --build
```

**3. View the API Documentation**
Once the server is running, navigate to the beautifully formatted OpenAPI (Scalar) documentation:
👉 **[http://localhost:3000/docs](http://localhost:3000/docs)**

---

## 🧪 Seed Data / Test Users

When Docker spins up, the API automatically seeds the database with **10 Authors**, **10 Readers**, and **50 Articles** (spanning various categories with 4 published and 1 draft article per author).

You can log in and test endpoints immediately. All seeded users share the same password: **`Password1!`**

| Role | Email | Password |
|---|---|---|
| **Author** | `authora@test.com` | `Password1!` |
| **Author** | `authorb@test.com` | `Password1!` |
| **Author** | `authorc@test.com` | `Password1!` |
| **Reader** | `readera@test.com` | `Password1!` |
| **Reader** | `readerb@test.com` | `Password1!` |

*(This pattern continues up to `authorj@test.com` and `readerj@test.com`!)*

---

## 🛠️ Technology Stack & Trade-offs

I chose technologies that optimize for **scalability, type safety, developer experience, and non-blocking performance.**

### 1. Node.js + Express + TypeScript
* **Why:** Express provides a lightweight, highly flexible foundation, avoiding the bloat of heavier frameworks while still scaling beautifully. TypeScript strictly guarantees type safety across the entire application, eliminating runtime `undefined` errors and radically improving maintainability.

### 2. PostgreSQL + Prisma ORM
* **Why:** PostgreSQL is the industry standard for robust relational data integrity. I used Prisma ORM because of its incredible type-safe query building and intuitive schema declaration. Implementing requirements like *Soft Deletion* (ignoring records where `DeletedAt != null`) was seamless with Prisma's `where` filters.

### 3. Redis + BullMQ (Analytics Engine)
* **Why:** The assessment required high-frequency read logs without blocking the response cycle. Instead of slamming the Postgres database directly on every read, `BullMQ` (backed by Redis) securely queues up analytics processing jobs. A dedicated background worker pulls these records and aggregates them efficiently at midnight (GMT), ensuring the API remains blazingly fast.

### 4. Zod (Validation)
* **Why:** Zod perfectly bridges the gap between runtime validation and static TypeScript types. All incoming request bodies are verified centrally before hitting any business logic, cleanly rejecting invalid payloads.

### 5. JWT (Access & Refresh Tokens) + RBAC
* **Why:** For secure, stateless authentication, JWTs are ideal. However, since short-lived Access Tokens degrade UX, I implemented long-lived Refresh Tokens stored in the DB (for potential revocation) allowing seamless session renewal.

### 6. Pino & Express-Rate-Limit
* **Why:** `Pino` is used for extremely fast, structured JSON logging to track application health. `express-rate-limit` prevents abuse (e.g. hitting the read endpoint 100 times in 10 seconds).

---

## 🔒 Environment Variables

The project contains a default `.env` file that Docker uses to run seamlessly. For local bare-metal development, they are:

```env
DATABASE_URL="postgresql://news_user:news_password@localhost:5432/news_db?schema=public"
JWT_SECRET="afrolink_super_secret_key_123!"
JWT_REFRESH_SECRET="afrolink_refresh_super_secret_key_123!"
PORT=3000
REDIS_HOST=localhost
REDIS_PORT=6380
```
*(Note: Inside Docker, `localhost` dynamically resolves to the container names like `postgres` and `redis` as mapped in `docker-compose.yml`).*
