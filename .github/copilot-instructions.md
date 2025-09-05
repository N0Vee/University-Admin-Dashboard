# Copilot Instructions for University Admin Dashboard

Welcome to the University Admin Dashboard codebase! This document provides essential guidelines for AI coding agents to be productive in this project. Please follow the instructions below to maintain consistency and quality.

---

## 📂 Project Overview

This is a **Full-Stack SaaS Dashboard** for managing university operations, built with:
- **Next.js (App Router)** for the frontend
- **Supabase** for authentication and database
- **Tailwind CSS** for styling
- **Chart.js** for data visualization
- Deployed on **Vercel**

Key features include role-based access control, student and course management, analytics dashboards, and data import/export capabilities.

---

## 🏗️ Architecture

### Key Directories:
- **`src/app`**: Contains the Next.js pages and API routes.
  - `auth/`: Authentication-related pages (e.g., login).
  - `main/`: Main application pages (e.g., dashboard, courses, students).
  - `api/`: Serverless API routes for handling backend logic.
- **`src/components`**: Reusable React components (e.g., `Navbar`, `Sidebar`).
- **`src/context`**: Context providers (e.g., `AuthContext.js` for managing authentication state).
- **`src/utils`**: Utility functions (e.g., `jwt.js` for token handling, `validation.js` for form validation).
- **`src/lib`**: Supabase client configurations.

### Data Flow:
1. **Frontend**: Pages in `src/app` fetch data via API routes or Supabase client.
2. **Backend**: API routes in `src/app/api` handle database operations and business logic.
3. **State Management**: Context API (e.g., `AuthContext`) manages global state like user roles.

---

## 🛠️ Developer Workflows

### Local Development:
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

### Testing:
- **Manual Testing**: Verify role-based access control by logging in as Admin, Instructor, and Student.
- **API Testing**: Use tools like Postman to test API routes under `src/app/api`.

### Debugging:
- Use `console.log` for debugging serverless API routes.
- Check browser console for frontend errors.

---

## 📏 Conventions

### Github push code:
- Naming with git convention : (feat:, fix:, docs:, style:, refactor:, test:, chore:)
- Commit messages should be concise and descriptive (e.g., "Add student search functionality").


### Code Style:
- Follow the **Airbnb JavaScript Style Guide**.
- Use **ESLint** and **Prettier** for linting and formatting.

### Component Structure:
- Place reusable components in `src/components`.
- Use Tailwind CSS classes for styling.

### API Routes:
- Organize routes by resource (e.g., `students`, `courses`).
- Use dynamic routes for resource-specific operations (e.g., `students/[id]`).

---

## 🔗 Integration Points

### Supabase:
- **Authentication**: Managed via `src/context/AuthContext.js`.
- **Database**: Queries are written in API routes under `src/app/api`.

### External Libraries:
- **Chart.js**: Used for analytics visualizations.
- **Tailwind CSS**: Utility-first CSS framework for styling.

---

## 📝 Examples

### Adding a New API Route:
1. Create a new folder under `src/app/api` (e.g., `students/add`).
2. Add a `route.js` file with the following structure:
   ```javascript
   import { supabase } from '@/lib/supabaseClient';

   export default async function handler(req, res) {
       if (req.method === 'POST') {
           try {
               const { data, error } = await supabase.from('students').insert(req.body);
               if (error) {
                   return res.status(400).json({ error: error.message });
               }
               return res.status(200).json(data);
           } catch (err) {
               return res.status(500).json({ error: 'Internal Server Error' });
           }
       }
       res.setHeader('Allow', ['POST']);
       res.status(405).end(`Method ${req.method} Not Allowed`);
   }
   ```

3. Ensure the route follows the naming conventions and folder structure used in the `src/app/api` directory. For example:
   - Use dynamic route folders (e.g., `[id]`, `[course_code]`) for resource-specific operations.
   - Group related routes under a common parent folder (e.g., `students/`, `courses/`).

---

For any questions or clarifications, feel free to update this document or consult the project maintainers.
