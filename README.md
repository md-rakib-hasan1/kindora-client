# Kindora — Social Development Events Platform

**Live Website:** https://kindora-client-seven.vercel.app/

Kindora is a community-driven platform that helps people discover, create, and participate in social development events. Users can join community initiatives, manage their own events, and contribute to making a positive impact.

## Key Features

- **User Authentication:** Register and log in using email and password or Google authentication.
- **Discover Upcoming Events:** Browse upcoming social development events and explore event details.
- **Create Events:** Authenticated users can create community events with descriptions, locations, dates, categories, and images.
- **Join Events:** Logged-in users can join upcoming events and view participant information.
- **Manage Your Events:** Event creators can update or delete their own events.
- **Joined Events:** View and manage events you have joined.
- **Search and Filter:** Find events by title, description, location, and category.
- **Light and Dark Mode:** Switch between light and dark themes.
- **Responsive Design:** Enjoy the platform on desktop, tablet, and mobile devices.

## Technologies Used

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Better Auth
- MongoDB
- Express.js
- JWT Authentication

## Getting Started

Follow these steps to run the client application locally.

### 1. Clone the Repository

```bash
git clone https://github.com/md-rakib-hasan1/kindora-client.git
```

### 2. Navigate to the Project

```bash
cd kindora-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root and configure the required environment variables:

```env
NEXT_PUBLIC_AUTH_URL=http://localhost:5000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Use the appropriate local and production URLs for your environment.

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Related Repository

**Backend Repository:** https://github.com/md-rakib-hasan1/kindora-server

**Backend Live API:** https://kindora-server-47it.onrender.com

## Deployment

The client application is deployed on Vercel.

**Live Website:** https://kindora-client-seven.vercel.app/

---

© 2026 Kindora. Building stronger communities together.