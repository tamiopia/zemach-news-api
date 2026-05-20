# Zemach News API

A robust, production-ready RESTful backend API designed to empower Authors to publish articles and Readers to seamlessly consume them, backed by a high-performance analytics tracking engine.

---

## Table of Contents
* [About the Project](#about-the-project)
* [Features](#features)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

---

## About the Project

The Zemach News API is a comprehensive backend infrastructure built to handle the lifecycle of digital publishing. It provides a platform where designated Authors can draft, edit, and publish content, while Readers can securely browse a centralized news feed. 

It solves the problem of securely decoupling user roles while actively measuring content engagement without bottlenecking the main application thread. By leveraging asynchronous job queues for high-frequency operations like view counting, the API remains highly responsive even under heavy load.

## Features

* **Role-Based Access Control (RBAC):** Strict separation of privileges. Authors have complete control over their content lifecycle, while Readers are restricted to viewing published materials.
* **Soft Deletion Mechanism:** Articles are never permanently removed from the database immediately. The system safely filters out soft-deleted records from public endpoints to ensure data integrity.
* **Asynchronous Analytics Engine:** Every article read is captured and securely queued into BullMQ (backed by Redis), where a background worker aggregates view counts into a daily analytics table without blocking the user's request.
* **Secure Authentication:** Implements stateless JWT authentication along with secure, long-lived Refresh Tokens that are securely hashed and stored in PostgreSQL for seamless session extension.
* **Centralized Data Validation:** Built end-to-end with TypeScript and Zod to statically and dynamically validate all request payloads before hitting business logic.

## Getting Started

Follow these instructions to get a copy of the project running locally on your machine.

### Prerequisites

You need the following software installed before running the project:
* npm
  ```sh
  npm install npm@latest -g
  ```
* Docker & Docker Compose (for the simplest setup)
* Node.js v20+

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/tamiopia/zemach-news-api.git
   ```
2. Navigate to the project directory
   ```sh
   cd "news -api"
   ```
3. Run the complete infrastructure via Docker Compose (This will automatically install dependencies, build the TypeScript code, generate Prisma schemas, run migrations, and seed the database).
   ```sh
   docker-compose up --build
   ```

## Usage

Once the server is running, the system will automatically seed the database with **10 Authors**, **10 Readers**, and **50 Articles**.

**Test Accounts:**
All seeded users share the same password: **`Password1!`**
* Author: `authora@test.com` (to `authorj@test.com`)
* Reader: `readera@test.com` (to `readerj@test.com`)

**API Documentation:**
To test the endpoints interactively, visit the generated OpenAPI documentation:
* 👉 **[http://localhost:3000/docs](http://localhost:3000/docs)**

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the ISC License.

## Contact

* Author: [tamiopia23@gmail.com](mailto:tamiopia23@gmail.com)
* Project Link: [https://github.com/tamiopia/zemach-news-api](https://github.com/tamiopia/zemach-news-api)
