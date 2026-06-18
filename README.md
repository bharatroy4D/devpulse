# 🚼 DevPulse API

A collaborative platform for software teams to report bugs, suggest features, and coordinate issue resolution.

## 🌐 Live API

https://your-live-url.com

## 📂 GitHub Repository

https://github.com/yourusername/devpulse

---

# 🚀 Features

### Authentication System

* User Registration
* User Login
* JWT Authentication
* Password Hashing with bcrypt
* Role-Based Authorization

### Issue Management

* Create Issue
* Get All Issues
* Get Single Issue
* Update Issue
* Delete Issue

### Filtering & Sorting

* Sort by newest
* Sort by oldest
* Filter by issue type
* Filter by issue status

### Security

* JWT Protected Routes
* Password Hashing
* Role Verification
* Centralized Error Handling

---

# 🛠️ Technology Stack

## Backend

* Node.js
* Express.js
* TypeScript

## Database

* PostgreSQL
* pg Driver
* Raw SQL Queries

## Authentication

* bcrypt
* jsonwebtoken

## Deployment

* Render / Railway / Vercel
* NeonDB / Supabase PostgreSQL

# 📁 Project Structure

```bash
src/
│
├── app/
│   ├── modules/
│   │   ├── auth/
│   │   └── issues/
│   │
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── globalErrorHandler.ts
│   │
│   ├── utils/
│   │   ├── catchAsync.ts
│   │   ├── sendResponse.ts
│   │   └── AppError.ts
│
├── config/
│   └── index.ts
│
├── db/
│   └── index.ts
│
├── app.ts
└── server.ts

# 🔐 Authentication Endpoints
```
## Register User

### POST

```http
/api/auth/signup

### Request Body

```json
{
  "name": "John Doe",
  "email": "john.doe@devpulse.com",
  "password": "securePassword123",
  "role": "contributor"
}
```
## Login User

### POST

```http
/api/auth/login
```

### Request Body

```json
{
  "email": "john.doe@devpulse.com",
  "password": "securePassword123"
}
```

---

# 🐞 Issues Endpoints

## Create Issue

### POST

```http
/api/issues
```

### Protected Route

Authorization Header Required

```http
Authorization: <JWT_TOKEN>
```

---

## Get All Issues

### GET

```http
/api/issues
```

### Query Parameters

| Query  | Values                        |
| ------ | ----------------------------- |
| sort   | newest / oldest               |
| type   | bug / feature_request         |
| status | open / in_progress / resolved |

Example:

```http
/api/issues?sort=newest&type=bug&status=open
```

---

## Get Single Issue

### GET

```http
/api/issues/:id
```

Example:

```http
/api/issues/1
```

---

## Update Issue

### PATCH

```http
/api/issues/:id
```

Authorization Required

```http
Authorization: <JWT_TOKEN>
```

### Access Rules

* Maintainer can update any issue
* Contributor can update only own issue
* Contributor can update only when status is open

---

## Delete Issue

### DELETE

```http
/api/issues/:id
```

Authorization Required

```http
Authorization: <JWT_TOKEN>
```

### Access Rules

* Maintainer only

---
# 👤 User Roles

## Contributor

* Register
* Login
* Create Issue
* View Issues
* Update Own Open Issues

## Maintainer

* All Contributor Permissions
* Update Any Issue
* Delete Any Issue
* Change Issue Status

---

# 🔒 Security Features

* Password Hashing using bcrypt
* JWT Authentication
* Role-Based Authorization
* Protected Routes
* Environment Variables
* Centralized Error Handling

---

# 🚀 Deployment

Backend deployed on:

https://your-live-url.com

---

# 👨‍💻 Author

Your Name:
Bharat Roy

Backend Developer
