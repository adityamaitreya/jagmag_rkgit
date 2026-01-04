# 🔦 JAGMAG – Smart Streetlight Reporting System

**Team Name:** SAME  
**Team No.:** 13

> *"Report darkness, spark change."*

## 📌 Overview

Streetlight outages often go unreported, leaving roads unsafe and communities in the dark. **JAGMAG** is a comprehensive web application that empowers citizens and municipal authorities to manage streetlight infrastructure efficiently.

### Key Features

- 📸 **Photo-based Reporting** – Citizens can report issues with visual evidence
- 📍 **GPS Location Tracking** – Automatic location capture for precise issue mapping
- ⚡ **Priority-based Sorting** – Complaints categorized by urgency (High/Medium/Low)
- 🔐 **Role-based Access Control** – User, Admin, and Super Admin roles
- 📊 **Dashboard Analytics** – Real-time tracking of issue status and resolution
- 🔔 **Notification System** – Stay updated on issue progress
- 👥 **User Management** – Comprehensive user administration for super admins

This bridges the gap between citizens and authorities, ensuring safer and smarter streets.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** – Fast build tool and dev server
- **React Router** – Client-side routing
- **TanStack Query** – Server state management
- **Tailwind CSS** – Utility-first styling
- **Radix UI** – Accessible component primitives
- **shadcn/ui** – Beautiful component library
- **Lucide React** – Icon library

### Backend & Database
- **Supabase** – Backend as a Service
  - PostgreSQL database
  - Row Level Security (RLS)
  - Authentication & Authorization
  - Real-time subscriptions

### Development Tools
- **Bun** – Fast JavaScript runtime & package manager
- **ESLint** – Code linting
- **TypeScript** – Type safety
- **PostCSS & Autoprefixer** – CSS processing

---

## 📁 Project Structure

```
jagmag_rkgit/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── layout/         # Layout components (DashboardLayout)
│   │   └── ui/             # shadcn/ui components
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.tsx     # Authentication hook
│   │   └── useSupabase.tsx # Supabase client hook
│   ├── integrations/       # Third-party integrations
│   │   └── supabase/       # Supabase client & types
│   ├── lib/                # Utility functions
│   ├── pages/              # Page components
│   │   ├── Auth.tsx        # Login/Register page
│   │   ├── Index.tsx       # Home/Dashboard
│   │   ├── IssueManagement.tsx
│   │   ├── UserManagement.tsx
│   │   ├── Notifications.tsx
│   │   └── Settings.tsx
│   └── services/           # API service layer
├── supabase/
│   ├── config.toml         # Supabase local config
│   └── migrations/         # Database migrations
├── public/                 # Static assets
└── package.json

```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0 or higher)
- [Supabase Account](https://supabase.com/)
- Node.js 18+ (for compatibility)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jagmag_rkgit
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   
   - Create a new Supabase project
   - Run the migrations in `supabase/migrations/` folder
   - Enable authentication providers as needed
   - Configure Row Level Security policies

5. **Start the development server**
   ```bash
   bun run dev
   ```

   The app will be available at `http://localhost:5173`

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server with hot reload |
| `bun run build` | Build for production |
| `bun run build:dev` | Build in development mode |
| `bun run preview` | Preview production build locally |
| `bun run lint` | Run ESLint to check code quality |

---

## 🗄️ Database Schema

### Issues Table
Stores streetlight issue reports with the following structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT | Primary key |
| `location` | TEXT | GPS location/address |
| `status` | TEXT | open, in_progress, resolved, rejected |
| `priority` | TEXT | high, medium, low |
| `description` | TEXT | Issue description |
| `reportedBy` | TEXT | User who reported the issue |
| `assignedTo` | TEXT | Admin assigned to resolve |
| `hasPhoto` | BOOLEAN | Whether photo evidence exists |
| `reportedAt` | TIMESTAMP | When issue was reported |
| `created_at` | TIMESTAMP | Record creation time |
| `updated_at` | TIMESTAMP | Last update time |

### Profiles Table
User profile information with role-based access control

### Notifications Table
System notifications for users and admins

---

## 🔐 Authentication & Authorization

The application uses Supabase Authentication with role-based access control:

- **User** – Can report issues and view own submissions
- **Admin** – Can manage issues, assign tasks, update status
- **Super Admin** – Full system access including user management

Protected routes ensure only authorized users can access specific features.

---

## 🌐 Deployment

### Netlify / Vercel

The project includes configuration files for both platforms:

- **Netlify**: `netlify.toml` and `public/_redirects`
- **Vercel**: `vercel.json`

Both are configured to:
- Redirect all routes to `index.html` for SPA routing
- Set appropriate headers for security
- Handle 404s gracefully

**Deploy command:**
```bash
bun run build
```

**Build output directory:** `dist/`

---

## 🎨 UI Components

The project uses **shadcn/ui** components built on top of Radix UI primitives. All components are:
- Fully accessible (ARIA compliant)
- Customizable with Tailwind CSS
- Type-safe with TypeScript
- Available in `src/components/ui/`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is part of an academic/hackathon submission by Team SAME.

---

## 📧 Contact & Support

For questions, issues, or feedback, please create an issue in the repository or contact Team SAME.

---

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components by [shadcn/ui](https://ui.shadcn.com/)
- Backend powered by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**Made with ❤️ by Team SAME**

