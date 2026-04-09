# 🏦 Smart Branch Appointment System

A modern web-based banking solution that allows customers to interact with bank services, book appointments, and manage their profiles digitally. This project is built using **HTML, CSS, JavaScript**, and **Firebase (Firestore + Storage)**.

---

## 🚀 Features

### 🔐 User Authentication

- Login using **User ID / NIC + Password**
- Demo mode available for testing UI

### 👤 Customer Dashboard

- Personalized welcome message
- View personal details
- View account balances
- Track appointment status

### 🏢 Branch Management

- Fetch and display all branches dynamically from database
- Branch selection via dropdown (no manual input errors)

### 🛠 Services Module

- Common Sri Lankan banking services:
  - Savings Account Opening
  - Current Account Opening
  - Personal Loan
  - Housing Loan
  - Pawning (Gold Loan)
  - Fixed Deposit
  - Debit Card Issue
  - Internet Banking Activation

### 📅 Appointment Booking

- Select service → navigate to appointment page
- Choose:
  - Branch (dropdown from DB)
  - Time Slot
  - Required Documents

- Upload documents (PDF/Image)

### 📂 File Upload System

- Files uploaded to Firebase Storage
- File URL stored in Firestore
- Accessible via "My Appointments"

### 📊 Profile Section

- Personal Info
- Accounts
- Appointments with:
  - Status (Submitted / Accepted / Resubmit)
  - Time Slot
  - Branch
  - Document link

---

## 🧱 Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend (BaaS):** Firebase
  - Firestore (Database)
  - Firebase Storage (File Uploads)

---

## 📁 Project Structure

```
Project_Smart_Branch/
│
├── appointment/
│   ├── index.html
│   └── appointment.js
│
├── appointmentDash/
│   └── index.html
│
├── branchReg/
│   ├── index.html
│   └── branchRegister.js
│
├── customerUI/
│   ├── index.html
│   ├── branches.html
│   ├── services.html
│   ├── rates.html
│   ├── profile.html
│   ├── app.js
│   └── style.css
│
├── staffReg/
│   ├── index.html
│   └── staffRegister.js
│
├── StaffUI/
│   └── index.html
│
├── userReg/
│   ├── index.html
│   └── register.js
│
└── README.md
```

---

## ⚙️ Firebase Setup

### 1. Create Project

- Go to Firebase Console
- Create new project

### 2. Enable Services

- Firestore Database → Start in test mode
- Storage → Start in test mode

### 3. Add Config

Paste config inside your JS files:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
};
```

---

## 🔐 Firestore Collections

### Users

- Name
- NIC
- Email
- Password
- Birthday
- Town
- User_ID

### Staff

- Staff_ID
- Name
- Branch_Code

### Branches

- branch_Code
- branch_Name
- branch_Email

### Accounts

- User_ID
- account_type
- Amount

### Appointments

- User_ID
- Branch_Code
- Service_Type
- Documents (file URL)
- Time_Slot
- Status

---

## 📦 Installation & Run

### 🔹 Option 1 (Recommended)

```bash
npx serve
```

### 🔹 Option 2

```bash
python3 -m http.server
```

Open:

```
http://localhost:3000
```

---

## ⚠️ Important Notes

- Do NOT open using `file://`
- Always use a local server
- Ensure Firebase config is correct

---

## 🔒 Security (For Production)

- Restrict Firestore rules
- Restrict Storage access

---

## 🔮 Future Improvements

- Staff dashboard (Approve / Reject appointments)
- Real-time appointment tracking
- Email/SMS notifications
- Role-based authentication (Admin / Staff / User)
- Payment integration
- Advanced UI animations

---

## 👨‍💻 Author

**Sesandu Ramath**
Computer Science Undergraduate | Future Network Engineer | Cybersecurity Enthusiast

---

## ⭐ License

This project is for educational purposes and personal development.

---

💡 _Smart Branch aims to digitize traditional banking workflows into a seamless web experience._
