# Feedback Platform

An anonymous feedback submission system designed to collect validated user input through a controlled backend workflow.
🔗 [Live Application](https://afa-feedback.vercel.app/u/hri)
This application focuses on secure message intake, schema-driven storage, and structured administrative access without revealing user identity.

---

## 🚀 Overview

The Feedback Platform allows users to submit anonymous feedback through a public interface.

The system is intentionally designed as a **one-directional communication workflow**, meaning:

- Users submit feedback anonymously
- No identity is collected or exposed
- Administrators review and manage submissions internally
- No public reply channel exists

The emphasis is on controlled intake and clean backend handling.

---

## 🧠 Core Features

- 🌐 Anonymous public feedback submission
- 🛡 Input validation middleware
- 🧾 Schema-driven message storage
- 🔐 Protected admin dashboard for reviewing submissions
- 📦 Modular API route structure

---

## 🏗 Architecture

### Frontend
- Public feedback form
- Admin panel for viewing submissions

### Backend
- REST API endpoints for message handling
- Validation middleware to sanitize and verify inputs
- MongoDB schema for structured persistence
- Protected admin routes

All incoming data is validated before being stored to ensure predictable and safe processing.

---

## 🔐 Security & Design Decisions

- No user identity collection
- No reply mechanism to preserve anonymity
- Protected administrative routes
- Controlled and validated message workflows

The system is intentionally simple and focused on clean separation between public input and private administration.

---

## 🛠 Tech Stack

- Next.js
- TypeScript
- Node.js
- Express.js (if separate backend)
- MongoDB
- REST APIs

---

## 📌 Design Focus

This project was built to practice:

- Secure API design
- Anonymous message handling
- Middleware-based validation
- Clean separation of public and admin responsibilities

---

## 🧑‍💻 Author

Built as a personal full-stack engineering project to explore controlled backend workflows and structured feedback handling.
