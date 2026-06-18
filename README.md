# OralSync API — Backend Platform

Backend REST API developed with Node.js, Express, and TypeScript, focused on building scalable, maintainable, and production-ready backend systems.

This project simulates a SaaS-oriented architecture with emphasis on clean code, layered design, and real-world backend engineering practices.

---

## 🚀 Tech Stack

- Node.js
- TypeScript
- Express.js
- REST API architecture
- SQL (MySQL / PostgreSQL compatible design)
- Git & GitHub

---

## 📐 Architecture Overview

The project follows a layered architecture pattern to ensure separation of concerns and scalability:

- **Controllers** → Handle HTTP requests and responses
- **Services** → Business logic layer
- **Repositories** → Data access layer
- **Models/Entities** → Domain representation

This structure improves maintainability, testability, and scalability.

---

## ⚙️ Features

- RESTful API development
- Real-time communication using Socket.IO
- Structured layered architecture (Controller / Service / Repository)
- Business logic separation
- Input validation and request handling
- Database integration (relational model)
- Scalable project structure
- Git version control workflow

---

## 🧠 Key Engineering Concepts Applied

- Clean Code principles
- SOLID principles (basic application)
- Separation of concerns
- Scalable backend architecture
- API-first design
- Real-time communication (WebSockets via Socket.IO)
- Modular project structure

---

## 🗄️ Database Design

The system is designed with relational database principles in mind:

- Structured schema design
- Normalized entities
- SQL-based persistence layer
- Support for MySQL/PostgreSQL

---

## 🔐 Backend Responsibilities

- API request handling
- Business rule implementation
- Data validation
- Database interaction layer
- Error handling strategy

---

## 📡 Real-Time Communication

This project includes real-time communication features using Socket.IO, enabling bidirectional event-based communication between client and server.

Use cases include:

- Real-time updates
- Event-driven communication
- Live data synchronization
- Improved user experience in interactive systems

## 📦 Project Structure

src/
├── controllers/ # HTTP request handlers (business entry point per feature)
│ ├── authController.ts
│ ├── dentistController.ts
│ ├── evaluationController.ts
│ ├── imageController.ts
│ ├── messageController.ts
│ ├── notificationController.ts
│ ├── painScaleController.ts
│ ├── patientController.ts
│ └── uploadController.ts
│
├── routes/ # API route definitions (REST endpoints mapping)
│ ├── auth.ts
│ ├── dentist.ts
│ ├── evaluation.ts
│ ├── images.ts
│ ├── messages.ts
│ ├── notification.ts
│ ├── painScale.ts
│ ├── patient.ts
│ └── upload.ts
│
├── middlewares/ # Authentication & request processing
│ └── authMiddleware.ts
│
├── socket.ts # Socket.IO real-time communication layer
│
├── cron/ # Scheduled background jobs (maintenance tasks)
│ └── cleanup.ts
│
├── lib/ # External service configuration
│ └── prisma.ts
│
├── models/ # Data models (MongoDB schemas)
│ └── mongo/
│ └── Image.ts
│
├── utils/ # Utility functions (helpers, shared logic)
│ └── multer.ts
│
├── @types/ # TypeScript type extensions
│ └── express/
│ └── index.d.ts
│
├── uploads/ # File storage directory
│
└── index.ts # Application entry point
