# 🤖 Copilot Instructions for University Admin Dashboard

Welcome to the **University Admin Dashboard** codebase! This document provides essential guidelines for AI coding agents to be productive in this project. The dashboard is a full-stack SaaS application for managing university operations, built with **Next.js** and **Supabase**.

---

## 🏗️ Architecture Overview

### **Key Components**
- **Frontend**: Built with Next.js (App Router) and styled using TailwindCSS.
- **Backend**: API routes in `src/app/api/` handle server-side logic, including authentication, course management, and student operations.
- **Database**: Supabase is used for authentication and data storage.
- **Charts**: Chart.js is integrated for analytics and visualizations.

### **Directory Structure**
- `src/app/(main)/`: Contains the main application pages, including `dashboard`, `courses`, and `students`.
- `src/app/api/`: API routes for handling server-side operations (e.g., `/api/courses/add`, `/api/students/update`).
- `src/components/`: Reusable UI components like `Navbar` and `Sidebar`.
- `src/lib/`: Utility files for Supabase integration.
- `src/utils/`: Helper functions (e.g., JWT handling).

### **Data Flow**
- **Frontend**: Pages fetch data from API routes using `fetch`.
- **Backend**: API routes interact with Supabase for database operations.
- **Authentication**: Managed via Supabase Auth, with role-based access control.

---

## 🛠️ Developer Workflows

### **Setup**
1. Clone the repository:
   ```bash
   git clone https://github.com/N0Vee/University-Admin-Dashboard.git
   cd University-Admin-Dashboard
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### **Testing API Routes**
- Use tools like Postman or Thunder Client to test API endpoints under `src/app/api/`.
- Example: Test `POST /api/courses/add` with a JSON payload for adding a course.

### **Building and Deployment**
- Build the project:
  ```bash
  npm run build
  ```
- Deploy to Vercel (configured in `vercel.json`).

---

## 📏 Project Conventions

### **Coding Standards**
- Use functional components with React hooks.
- Follow TailwindCSS conventions for styling.
- API routes should handle errors gracefully and return appropriate HTTP status codes.

### **File Naming**
- Use kebab-case for files and directories (e.g., `add-course`, `edit-student`).
- Dynamic routes are enclosed in brackets (e.g., `[course_code]`, `[id]`).

### **State Management**
- Use `useState` and `useEffect` for local state.
- Fetch data in `useEffect` hooks and handle loading/error states.

---

## 🔗 Integration Points

### **Supabase**
- Authentication: Managed via `src/lib/supabaseClient.js`.
- Database: Queries are executed using Supabase's JavaScript client.

### **External Libraries**
- **Chart.js**: Used for analytics in the dashboard.
- **TailwindCSS**: For consistent and responsive styling.

---

## 📂 Examples

### **Adding a Course**
1. Frontend: `src/app/(main)/courses/add/page.jsx`
   - Contains the form for adding a course.
2. Backend: `src/app/api/courses/add/route.js`
   - Handles the `POST` request to add a course to the database.

### **Editing a Student**
1. Frontend: `src/app/(main)/students/edit/[id]/page.jsx`
   - Contains the form for editing student details.
2. Backend: `src/app/api/students/update/[id]/route.js`
   - Handles the `PUT` request to update student information.

---

Feel free to extend this document as the project evolves!
