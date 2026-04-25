# College Database Management System

A modern web-based college database management system built with React, TypeScript, Firebase, and Tailwind CSS. This DBMS mini-project provides a comprehensive solution for managing college entities including departments, instructors, courses, students, and course enrollments.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Firebase Configuration](#firebase-configuration)
- [Available Scripts](#available-scripts)
- [API & Database](#api--database)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## 📖 Project Overview

CollegeDB is a DBMS mini-project designed to demonstrate database design, management, and integration with modern web technologies. It manages the complete college ecosystem including:

- **Departments**: Academic departments within the college
- **Instructors**: Faculty members assigned to departments
- **Courses**: Courses offered by departments
- **Students**: Enrolled students in the college
- **Enrollments**: Student enrollments in courses

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **TypeScript 5.8** | Type-safe JavaScript |
| **Vite 6.2** | Build tool and dev server |
| **Firebase 12.11** | Backend and Firestore database |
| **Tailwind CSS 4.1** | Utility-first CSS framework |
| **Shadcn UI** | High-quality React components |
| **Base UI React** | Unstyled UI components |
| **Express 4.21** | Backend server |
| **Google Generative AI** | AI/ML capabilities |
| **Lucide React** | Icon library |
| **Motion** | Animation library |
| **Next Themes** | Theme management |
| **Sonner** | Toast notifications |

**Language Composition**:
- TypeScript: 92.3%
- CSS: 7.2%
- HTML: 0.5%

## ✨ Features

- 📱 **Responsive Design**: Mobile-first approach using Tailwind CSS
- 🔐 **Secure Database**: Firestore with security rules for data protection
- 🎨 **Modern UI**: Beautiful, accessible components with Shadcn UI
- ⚡ **Fast Development**: Vite for lightning-fast build times
- 🌙 **Theme Support**: Dark/light mode with next-themes
- 🎬 **Smooth Animations**: Motion library for fluid interactions
- 📢 **Toast Notifications**: Sonner for user feedback
- 🔍 **Type Safety**: Full TypeScript support for robust code
- 🤖 **AI Integration**: Google Generative AI capabilities

## 📁 Project Structure

```
DBMS-Mini-Project-CollegeDB/
├── src/                      # Source code
├── components/               # React components
├── lib/                      # Utility functions and helpers
├── index.html               # Main HTML entry point
├── package.json             # Project dependencies
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── firebase-blueprint.json  # Database schema definition
├── firebase-applet-config.json  # Firebase app config
├── firestore.rules          # Firestore security rules
├── components.json          # UI components configuration
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## 🗄️ Database Schema

The project uses **Firestore** with the following collections:

### Collections

#### 1. **Departments**
```
/departments/{departmentId}
- name: string (required, 1-100 chars)
- headInstructorId: string (optional) - ID of the department head
```

#### 2. **Instructors**
```
/instructors/{instructorId}
- name: string (required, 1-100 chars)
- email: string (required, valid email format)
- departmentId: string (required) - Department assignment
```

#### 3. **Courses**
```
/courses/{courseId}
- name: string (required, 1-100 chars)
- departmentId: string (required)
- instructorId: string (required) - Course instructor
```

#### 4. **Students**
```
/students/{studentId}
- name: string (required, 1-100 chars)
- email: string (required, valid email format)
```

#### 5. **Enrollments**
```
/enrollments/{enrollmentId}
- studentId: string (required)
- courseId: string (required)
- enrolledAt: timestamp (required) - Enrollment timestamp
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Firebase account
- Google Generative AI API key (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ChiragThakur03/DBMS-Mini-Project-CollegeDB.git
   cd DBMS-Mini-Project-CollegeDB
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Configure your `.env.local` with the necessary credentials.

## 📝 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Google Generative AI
GEMINI_API_KEY=your_gemini_api_key
```

## 🔑 Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Copy your Firebase config to `firebase-applet-config.json`
4. Update Firestore security rules from `firestore.rules`

### Security Rules

The project includes comprehensive Firestore security rules that:
- Validate required fields for each entity
- Ensure proper data types and formats
- Enforce email validation
- Implement role-based access control
- Protect sensitive data

See `firestore.rules` for detailed security implementation.

## ▶️ Running the Application

### Development Server

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

Build the application for production:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## 📦 Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run clean` - Remove dist directory
- `npm run lint` - Run TypeScript type checking

## 🌐 API & Database

### Firestore Collections Endpoints

All data operations go through Firestore with validated paths:

```
- /departments/{departmentId}
- /instructors/{instructorId}
- /courses/{courseId}
- /students/{studentId}
- /enrollments/{enrollmentId}
```

### Validation Rules

Each collection has specific validation rules:
- **String Fields**: Length validation (1-100 characters)
- **Email Fields**: Regex validation for valid email format
- **Required Fields**: Enforced at write time
- **Data Types**: Strict type checking for all fields

## 🔒 Security

- ✅ Firestore security rules with field validation
- ✅ Authentication checks for read/write operations
- ✅ Admin-only write access for data modifications
- ✅ Email validation for instructor and student records
- ✅ Type-safe TypeScript throughout codebase
- ✅ Environment variable protection for sensitive keys

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Chirag Thakur**
- GitHub: [@ChiragThakur03](https://github.com/ChiragThakur03)
- Repository: [DBMS-Mini-Project-CollegeDB](https://github.com/ChiragThakur03/DBMS-Mini-Project-CollegeDB)

## 📞 Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Last Updated**: 2026-04-25 07:52:37
**Version**: 0.0.0