# 🍔 QuickBite – College Canteen Food Booking System

QuickBite is a **MERN stack-based college canteen food booking system** designed to reduce long queues and waiting time during busy college lunch hours.

Students can view menus from different college canteens, add food items to their cart, select a pickup slot, make online payments, and track their orders.

Canteen staff can manage their canteen menu, receive orders, and update order status.

---

## 📌 Problem Statement

During lunch hours, college canteens receive a large number of orders at the same time. Students have to stand in long queues and wait for their food to be prepared.

QuickBite provides an online system where students can **pre-book their food and collect it when it is ready**, helping reduce waiting time and improving order management for canteen staff.

---

## 🚀 Features

### 👨‍🎓 Student

* Student registration and login
* Email verification
* Secure password authentication
* Student details:

  * Name
  * Email
  * Password
  * Roll Number
* View multiple college canteens
* View canteen menu
* Add food items to cart
* Update cart quantity
* Select pickup slot
* Online payment
* Place food orders
* Track order status
* View order history

### 👨‍🍳 Canteen Staff

* Staff registration and login
* Email verification
* Enter canteen name during registration
* Manage their canteen
* Add menu items using bulk menu entry
* Reuse the same menu for daily use
* Update food availability
* View incoming orders
* Update order status

### 📦 Order Tracking

Orders have only three statuses:

```text
Preparing → Ready → Collected
```

Students can track their order status from their dashboard.

---

## 🏪 Multiple Canteens

QuickBite supports multiple canteens within the same college.

Each staff member is associated with a particular canteen, and students can select the canteen from which they want to order.

Example:

```text
College
│
├── Main Canteen
├── Food Court
├── South Indian Canteen
└── Library Canteen
```

The system can be extended to support additional canteens in the future.

---

## 🍽️ Menu Management

The menu is designed to be simple because the college canteen menu is generally the same every day.

Each menu item contains:

```text
Food Name
Price
Availability
```

The system does not require:

* Food category
* Food type
* Food image

### Bulk Menu Entry

Instead of entering food items one by one, canteen staff can add multiple menu items together.

The menu can also be saved and reused for future days, reducing repetitive work for canteen staff.

---

## 💳 Online Payment

Students can pay for their orders online during checkout.

The payment flow is:

```text
Select Food
      ↓
Add to Cart
      ↓
Checkout
      ↓
Select Pickup Slot
      ↓
Online Payment
      ↓
Payment Verification
      ↓
Order Created
```

---

## 🔐 Authentication

QuickBite uses role-based authentication for students and staff.

```text
                 QuickBite
                     │
             Select Account Type
                /            \
               /              \
          Student             Staff
             │                  │
        Register/Login     Register/Login
             │                  │
        Email Verification
             │                  │
             └────────┬─────────┘
                      ↓
                    Login
                      ↓
                 Dashboard
```

Google authentication is **not used**.

The application uses:

* Email and password
* Password hashing
* Email verification
* JWT-based authentication
* Role-based authorization

---

## 📧 Email Verification

After registration, the user's email must be verified before login.

```text
Register
   ↓
Account Created
   ↓
Verification Email Sent
   ↓
User Clicks Verification Link
   ↓
Email Verified
   ↓
Login
```

Nodemailer is used to send verification emails.

---

## 🛠️ Technology Stack

### Frontend

* React.js
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js
* REST API
* JWT Authentication
* Nodemailer

### Database

* MongoDB
* Mongoose
* MongoDB Atlas

### Payment

* Razorpay

### Development Tools

* VS Code
* Git
* GitHub
* Vite

---

## 📁 Project Structure

```text
QuickBite/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── .env
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
```

```bash
cd QuickBite
```

---

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

---

### 3. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

## 🔑 Environment Variables

### Backend `.env`

Create a `.env` file inside the `backend` folder:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_google_app_password

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### Frontend `.env`

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

Do not upload `.env` files or secret credentials to GitHub.

---

## ▶️ Running the Project

### Start Backend

```bash
cd backend
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### Start Frontend

```bash
cd frontend
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

## 🔄 Application Workflow

```text
                    QuickBite
                       │
             Select Student / Staff
                 /             \
                ↓               ↓
           Registration     Registration
                ↓               ↓
         Email Verification
                ↓
               Login
                ↓
          Role-based Access
          /              \
         ↓                ↓
     Student            Staff
        │                 │
        ↓                 ↓
Select Canteen       Manage Menu
        │                 │
        ↓                 ↓
View Menu            View Orders
        │                 │
        ↓                 ↓
Add to Cart          Update Status
        │
        ↓
Pickup Slot
        │
        ↓
Online Payment
        │
        ↓
Place Order
        │
        ↓
Preparing
        ↓
Ready
        ↓
Collected
```

---

## 🔒 Security

The project includes basic security practices such as:

* Hashed passwords
* JWT authentication
* Role-based authorization
* Email verification
* Protected API routes
* Environment variables for sensitive credentials
* Payment verification on the backend

---

## 🎯 Future Improvements

Some features that can be added in future versions:

* Admin dashboard
* Sales and order analytics
* Estimated preparation time
* Push notifications
* Student feedback and ratings
* Digital receipts
* Coupon/discount system
* Canteen-wise sales reports
* Mobile application
* QR-based order collection

---

## 🎓 Project Purpose

This project was developed as an **MCA academic and practical project** to understand how a full-stack web application works using the MERN stack.

The main goal is to solve a real-world college problem by reducing:

* Long queues
* Lunch-hour waiting time
* Manual order handling
* Repetitive menu entry
* Order management difficulties

---

## 👨‍💻 Developer

**Himanshu Giri**

MCA Student
MERN Stack Developer

---

## ⭐ Project

If you find this project useful, consider giving the repository a ⭐ on GitHub.
