# 🎓 University Admin Dashboard

ระบบจัดการมหาวิทยาลัยแบบครบครัน — Full-Stack SaaS Dashboard พัฒนาด้วย **Next.js 13+ (App Router)** พร้อม **Loading Optimizations** และ **Role-based Access Control**

[![Next.js](https://img.shields.io/badge/Next.js-13+-black?logo=next.js)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0+-blue?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## ✨ Recent Updates (September 2025)

### 🚀 **Major Performance Improvements**
- **Replaced all loading.jsx files** with `useState` loading states
- **Unified Sidebar Component** - Consolidated 3 separate sidebar files into one
- **Enhanced UX** with skeleton loading matching actual page layouts
- **Optimized AuthContext** to reduce loading flicker
- **Smooth Transitions** across all components

### 📊 **Code Quality Metrics**
- **-779 lines** of code (removed redundancy)
- **28 files** refactored for better maintainability
- **12 loading.jsx files** replaced with modern loading states
- **75% reduction** in sidebar component files

---

## 🔧 Tech Stack

| Layer         | Technology                 | Version |
|---------------|----------------------------|---------|
| **Frontend**  | [Next.js](https://nextjs.org/) (App Router) | 13+ |
| **Styling**   | [Tailwind CSS](https://tailwindcss.com/) | 3.0+ |
| **Authentication** | Supabase Auth | Latest |
| **Database**  | Supabase PostgreSQL | Latest |
| **Charts**    | Chart.js | Latest |
| **Icons**     | Heroicons | 2.0+ |
| **Deployment** | Vercel | Latest |

---

## 🎯 Features

### 🔐 **Authentication & Role Management**
- **3-Tier Role System**: Admin, Instructor, Student
- **JWT-based Authentication** with Supabase
- **Role-based Access Control** for all routes
- **Secure API endpoints** with middleware protection

### 👨‍💼 **Admin Features**
- **Student Management**: Add, Edit, Delete, Search, Filter students
- **Course Management**: Full CRUD operations for courses
- **Registration Management**: Enrollment oversight and control
- **Analytics Dashboard**: Statistics and insights
- **Reports Generation**: Export capabilities

### 👨‍🏫 **Instructor Features**  
- **Course Teaching**: Manage assigned courses
- **Student Enrollment**: View enrolled students
- **Course Materials**: Upload and manage resources

### 👨‍🎓 **Student Features**
- **Course Registration**: Enroll in available courses  
- **Profile Management**: Update personal information
- **Course Overview**: View enrolled courses and schedules

### 🎨 **UI/UX Enhancements**
- **Skeleton Loading**: Professional loading states matching content
- **Smooth Animations**: Transitions and hover effects
- **Responsive Design**: Mobile-first approach
- **Consistent Theming**: Unified design system

---

## 🏗️ Architecture

### **Directory Structure**
```
src/
├── app/
│   ├── (auth)/                 # Authentication routes
│   │   └── login/
│   ├── (main)/                 # Main application routes
│   │   ├── dashboard/          # Analytics dashboard
│   │   ├── students/           # Student management
│   │   │   ├── add/
│   │   │   ├── edit/[id]/
│   │   │   └── profile/[id]/
│   │   ├── courses/            # Course management
│   │   │   ├── add/
│   │   │   ├── edit/[course_code]/
│   │   │   └── [course_code]/
│   │   └── register/           # Registration management
│   ├── api/                    # API routes
│   │   ├── auth/
│   │   ├── students/
│   │   ├── courses/
│   │   └── enrollments/
│   └── components/             # Reusable components
│       ├── Sidebar.jsx         # Unified sidebar (NEW)
│       └── Navbar.jsx
├── context/
│   └── AuthContext.js          # Authentication state management
├── hooks/
│   ├── useApi.js
│   └── useUserRole.js
└── utils/
    ├── validation.js
    └── jwt.js
```

### **Loading Strategy**
- **Page-level loading**: `useState` with skeleton components
- **API-level loading**: Proper error handling and loading states  
- **Component-level loading**: Optimistic UI updates
- **No loading.jsx files**: Modern approach with hooks

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Supabase account

### **Installation**
```bash
# 1. Clone repository
git clone https://github.com/N0Vee/University-Admin-Dashboard.git
cd University-Admin-Dashboard

# 2. Install dependencies
npm install

# 3. Environment setup
cp .env.example .env.local
# Add your Supabase URL and keys

# 4. Run development server
npm run dev
```

### **Environment Variables**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000
```

---

## 📱 Pages Overview

### **🏠 Dashboard**
- **Student Statistics**: Total, by faculty, by year
- **Course Analytics**: Enrollment trends, popular courses
- **Recent Activities**: Latest registrations and updates
- **Chart Visualizations**: Interactive data representation

### **👥 Student Management**
- **Student List**: Searchable and filterable table
- **Add Student**: Registration form with validation
- **Edit Student**: Update student information
- **Student Profile**: Detailed view with enrollment history

### **📚 Course Management**  
- **Course Catalog**: Grid/List view of all courses
- **Add Course**: Create new courses with full details
- **Edit Course**: Modify course information and settings
- **Course Details**: View enrollments, schedule, and materials

### **📝 Registration Management**
- **Enrollment Overview**: Current registrations by status
- **Registration Control**: Approve/reject enrollments
- **Semester Management**: Configure registration periods

---

## 🎨 Design System

### **Color Palette**
- **Primary**: Indigo (600, 700)
- **Secondary**: Gray (50, 100, 200, 600, 900)
- **Success**: Green (100, 800)  
- **Warning**: Yellow (100, 800)
- **Error**: Red (100, 800)

### **Typography**
- **Headings**: Inter font family
- **Body**: System font stack
- **Code**: Monospace

### **Components**
- **Buttons**: Consistent sizing and styling
- **Forms**: Validated inputs with proper feedback
- **Tables**: Responsive with sorting and pagination
- **Cards**: Elevation and hover effects
- **Skeletons**: Matching content dimensions

---

## 🛠️ Development

### **Available Scripts**
```bash
npm run dev          # Development server
npm run build        # Production build  
npm run start        # Production server
npm run lint         # ESLint checking
```

### **Git Workflow**
- **Conventional Commits**: `feat:`, `fix:`, `refactor:`, etc.
- **Branch Protection**: Main branch protected
- **Code Reviews**: Required for major changes

### **Code Style**
- **ESLint**: Airbnb configuration
- **Prettier**: Automated formatting
- **Tailwind**: Utility-first CSS approach

---

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Environment Setup**
- Configure Supabase environment variables
- Set up database tables and RLS policies
- Configure authentication providers

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feat/amazing-feature`)
3. **Commit** changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to branch (`git push origin feat/amazing-feature`)
5. **Open** Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**[N0Vee](https://github.com/N0Vee)**

---

## 🙏 Acknowledgments

- **Next.js Team** for the incredible framework
- **Tailwind CSS** for the utility-first approach  
- **Supabase** for backend-as-a-service
- **Heroicons** for beautiful icons
- **Vercel** for seamless deployment

---

**⭐ Star this repo if you find it helpful!**
