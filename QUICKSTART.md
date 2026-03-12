# Quick Start Guide

## Local Development

### 1. Setup Environment Variables

Create a `.env.local` file in the root directory:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/booking_db?retryWrites=true&w=majority

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
ADMIN_EMAIL=admin@example.com

# Admin
ADMIN_SECRET_KEY=your_secure_admin_key

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Add Sample Services

Open MongoDB Atlas or use the API to add services:

```bash
curl -X POST http://localhost:3000/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Consulting",
    "description": "Expert business consulting",
    "price": 10000,
    "duration": 60
  }'
```

### 5. Test the App

1. **Booking Page:** http://localhost:3000
   - Select a service
   - Fill in details
   - Click "Book Now"
   - Use Stripe test card: `4242 4242 4242 4242`

2. **Admin Panel:** http://localhost:3000/admin
   - Admin Key: (value from your `ADMIN_SECRET_KEY` env var)
   - View and manage bookings

## Testing Stripe Locally

### Setup Stripe CLI (Optional but Recommended)

```bash
# Install Stripe CLI
choco install stripe-cli --confirm  # Windows with Chocolatey
# OR
brew install stripe/stripe-cli/stripe  # macOS

# Login
stripe login

# Listen for events
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

### Test Cards

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires auth:** `4000 0025 0000 3155`

Any future date and any CVC works with test cards.

## Project Structure

```
book/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── services/            # Service management
│   │   ├── bookings/            # Booking management
│   │   ├── checkout/            # Stripe checkout
│   │   ├── webhook/stripe/      # Webhook handler
│   │   └── admin/               # Admin endpoints
│   ├── admin/                   # Admin dashboard page
│   ├── success/                 # Success page
│   ├── cancel/                  # Cancel page
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
│
├── components/                   # React components
│   ├── BookingForm.tsx          # Main booking form
│   └── AdminPanel.tsx           # Admin interface
│
├── lib/                         # Utility functions
│   ├── db.ts                    # MongoDB connection
│   └── email.ts                 # Email service
│
├── models/                      # Mongoose schemas
│   ├── Service.ts               # Service model
│   └── Booking.ts               # Booking model
│
├── public/                      # Static files
├── .env.local                   # Environment variables
├── README.md                    # Project documentation
└── DEPLOYMENT_GUIDE.md          # Deployment instructions
```

## API Reference

### Services
- `GET /api/services` - List all services
- `POST /api/services` - Create new service

### Bookings
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/[id]` - Get booking details
- `PUT /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Delete booking

### Checkout
- `POST /api/checkout` - Create Stripe session

### Webhooks
- `POST /api/webhook/stripe` - Stripe webhook handler

### Admin API (Requires Auth Header: `Authorization: Bearer ADMIN_SECRET_KEY`)
- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/bookings/[id]` - Update booking status
- `DELETE /api/admin/bookings/[id]` - Delete booking

## Common Tasks

### Add a New Service

Via API:
```bash
curl -X POST http://localhost:3000/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Photography",
    "description": "Professional photo shoot",
    "price": 30000,
    "duration": 120
  }'
```

### Reset Admin Password

1. Update the `ADMIN_SECRET_KEY` in `.env.local`
2. Restart the development server
3. Or for production, update in Vercel environment variables and redeploy

### Check Email Logs

Look for email sending attempts in:
- Development: Console output
- Production: Vercel function logs (Project → Functions → select email logs)

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete instructions on deploying to Vercel.

## Troubleshooting

**Issue: "Cannot GET /api/services"**
- Ensure MongoDB URI is correct in `.env.local`
- Check MongoDB Atlas cluster is running
- Verify IP whitelist in MongoDB Atlas

**Issue: Emails not sending**
- Verify Gmail app password (not regular password)
- Check 2FA is enabled on Gmail
- Confirm EMAIL_USER and EMAIL_PASSWORD in env

**Issue: Stripe payment fails**
- Verify publishable key is correct
- Check secret key matches in env
- Test with card: `4242 4242 4242 4242`

**Issue: Build errors**
- Delete `.next` folder and rebuild: `npm run build`
- Clear npm cache: `npm cache clean --force`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Need Help?

1. Check the [README.md](./README.md) for detailed documentation
2. See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for deployment help
3. Review API endpoint documentation above
4. Check console logs for error messages
