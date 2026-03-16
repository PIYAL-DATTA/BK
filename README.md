# Service Booking Website

A modern, full-stack booking platform that allows users to book services and make payments via Stripe. Includes an admin panel for managing bookings and automated email notifications.

## Features

- **Service Selection & Booking**: Browse and book various services
- **Stripe Payment Integration**: Secure payment processing
- **Email Notifications**: Automatic confirmation emails after successful payment
- **Admin Panel**: Manage all bookings with status updates
- **Responsive Design**: Works seamlessly on all devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Payment**: Stripe
- **Email**: Nodemailer
- **Hosting**: Vercel

## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier available)
- Stripe account
- Gmail account (for email notifications)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd book
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env.local` file** with the following variables:
   ```
   # MongoDB
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/booking_db

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   STRIPE_SECRET_KEY=sk_test_your_key
   STRIPE_WEBHOOK_SECRET=whsec_your_secret

   # Email
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ADMIN_EMAIL=admin@example.com

   # Admin
   ADMIN_SECRET_KEY=your_secure_key

   # Base URL
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

## Setup Instructions

### 1. MongoDB Setup
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get your connection string and add it to `.env.local`

### 2. Stripe Setup
- Sign up at [Stripe](https://stripe.com)
- Get your publishable and secret keys from the dashboard
- Create a webhook endpoint pointing to `https://yourdomain.com/api/webhook/stripe`

### 3. Email Setup (Gmail)
- Enable 2-factor authentication on your Gmail account
- Generate an [App Password](https://support.google.com/accounts/answer/185833)
- Use the generated password as `EMAIL_PASSWORD` in `.env.local`

### 4. Seed Sample Services
Create sample services by making a POST request to `/api/services`:

```bash
curl -X POST http://localhost:3000/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Web Development",
    "description": "Professional web development services",
    "price": 50000,
    "duration": 60
  }'
```

Or access the MongoDB directly and insert sample services.

## Running the Project

```bash
# Development
npm run dev

# Production build
npm run build
npm run start
```

The application will be available at `http://localhost:3000`

## Usage

### User Booking
1. Navigate to the home page
2. Select a service from the dropdown
3. Fill in your details (name, email, phone, date/time)
4. Click "Book Now"
5. Complete payment on Stripe
6. Receive confirmation email

### Admin Panel
1. Navigate to `/admin`
2. Enter your admin secret key
3. View all bookings
4. Update booking status (Pending, Paid, Confirmed, Cancelled)
5. Delete bookings if needed

## API Endpoints

### Public
- `GET /api/services` - List all services
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/webhook/stripe` - Stripe webhook handler

### User
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/[id]` - Get booking details
- `PUT /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Delete booking

### Admin
- `GET /api/admin/bookings` - List all bookings (requires auth)
- `PUT /api/admin/bookings/[id]` - Update booking (requires auth)
- `DELETE /api/admin/bookings/[id]` - Delete booking (requires auth)

## Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Add environment variables (same as `.env.local`)
   - Click "Deploy"

3. **Update Stripe Webhook**
   - After deployment, update your Stripe webhook URL to point to your Vercel domain
   - Webhook path: `https://yourdomain.vercel.app/api/webhook/stripe`

## Project Structure

```
├── app/
│   ├── api/               # API routes
│   │   ├── services/      # Service endpoints
│   │   ├── bookings/      # Booking endpoints
│   │   ├── checkout/      # Stripe checkout
│   │   ├── webhook/       # Stripe webhook
│   │   └── admin/         # Admin endpoints
│   ├── admin/             # Admin page
│   ├── success/           # Payment success page
│   ├── cancel/            # Payment cancel page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── BookingForm.tsx    # Booking form component
│   └── AdminPanel.tsx     # Admin panel component
├── models/                # Database models
│   ├── Service.ts         # Service schema
│   └── Booking.ts         # Booking schema
├── lib/
│   ├── db.ts              # MongoDB connection
│   └── email.ts           # Email service
└── .env.local             # Environment variables
```

## Troubleshooting

### Email not sending
- Verify Gmail app password is correct
- Check that 2FA is enabled on your Gmail account
- Ensure ADMIN_EMAIL environment variable is set

### Stripe webhook not receiving events
- Verify webhook secret is correct
- Check that Stripe webhook endpoint URL matches your deployment
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/webhook/stripe`

### MongoDB connection issues
- Verify connection string is correct
- Check that IP address is whitelisted in MongoDB Atlas
- Ensure database name in connection string is correct


## Support

For issues or questions, please open an issue in the GitHub repository.
