# Supabase URL Configuration for medinotes.live

## Issue
Email confirmation and password reset links are redirecting to localhost instead of your production domain (medinotes.live).

## Solution Applied
1. ✅ Added `NEXT_PUBLIC_SITE_URL=https://medinotes.live` to `.env.local`
2. ✅ Updated `resetPassword` function in `contexts/AuthContext.tsx` to use the site URL
3. ✅ Updated `signUp` function in `contexts/AuthContext.tsx` to use the site URL for email confirmation

## Required Supabase Configuration
You need to update your Supabase project settings to allow redirects to your domain:

### Steps:
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project (dczztqaassoubjceemsq)
3. Go to **Authentication** → **URL Configuration**
4. Add the following URLs to **Redirect URLs**:
   - `https://medinotes.live/auth`
   - `https://medinotes.live/reset-password`
   - `http://localhost:3000/auth` (for development)
   - `http://localhost:3000/reset-password` (for development)

5. Set **Site URL** to: `https://medinotes.live`

### Alternative Method:
You can also update these settings via SQL in the Supabase SQL Editor:

```sql
-- Update site URL
UPDATE auth.config 
SET site_url = 'https://medinotes.live'
WHERE parameter = 'SITE_URL';

-- Add redirect URLs (if not already present)
INSERT INTO auth.config (parameter, value) 
VALUES ('REDIRECT_URLS', 'https://medinotes.live/auth,https://medinotes.live/reset-password,http://localhost:3000/auth,http://localhost:3000/reset-password')
ON CONFLICT (parameter) 
DO UPDATE SET value = 'https://medinotes.live/auth,https://medinotes.live/reset-password,http://localhost:3000/auth,http://localhost:3000/reset-password';
```

## Custom Email Templates
To make emails appear from "MediNotes" instead of "Supabase Auth", you need to configure custom email templates:

### Steps to Customize Email Templates:
1. Go to **Authentication** → **Email Templates** in your Supabase Dashboard
2. Configure the following templates:

#### Confirm Signup Template:
```html
<h2>Welcome to MediNotes!</h2>
<p>Hi there,</p>
<p>Thank you for signing up for MediNotes - your ultimate resource for medical study materials, notes, and previous year questions.</p>
<p>To complete your registration and start accessing our extensive collection of study resources, please confirm your email address by clicking the link below:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email address</a></p>
<p>Once confirmed, you'll have access to:</p>
<ul>
  <li>📚 Comprehensive study notes for all medical subjects</li>
  <li>📝 Previous year question papers</li>
  <li>📊 Formula sheets and quick references</li>
  <li>🎯 Subject-wise organized content</li>
</ul>
<p>If you didn't create an account with MediNotes, you can safely ignore this email.</p>
<p>Best regards,<br>The MediNotes Team</p>
<p><small>This link will expire in 24 hours for security reasons.</small></p>
```

#### Reset Password Template:
```html
<h2>Reset Your MediNotes Password</h2>
<p>Hi there,</p>
<p>We received a request to reset the password for your MediNotes account.</p>
<p>To reset your password, click the link below:</p>
<p><a href="{{ .ConfirmationURL }}">Reset your password</a></p>
<p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
<p>For security reasons, this link will expire in 1 hour.</p>
<p>Need help? Contact us at support@medinotes.live</p>
<p>Best regards,<br>The MediNotes Team</p>
<p><small>MediNotes - Your Medical Study Companion</small></p>
```

### Email Settings to Configure:
1. **Sender Name**: `MediNotes`
2. **Sender Email**: Use your domain email like `noreply@medinotes.live` (requires domain verification)
3. **Subject Lines**:
   - Confirm Signup: `Welcome to MediNotes - Confirm Your Email`
   - Reset Password: `Reset Your MediNotes Password`

### Domain Email Setup (Optional but Recommended):
To use `noreply@medinotes.live` instead of the Supabase email:
1. Go to **Settings** → **Auth** → **SMTP Settings**
2. Configure your email provider (Gmail, SendGrid, etc.)
3. Verify your domain

## Testing
After updating Supabase settings:
1. Test password reset from your production site
2. Test email confirmation for new signups
3. Verify links in emails point to `https://medinotes.live` instead of `localhost:3000`
4. Check that emails show "MediNotes" as sender

## Environment Variables
Make sure to set the same environment variable in your production deployment:
```
NEXT_PUBLIC_SITE_URL=https://medinotes.live
```