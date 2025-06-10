# SmartExpense - UPI-first Expense Split & Budget Tracker

[![Build Status](https://github.com/ramblingbugbear2/smart-expense/actions/workflows/ci.yml/badge.svg)](https://github.com/ramblingbugbear2/smart-expense/actions)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

**SmartExpense** is a UPI-first expense-splitting and budget-tracking PWA for Indian users. The app allows groups to seamlessly manage expenses, track spending, and settle bills instantly using UPI deep-link generation. Built with modern technologies, SmartExpense provides a user-friendly experience with real-time updates and secure payment processing.

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Demo](#-demo)
3. [Tech Stack](#-tech-stack)
4. [Getting Started](#-getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Variables](#environment-variables)
   - [Running the App](#running-the-app)
5. [Folder Structure](#-folder-structure)
6. [API Reference](#-api-reference)
7. [Contributing](#-contributing)
8. [License](#-license)

---

## 🚀 Features

- **User Authentication**: Secure signup, login, and JWT (JSON Web Tokens) access & refresh tokens.
- **Group Management**: Create, view, and update expense groups. Add or remove members.
- **Expense Tracking**: Add and split expenses among group members. Support for equal, percentage, or share-based splits.
- **UPI Payments**: Generate UPI deep-links and QR codes for instant settlement of group balances.
- **Dashboard**: Interactive dashboard displaying group expenses, balances, and UPI settlement status.
- **Real-Time Notifications**: WebSocket notifications powered by Redis pub/sub for real-time updates.
- **CI/CD**: Automated testing and deployment pipelines using GitHub Actions for both frontend and backend.

---

## 🎬 Demo

![SmartExpense Demo](docs/demo.png)

> _Screenshot of the dashboard with group expense summary and UPI QR code._

---

## 🛠️ Tech Stack

| Layer                | Technology                                |
|----------------------|-------------------------------------------|
| **Runtime**          | Node.js 20 (npm)                          |
| **Backend**          | Express, TypeScript, Zod, Mongoose        |
| **Database**         | MongoDB Atlas                             |
| **Cache & Jobs**     | Redis, BullMQ                             |
| **Real-Time**        | WebSockets (ws)                           |
| **Authentication**   | bcrypt, JWT, helmet, rate-limiter-flexible|
| **Payments**         | UPI deep-links, Razorpay Orders API       |
| **Frontend**         | React, Vite, Tailwind CSS, React Query    |
| **State & Forms**    | Zustand, react-hook-form, Zod             |
| **Charts**           | Recharts                                  |
| **Testing**          | Jest, Supertest, React Testing Library    |
| **CI/CD & Deploy**   | GitHub Actions, Render (API), Netlify (UI)|

---

## 🏁 Getting Started

### Prerequisites

- **Node.js v20.x** and **npm** installed on your local machine.
- Git to clone the repository.
- **MongoDB Atlas** account for cloud database hosting.
- **Redis Cloud** account for caching and real-time data.

---

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ramblingbugbear2/smart-expense.git
   cd smart-expense
