# DevPulse — Tech Issue & Feature Tracker

A collaborative issue management platform for software teams to report bugs, suggest features, and coordinate resolutions efficiently.

---

## 🚀 Live Deployment Links

[Live URL](https://devpulse-eight-eta.vercel.app)


[GitHub](https://github.com/torufa/A2-DevPulse)

---

# 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (LTS v24+) |
| Language | TypeScript |
| Framework | Express.js |
| Database | PostgreSQL |
| DB Driver | Native `pg` (`pool.query`) |
| Authentication | JWT (`jsonwebtoken`) |
| Security | bcrypt (10 salt rounds) |
| Deployment | Vercel |
---

# 📌 Features

- User Sign Up
- User Login
- Create Issue
- JWT Authentication
- Role-based Authorization
- Get Single Issue
- Get All Issues
- Update Issue
- Delete Issue
- Global Error Handling
- CORS Configuration
- Production Deployment

  ---
## 📁 Project Structure

```bash
DEVPULSE/
├── src/
│   │   ├── config/
│   │   └── index.ts
│   │
│   ├── db/
│   │   └── index.ts
│   │
│   ├── middlewares/
│   │   ├── auth.ts
│   │   ├── globalErrorHandler.ts 
│   │   └── index.d.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.interface.ts
│   │   │   ├── auth.route.ts
│   │   │   └── auth.service.ts
│   │   │
│   │   └── issue/
│   │       ├── issue.controller.ts
│   │       ├── issue.interface.ts
│   │       ├── issue.route.ts
│   │       └── issue.service.ts
│   │
│   └── utils/
│   │    └── sendResponse.ts
│   ├── app.ts
│   ├── server.ts
│   
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vercel.json
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the repository

```bash
 git clone https://github.com/torufa/A2-DevPulse.git
 cd DevPulse
 npm install
```

---

## 2️⃣ Environment setup

Create a .env file in the root directory and add:

```bash
PORT=3000
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret
PASSWORD_HASH_SALT=10
```

---

## 3️⃣ Create database tables
Run the SQL scripts from the database section in your PostgreSQL client.

---

## 4️⃣ Run project

```
npm run dev
npm run build
npm start
```

---

# 👥 Roles

## Contributor
- Create issues
- Update own issues only when status is `open`

## Maintainer
- Manage and update all issues

---

# 📡 API Endpoints

## 🔐 Auth

```POST /api/auth/signup``` → Create account  
```POST /api/auth/login``` → Login & get JWT  
---

## 🛠️ Issues

```POST /api/issues``` → Create issue (auth required)  
```GET /api/issues``` → Get all issues (filter & sort supported)  
```GET /api/issues/:id``` → Get single issue details  
```PATCH /api/issues/:id``` → Update issue (role-based rules)  
```DELETE /api/issues/:id``` → Delete issue (maintainers only)  

---

# 🗄️ Database Overview

---

## 👤 Users Table

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(254) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'contributor' NOT NULL 
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```
## 🛠️ Issues Table

```sql
CREATE TABLE IF NOT EXISTS issues (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL 
  type VARCHAR(20) NOT NULL 
  status VARCHAR(15) DEFAULT 'open' NOT NULL 
  reporter_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

# ❌ Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": "Error details"
}
```

---

# ✅ Success Response Format

```json
{
  "success": true,
  "message": "Operation description",
  "data": "Response data"
}
```

---

# 🌍 Deployment

The application is deployed to production with:

- Environment Variable Configuration
- CORS Setup
- Production-ready Error Handling
