<div align="center">

# 🧩 **BilCats API**

### The purring heart of BilCats — powered by Node.js 🐱‍💻

![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![Express](https://img.shields.io/badge/Framework-Express.js-lightgrey?logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-success?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

</div>

---

## 💡 Overview

This is the **backend** of **BilCats** — the cozy digital home for Bilkent University’s beloved campus cats 🐾

It powers user accounts, chatrooms, and cat profiles, quietly keeping everything connected behind the scenes.

---

## ⚙️ Features

- 🧍‍♀️ **User Authentication** – register, login, logout, and refresh your session
- 😺 **User Profiles** – avatars and personal descriptions for each user
- 💬 **Chat System** – chat pages and messaging between cat lovers
- 🔒 **JWT Auth** – access + refresh tokens via `jose`
- 🧱 **Protected Routes** – handled through Express middleware

---

## 🧰 Tech Stack

| Category            | Technology         |
| ------------------- | ------------------ |
| 🖥️ Runtime          | Node.js            |
| 🚀 Framework        | Express.js         |
| 💾 Database         | MongoDB + Mongoose |
| 🔐 Auth             | JWT (`jose`)       |
| 🧂 Password Hashing | bcryptjs           |

---

## 🛠️ Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with required environment variables
4. Start the server:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```
   --

## 🐾 API Endpoints

### 🧍 Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token

### 😺 Profile

- `GET /api/profile` - Get user profile (protected)
- `PUT /api/profile` - Update user profile (protected)

### 💬 Chat

- `/api/chatpages` - Chat page management
- `/api/messages` - Message handling

---

## Environment Variables

Create a `.env` file with the following variables:

- `PORT` - Server port (default: 8000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `ALLOW_REGISTRATIONS` - Enable/disable user registration
- `NODE_ENV` - Environment (development/production)

## 🧩 Project Structure

```
├── config/          # Database configuration
├── middleware/      # Authentication and error handling
├── models/          # MongoDB schemas
├── routes/          # API route definitions
├── utils/           # Utility functions
└── server.js        # Application entry point
```

## 💌 **Contributing**

We welcome contributions from **students, alumni, and cat lovers**!  
If you’d like to improve BilCats:

```bash
# 1️⃣ Fork the repo
# 2️⃣ Create a feature branch
git checkout -b feature/your-feature-name

# 3️⃣ Commit your changes
git commit -m "Add your awesome feature"

# 4️⃣ Push and open a PR
git push origin feature/your-feature-name
```

Then open a pull request — let’s make BilCats even warmer and stronger together 🐾💖
