# Deployment Guide for Vercel and GitHub

This guide will help you deploy the Service Booking application to Vercel and push the code to GitHub.

## Prerequisites

1. GitHub account (https://github.com)
2. Vercel account (https://vercel.com)
3. Stripe account with keys configured
4. MongoDB Atlas account with connection string
5. Gmail account with app password configured
6. Git installed on your computer

## Step 1: Push Code to GitHub

### Option A: Using GitHub Web Interface (Recommended for Beginners)

1. **Create a New Repository on GitHub**
   - Go to https://github.com/new
   - Repository name: `service-booking` (or any name you prefer)
   - Choose "Public" or "Private"
   - Do NOT initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Get the Repository Commands**
   - After creating the repository, GitHub will show you commands to push
   - In your terminal, run these commands from the project directory:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/service-booking.git
   git branch -M main
   git push -u origin main
   ```

3. **Enter Your GitHub Credentials**
   - You'll be prompted to authenticate
   - Use a Personal Access Token (recommended) instead of password:
     - Go to https://github.com/settings/tokens
     - Click "Generate new token"
     - Select scopes: `repo`, `workflow`
     - Copy the token and paste when asked for password
   - Or use GitHub CLI if you have it installed

### Option B: Using GitHub Desktop (Visual/Easier)

1. Download and install GitHub Desktop from https://desktop.github.com
2. In GitHub Desktop, click "File" → "New Repository"
3. Fill in the repository name and select the local path (your project folder)
4. Click "Create Repository"
5. Click "Publish repository" and sign in with your GitHub account
6. Click "Publish Repository"

## Step 2: Deploy to Vercel

### Method 1: Deploy from GitHub (Recommended)

1. **Sign in to Vercel**
   - Go to https://vercel.com/dashboard
   - Sign in or create an account (you can use GitHub login)

2. **Create a New Project**
   - Click "New Project"
   - Click "Import Git Repository"
   - Search for and select your `service-booking` repository
   - Click "Import"

3. **Configure Environment Variables**
   - You'll see a form to add environment variables
   - Add all variables from your `.env.local` file:
     ```
     MONGODB_URI=your_mongodb_connection_string
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
     STRIPE_SECRET_KEY=sk_test_xxx
     STRIPE_WEBHOOK_SECRET=whsec_xxx
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASSWORD=your_gmail_app_password
     ADMIN_EMAIL=admin@example.com
     ADMIN_SECRET_KEY=your_secure_key
     NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for the build and deployment to complete
   - Your site will be live at `https://your-project-name.vercel.app`

### Method 2: Deploy from Local Machine

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts**
   - Set up a new project (or link to existing)
   - Set project name
   - Set root directory to `./`
   - When asked about environment variables, add them from your `.env.local`

## Step 3: Configure Stripe Webhook

1. **Get Your Vercel Domain**
   - After deployment, Vercel will give you a URL like: `https://service-booking-abc123.vercel.app`

2. **Update Stripe Webhook**
   - Go to https://dashboard.stripe.com/webhooks
   - Find or create your webhook endpoint
   - Update the URL to: `https://your-vercel-domain.vercel.app/api/webhook/stripe`
   - Select events: `checkout.session.completed`
   - Copy the signing secret and update `STRIPE_WEBHOOK_SECRET` in Vercel environment variables

3. **Redeploy**
   - In Vercel dashboard, go to "Deployments"
   - Click "" on the latest deployment and select "Redeploy"
   - Or make a git commit and push to trigger automatic redeployment

## Step 4: Add Sample Services

Once deployed, you need to add some services to your database:

1. **Option A: Via API using cURL**
   ```bash
   curl -X POST https://your-domain.vercel.app/api/services \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Haircut",
       "description": "Professional haircut service",
       "price": 2500,
       "duration": 30
     }'
   ```

2. **Option B: MongoDB Atlas Direct**
   - Go to MongoDB Atlas (https://account.mongodb.com)
   - Find your cluster
   - Click "Collections"
   - Insert documents into the `services` collection

3. **Sample Services Data**
   ```json
   {
     "name": "Web Design",
     "description": "Professional website design service",
     "price": 50000,
     "duration": 120
   }
   ```

## Step 5: Test Your Deployment

1. **Access Your Live Site**
   - Navigate to: `https://your-domain.vercel.app`

2. **Test Booking Flow**
   - Select a service
   - Fill in customer details
   - Click "Book Now"
   - Complete Stripe test payment (use card: `4242 4242 4242 4242`)
   - Verify success page appears
   - Check email for confirmation

3. **Test Admin Panel**
   - Go to: `https://your-domain.vercel.app/admin`
   - Enter your `ADMIN_SECRET_KEY`
   - Verify you can see bookings and manage them

## Troubleshooting

### Build fails on Vercel
- Check build logs: Click on the deployment and see "Build Logs"
- Common issues:
  - Missing environment variables
  - MongoDB connection string invalid
  - Env variable format issues

### Emails not sending
- Verify Gmail app password is correct
- Check that admin email is set in environment variables
- Look at function logs in Vercel: Project → Functions

### Stripe webhook not working
- Verify webhook secret matches in Vercel env vars
- Check webhook URL is exactly correct (including trailing slash if present)
- Test webhook using Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhook/stripe`

### Can't connect to MongoDB
- Verify connection string format
- Check IP address is whitelisted in MongoDB Atlas (add 0.0.0.0/0 for all IPs)
- Test connection locally first with `npm run dev`

## Getting Your Links

After successful deployment:

1. **GitHub Repository:**
   - https://github.com/YOUR_USERNAME/service-booking

2. **Live Website:**
   - https://your-chosen-domain.vercel.app

3. **Custom Domain (Optional)**
   - In Vercel dashboard: Project Settings → Domains
   - Add your own domain (must own/control the domain)
   - Follow DNS configuration instructions

## Environment Variables Summary

For reference, here are all the environment variables you need:

```
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/booking_db

# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
ADMIN_EMAIL=admin@example.com

# Admin
ADMIN_SECRET_KEY=your_secure_random_key

# Base URL (set to your Vercel domain)
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```

## Support & Next Steps

1. **Monitor Deployments:** Vercel dashboard shows real-time logs
2. **Analytics:** View usage in Vercel Analytics
3. **Custom Domain:** Add your own domain in Vercel settings
4. **Scaling:** Vercel automatically scales as traffic increases
5. **Backups:** MongoDB Atlas provides automatic backups

## Security Notes

- Never commit `.env.local` to GitHub (already in .gitignore)
- Use strong `ADMIN_SECRET_KEY`
- Keep Stripe keys secure
- Rotate credentials periodically
- Monitor Stripe webhook integrity

Good luck with your deployment!
