## 📌 Human Resource Management System (HRMS)

A full-stack Human Resource Management System built using React, Node.js, and PostgreSQL.
Includes authentication, employee & team management, many-to-many relationships, and activity logs.

## 🚀 Features

🔐 Authentication

Organisation registration

User login (JWT-based)

Password hashing using bcrypt

# 👥 Employee Management

Create, update, delete employees

Assign employees to multiple teams

View all employees for the organisation

# 🧩 Team Management

Create, update, delete teams

Assign multiple employees to teams

View team members

# 🔄 Many-to-Many Relationship

Employees ↔ Teams implemented using a pivot table:
employee_teams (employee_id, team_id)

# 📝 Activity Logs

Every important action is logged:

user login/logout

employee CRUD

team CRUD

team assignments

# 🌐 Fully Working API

Backend: /api/auth, /api/employees, /api/teams, /api/logs

# 🖥️ Modern Frontend UI

React + Vite

TailwindCSS

lucide-react icons

shadcn-style UI components

Token-based API calls via Axios interceptor

## 🛠️ Tech Stack
Frontend

React (Vite)

Axios

TailwindCSS

Lucide React Icons

Backend

Node.js + Express

Sequelize ORM

PostgreSQL

JWT Authentication

bcrypt


## ⚙️ Setup Instructions

1️⃣ Clone Repository

git clone https://github.com/your-username/hrms.git

cd hrms

# 🗄️ Backend Setup (Node + Express + Sequelize)

2️⃣ Install Backend Dependencies

cd backend

npm install

3️⃣ Setup Environment Variables

Create .env inside /backend:

PORT=4000

DB_HOST=localhost

DB_PORT=5432

DB_USER=postgres

DB_PASS=yourpassword

DB_NAME=hrms_db

JWT_SECRET=supersecretjwt


4️⃣ Start PostgreSQL

Local or Docker:

Option A — Local PostgreSQL

psql -U postgres -c "CREATE DATABASE hrms_db;"

Option B — Docker PostgreSQL

docker run --name hrms-db -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres:15

5️⃣ Run the Backend

npm run dev

# 💻 Frontend Setup (React + Vite)

6️⃣ Install Frontend Dependencies

cd ../frontend

npm install

7️⃣ Create .env file

VITE_API_BASE=http://localhost:4000/api

8️⃣ Run Frontend

npm run dev


Frontend will run on http://localhost:5173



## 📸 Screenshots

# Login page

<img width="719" height="476" alt="image" src="https://github.com/user-attachments/assets/afc5dcbd-30a6-4480-b01d-10e933991559" />


# Dashboard

<img width="1350" height="577" alt="image" src="https://github.com/user-attachments/assets/04dec6d1-175d-44a3-8fbc-90e21c7fb20f" />


# Employees page

<img width="1335" height="276" alt="image" src="https://github.com/user-attachments/assets/435a3026-20f4-4aba-b059-3cbc932ee7af" />


# Teams page

<img width="1350" height="307" alt="image" src="https://github.com/user-attachments/assets/82832f0f-2b51-4ab0-9f8b-e23b81787f00" />


# Activity logs

<img width="1080" height="851" alt="image" src="https://github.com/user-attachments/assets/9e60e94d-b173-4f62-9734-a9817727fb37" />



