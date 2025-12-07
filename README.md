# Events & Activities Platform - Frontend

A modern web application built with Next.js that connects people who want to participate in local events, sports, or hobbies but don't have companions to join them.

## 🌐 Live Demo

- **Live URL**: [https://events-frontend-lake.vercel.app]
- **Admin Credentials**: gmail: admin@gmail.com, password: 123456

## ✨ Features

### User Features

- 🔐 Secure authentication with JWT tokens
- 👤 Comprehensive profile management with image uploads
- 🔍 Advanced event search with filters (category, date, location)
- 🎟️ Join and leave events seamlessly
- ⭐ Rate and review hosts after attending events
- 💳 Secure payment processing for paid events
- 📱 Fully responsive design for all devices

### Host Features

- 📝 Create and manage events with detailed information
- 👥 Track event participants and capacity
- 💰 Set joining fees and track revenue
- 📊 Dashboard with event statistics
- ✏️ Edit or cancel hosted events

### Admin Features

- 👨‍💼 User management (view, suspend)
- 🏢 Host management and monitoring
- 🎭 Event moderation and management
- 📈 Platform-wide statistics and analytics

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks / Context API
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **Image Upload**: Cloudinary
- **Payment**: Stripe
- **Authentication**: JWT
- **UI Components**: shadcn/ui (optional)
- **Icons**: Lucide React
- **Date Handling**: date-fns / Day.js
- **Notifications**: React Hot Toast / Sonner

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v18 or higher)
- npm or yarn or pnpm
- Backend server running (see backend README)

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone [https://github.com/Sahajewel/events-activity-frontend]
cd events-activities-frontend
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (main)/
│   │   ├── events/
│   │   │   ├── [id]/
│   │   │   ├── create/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── [id]/
            └── page.tsx
│   │   ├── dashboard/
│   │   └── layout.tsx
│   ├── admin/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── events/
│   │   ├── EventCard.tsx
│   ├── profile/
│   └── dashboard/
├── lib/
│   ├── api.ts
│   └── utils.ts
├── hooks/
│   ├── useAuth.ts
│   └── useEvents.ts
│   └── useBooking.ts
│   └── useEvents.ts
│   └── useAuth.ts
│   └── usePayment.ts
│   └── useProfile.ts
│   └── useReview.ts
├── providers/
│   └── Providers.tsx
├── types/
│   └── index.ts
├── public/
│   └── images/
└── styles/
    └── globals.css
```

## 🎨 Key Pages

### Public Pages

- **Home (`/`)**: Landing page with featured events and platform overview
- **Events (`/events`)**: Browse and search all available events
- **Event Details (`/events/[id]`)**: Detailed information about a specific event
- **Login (`/login`)**: User authentication
- **Register (`/register`)**: New user registration

### Protected Pages (User)

- **Profile (`/profile/[id]`)**: View and edit user profile
- **Dashboard (`/dashboard`)**: User's joined events and saved events
- **My Events (`/my-events`)**: Events user has joined

### Protected Pages (Host)

- **Create Event (`/events/create`)**: Form to create new events
- **Edit Event (`/events/[id]/edit`)**: Edit existing events
- **Host Dashboard (`/profile/[id]`)**: Manage hosted events and participants

### Protected Pages (Admin)

- ** Dashboard (`/dashboard`)**: Platform statistics and overview

## 🔑 API Integration

The frontend communicates with the backend through RESTful API endpoints:

```typescript
// Example API calls
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Auth
POST /auth/register
POST /auth/login

// Users
GET /users/:id
GET /users/:id
PATCH /users/profile

// Events
GET /events
GET /events/:id
POST /events (Host. Admin only)
Patch /events/:id (Host, Admin only)


// Payments
POST /my-bookings

```

## 🎯 Features Implementation

### Authentication

- JWT token stored in localStorage
- Automatic token refresh
- Protected routes with middleware
- Role-based access control

### Image Upload

- Cloudinary integration for profile and event images
- Client-side image compression before upload
- Image preview before submission

### Payment Processing

- Stripe integration for secure payments
- Payment confirmation and receipt

### Search & Filters

- Real-time search functionality
- Multiple filter options (category, date, location)
- Pagination for large datasets

## 🧪 Testing

## 🏗️ Build for Production

```bash
npm run build
```

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
# Or using Vercel CLI
vercel --prod
```

## 🔧 Configuration

### Tailwind CSS

Customize `tailwind.config.js` for your design needs:

### Next.js Config

Modify `next.config.js` for advanced configurations:

images: {
domains: ['res.cloudinary.com'],
},
}

```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:


## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Your Name**
- GitHub: [@Sahajewel](https://github.com/Sahajewel)
- Email: your.jewelsaha072@gmail.com

## 🙏 Acknowledgments

- Next.js Documentation
- Tailwind CSS
- Cloudinary
- Stripe
- All contributors and testers

---

**Note**: Replace placeholder links and credentials with actual values before submission.
```
