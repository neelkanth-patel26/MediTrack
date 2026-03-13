<div align="center">
  <img src="public/readme-banner.png" alt="MediTrack+ Banner" width="100%">

  # 🏥 MediTrack+
  ### *Empowering Healthcare through Intelligent Tracking and Management*

  [![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-blue?style=for-the-badge&logo=supabase)](https://supabase.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

  ---

  **MediTrack+** is a modern, full-stack healthcare management system designed to streamline communication between patients, doctors, and administrators. Built with a focus on premium UI/UX, responsiveness, and robust security.

</div>

## ✨ Key Features

### 👤 For Patients
- **Health Dashboard**: Real-time overview of your health status and upcoming appointments.
- **Vitals Tracking**: Monitor blood pressure, heart rate, weight, and more with historical data.
- **Prescription Management**: Access your current and past prescriptions issued by doctors.
- **Lab Reports**: View and download lab results directly from the platform.
- **Direct Messaging**: Secure communication channel with your assigned doctors.
- **Appointment Scheduling**: Easy-to-use booking system for medical consultations.

### 👨‍⚕️ For Doctors
- **Patient Management**: Centralized access to patient histories, vitals, and reports.
- **Diagnosis Assistant**: Powered by AI-driven insights to assist in clinical decisions.
- **Prescription Issuance**: Digital platform for prescribing medication with dosage and frequency details.
- **Report Review**: Manage and review lab reports for patients.
- **Appointment Management**: View and update your daily schedule.

### 🛡️ For Administrators
- **User Management**: Oversee all doctors, patients, and staff accounts.
- **Activity Logging**: Track system actions for auditing and security.
- **System Announcements**: Broadcast important updates to all users.
- **Analytics Dashboard**: High-level overview of system usage and health metrics.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- npm / yarn / pnpm
- Supabase account

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/neelkanth-patel26/MediTrack.git
   cd MediTrack
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Database Configuration**:
   Follow the detailed [Supabase Setup Guide](SUPABASE_SETUP.md) to initialize your database schema and RLS policies.

5. **Run the development server**:
   ```bash
   npm run dev
   ```

---

## 🔑 Demo Access

For testing purposes, you can use the following demo accounts (ensure you've run the setup script via `/setup` page):

| Role | Email | Password |
|------|-------|----------|
| **Patient** | patient@meditrack.com | patient123 |
| **Doctor** | dr.smith@meditrack.com | doctor123 |
| **Admin** | admin@meditrack.com | admin123 |

---

## 🎨 Theme Support

MediTrack+ features a premium **Dark Mode** and **Light Mode** experience, ensuring comfort and accessibility at any time of day. The monochrome-inspired design provides a clean, professional aesthetic for clinical environments.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ for a Healthier Future
</div>
