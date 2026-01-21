# Housing Management System

A modern Next.js application for managing university housing applications, connecting to an external API.

## 🚀 Features

- **Student Authentication**: Login and registration system
- **Application Management**: Submit new housing applications
- **Application Tracking**: Track application status
- **Fee Management**: View and manage housing fees
- **Notifications**: Receive updates about applications
- **Complaints System**: Submit and track complaints
- **RTL Support**: Full Arabic language support

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Query
- **Form Handling**: React Hook Form + Zod
- **UI Components**: Radix UI
- **HTTP Client**: Axios

## 📋 Prerequisites

- Node.js 18+ 
- npm or pnpm

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/ThisIsMrIsmail/housing-management-system.git
cd housing-management-system
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://housingms.runasp.net
```

## 🚀 Development

Run the development server:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build

Create a production build:

```bash
npm run build
# or
pnpm build
```

Start the production server:

```bash
npm run start
# or
pnpm start
```

## 📁 Project Structure

```
housing-management-system/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── login/          # Login page
│   │   ├── signup/         # Registration page
│   │   ├── dashboard/      # Dashboard page
│   │   ├── new-application/# New application page
│   │   ├── my-applications/# My applications list
│   │   ├── inquiry/        # Application inquiry
│   │   ├── fees/           # Fees management
│   │   ├── complaints/     # Complaints system
│   │   ├── notifications/  # Notifications
│   │   ├── profile/        # User profile
│   │   ├── dates/          # Important dates
│   │   └── instructions/   # Instructions page
│   ├── components/         # Reusable React components
│   │   └── ui/            # UI components (buttons, forms, etc.)
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   └── services/          # API services
├── public/                # Static assets
└── ...config files
```

## 🔌 API Integration

This application connects to an external API at `http://housingms.runasp.net`. The API documentation is available at:
- Swagger: http://housingms.runasp.net/swagger/index.html

### Main API Endpoints:

- `POST /api/student/auth/register` - User registration
- `POST /api/student/auth/login` - User login
- `GET /api/student/profile/details` - Get profile details
- `GET /api/student/profile/notifications` - Get notifications
- `GET /api/student/profile/fees` - Get fees
- `POST /api/student/applications/submit` - Submit application
- `GET /api/student/applications/my-applications` - Get my applications
- `POST /api/student/complaints/submit` - Submit complaint

## 📝 License

MIT License

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
