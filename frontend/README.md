# Abhinandan Events

### Event Planner & Management Platform

> A full-stack event management platform that connects **Users**, **Vendors**, and **Admins** to seamlessly plan, manage, and execute events.

---

##  Overview

**Abhinandan Events** is designed to simplify the event planning process by providing a centralized platform where:

* Users can plan and manage events
* Vendors can list and offer services
* Admins can monitor and control the entire system

This platform ensures smooth coordination between all stakeholders involved in event planning.

---

##  Problem Statement

Planning events manually is:

* Time-consuming
* Unorganized
* Lacks transparency
* Difficult to manage vendors

**Solution:**
Abhinandan Events digitizes the entire workflow — from vendor discovery to booking and management.

---

## Features

### 👤 User Features

* Register & Login (JWT/Auth)
* Create & manage events
* Browse vendors by category (Catering, Decoration, DJ, etc.)
* Book vendors
* Track bookings & event progress
* Reviews & ratings

---

###  Vendor Features

* Vendor registration & profile creation
* List services with pricing
* Accept/Reject booking requests
* Manage availability
* Dashboard for earnings & bookings

---

### Admin Features

* Manage users & vendors
* Approve vendor registrations
* Monitor platform activity
* Handle reports & issues
* Analytics dashboard

---

## System Architecture

```
Client (Frontend)
   ↓
API Layer (Backend - REST API)
   ↓
Database (MongoDB / SQL)
```

---

## Tech Stack

### Frontend

* React.js / Flutter (if mobile)
* Tailwind CSS / Bootstrap

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Mongoose)

### Authentication

* JWT (JSON Web Tokens)
* bcrypt (password hashing)

### Deployment

* Frontend: Vercel / Netlify
* Backend: Render / Railway / AWS

---

## Project Structure

```
abhinandan-events/
│
├── client/                 # Frontend
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── assets/
│
├── server/                 # Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── config/
│
├── database/
│
├── docs/                   # Documentation & images
│
├── .env
├── package.json
└── README.md
```

---

## Database Schema

###  User Schema

```js
{
  name: String,
  email: String,
  password: String,
  phone: String,
  events: [ObjectId],
  createdAt: Date
}
```

---

### Vendor Schema

```js
{
  name: String,
  email: String,
  password: String,
  serviceType: String,
  price: Number,
  description: String,
  availability: Boolean,
  rating: Number,
  createdAt: Date
}
```

---

### Admin Schema

```js
{
  name: String,
  email: String,
  password: String,
  role: "admin",
  createdAt: Date
}
```

---

## API Endpoints (Sample)

### Auth

```
POST /api/auth/register
POST /api/auth/login
```

### User

```
GET /api/users/profile
POST /api/events/create
GET /api/events
```

### Vendor

```
POST /api/vendors/register
GET /api/vendors
PUT /api/vendors/update
```

### Admin

```
GET /api/admin/users
DELETE /api/admin/vendor/:id
```

---

## Screenshots

> Add your actual images inside `/docs` folder and link like below

### Homepage

![Homepage](docs/homepage.png)

### Dashboard

![Dashboard](docs/dashboard.png)

### Vendor Listing

![Vendors](docs/vendors.png)

---

## Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/abhinandan-events.git
cd abhinandan-events
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
npm start
```

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm start
```

---

### 4️⃣ Environment Variables (.env)

```env
PORT=5000
MONGO_URI=your_database_url
JWT_SECRET=your_secret_key
```

---

## Deployment Links

* Frontend: [https://your-frontend-link.com](https://your-frontend-link.com)
* Backend API: [https://your-backend-link.com](https://your-backend-link.com)

---

## Future Improvements

* Payment Integration (Stripe/Razorpay)
* Real-time chat (Socket.io)
* AI-based vendor recommendations
* Mobile App version
* Event budget optimization system

---

##  Contribution

Contributions are welcome!

```bash
Fork → Create Branch → Commit → Push → Pull Request
```

---

## License

This project is licensed under the **MIT License**

---

## Author

**Abhinandan Events Platform**
Developed by: *Your Name*

---

##  Support

If you like this project:

*  Star this repo
*  Fork it
*  Share it

---

##  Final Reality Check (Important)

This README is strong enough for **internship-level projects**, but what will actually matter:

* Live demo working properly
* Clean backend structure
* Proper authentication
* At least 1–2 real features fully working (not half-baked)

If your project is just UI + dummy backend → recruiters will ignore it.

---

If you want next step, I can:

* Turn this into a **resume-level project description**
* Help you build **actual backend code (controllers, routes, auth)**
* Or design **MongoDB schema professionally (production level)**
