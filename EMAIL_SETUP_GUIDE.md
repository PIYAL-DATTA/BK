# 🛠️ Email Configuration Guide

## Issue: Emails Not Sending

The most common reason emails don't send after successful payment is an **incorrect Gmail app password**.

⚠️ **IMPORTANT:** Gmail does NOT accept your regular Gmail password. You need a special **App Password**.

---

## Step-by-Step Setup

### Step 1: Enable 2-Factor Authentication (Required)

1. Go to https://myaccount.google.com
2. Click **"Security"** in the left sidebar
3. Scroll down to **"2-Step Verification"**
4. Click **"Get started"** and follow the prompts
5. Verify with your phone number

### Step 2: Generate App Password

1. Go to https://myaccount.google.com/apppasswords
2. If asked to sign in again, do so
3. Under **"Select the app and device you're using":**
   - **App:** Select **"Mail"**
   - **Device:** Select **"Windows, Mac, or Linux"**
4. Click **"Generate"**
5. Google will show you a **16-character password** like: `abcd efgh ijkl mnop`
6. **Copy this password** (you'll need it in next step)

### Step 3: Update Environment Variables

**In Vercel Dashboard:**

1. Go to https://vercel.com/dashboard
2. Click on **BK** project
3. Go to **Settings** → **Environment Variables**
4. Find **EMAIL_PASSWORD** and click edit
5. Replace the current value with your **16-character app password**
   - Example: `abcdefghijklmnop` (without spaces)
6. Click **Save**
7. Vercel will automatically redeploy

**OR Locally:**

1. Open `.env.local` in your project
2. Update the line:
   ```
   EMAIL_PASSWORD=abcdefghijklmnop
   ```
   (Replace with your actual 16-character app password)
3. Save the file
4. Restart your development server: `npm run dev`

---

## Verify It Works

### Test Locally

```bash
npm run dev
```

1. Go to http://localhost:3000
2. Create a test booking
3. Use Stripe test card: `4242 4242 4242 4242`
4. Check your email for confirmation

### Check Vercel Logs

1. Go to https://vercel.com/dashboard
2. Click **BK** project
3. Go to **Deployments**
4. Click the latest deployment
5. Go to **"Functions"** tab
6. Click **"api/webhook/stripe"**
7. Look for logs like:
   ```
   ✓ Booking confirmation email sent successfully
   ✓ Admin notification email sent successfully
   ```

---

## Common Issues

### Issue: "Invalid login credentials"
**Solution:** You're using your Gmail password instead of app password. Use the 16-character app password from Step 2.

### Issue: "Less secure app access" error
**Solution:** This means 2FA is not enabled or app password is not set up correctly. Follow all steps above.

### Issue: Email still not working
**Solution:**
1. Verify 2FA is enabled: https://myaccount.google.com/security
2. Verify app password was generated: https://myaccount.google.com/apppasswords
3. Check you have the correct 16-character password
4. Make sure there are no spaces in the password
5. Verify EMAIL_USER is the same Gmail address

---

## Security Notes

- ✅ This app password only works for SMTP mail sending
- ✅ It won't grant access to your Gmail account
- ✅ You can delete/regenerate it anytime
- ✅ Use a strong unique app password (don't reuse)

---

## For Production

After you verify emails work with test card `4242 4242 4242 4242`, test with real Stripe credentials:

1. Get your Stripe production keys from https://dashboard.stripe.com/apikeys
2. Update your Vercel environment variables with production keys
3. Update Stripe webhook URL to your production domain
4. Test a real booking to verify emails send

---

## Still Having Issues?

Check the Vercel function logs for error messages:

1. Make a test booking
2. Go to Vercel Dashboard → BK → Deployments → Latest → Functions
3. Look for errors in the `/api/webhook/stripe` logs
4. Share the error message if issues persist

---

That's it! Once you set up the app password correctly, emails will work automatically after each successful payment.
