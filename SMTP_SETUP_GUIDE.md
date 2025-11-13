# SMTP Setup Guide for MediNotes

## Recommended SMTP Providers

### Option 1: Gmail SMTP (Easiest to start with)

**Requirements:**
- Gmail account
- App Password (not your regular Gmail password)

**Settings:**
- **Host:** `smtp.gmail.com`
- **Port:** `587` (recommended) or `465`
- **Username:** Your Gmail address (e.g., `your-email@gmail.com`)
- **Password:** App Password (generated from Gmail settings)
- **Minimum interval per user:** `60` seconds

**Steps to get Gmail App Password:**
1. Go to your Google Account settings
2. Security → 2-Step Verification (must be enabled)
3. App passwords → Generate new app password
4. Select "Mail" and "Other" → Enter "MediNotes Supabase"
5. Use the generated 16-character password in Supabase

**Sender Email:** You can use your Gmail address, but it will show as from Gmail

---

### Option 2: SendGrid (Professional - Recommended)

**Why SendGrid:**
- Professional email delivery
- Custom domain support (`noreply@medinotes.live`)
- Better deliverability rates
- Free tier: 100 emails/day

**Settings:**
- **Host:** `smtp.sendgrid.net`
- **Port:** `587`
- **Username:** `apikey` (literally the word "apikey")
- **Password:** Your SendGrid API Key
- **Minimum interval per user:** `30` seconds

**Setup Steps:**
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Verify your account
3. Go to Settings → API Keys → Create API Key
4. Choose "Restricted Access" → Mail Send (Full Access)
5. Copy the API key and use it as password in Supabase

**For Custom Domain (`noreply@medinotes.live`):**
1. In SendGrid: Settings → Sender Authentication → Domain Authentication
2. Add your domain `medinotes.live`
3. Add the DNS records SendGrid provides to your domain
4. Once verified, you can use `noreply@medinotes.live` as sender

---

### Option 3: Mailgun (Alternative Professional Option)

**Settings:**
- **Host:** `smtp.mailgun.org`
- **Port:** `587`
- **Username:** Your Mailgun SMTP username
- **Password:** Your Mailgun SMTP password
- **Minimum interval per user:** `30` seconds

**Setup:**
1. Sign up at [mailgun.com](https://mailgun.com)
2. Add and verify your domain
3. Get SMTP credentials from Domain Settings

---

## Quick Start Recommendation

**For immediate setup:** Use Gmail SMTP
**For professional setup:** Use SendGrid with custom domain

## Gmail SMTP Setup (Step by Step)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)" → Enter "MediNotes"
   - Copy the 16-character password

3. **Configure in Supabase:**
   ```
   Host: smtp.gmail.com
   Port: 587
   Username: your-gmail@gmail.com
   Password: [16-character app password]
   Minimum interval: 60
   ```

4. **Update Sender Settings:**
   - Sender name: `MediNotes`
   - Sender email: `your-gmail@gmail.com`

## SendGrid Setup (Professional)

1. **Sign up for SendGrid** (free tier available)
2. **Create API Key:**
   - Settings → API Keys → Create API Key
   - Name: "MediNotes Supabase"
   - Permissions: Restricted Access → Mail Send (Full Access)

3. **Configure in Supabase:**
   ```
   Host: smtp.sendgrid.net
   Port: 587
   Username: apikey
   Password: [Your SendGrid API Key]
   Minimum interval: 30
   ```

4. **For Custom Domain Email:**
   - SendGrid → Settings → Sender Authentication → Domain Authentication
   - Add `medinotes.live`
   - Add provided DNS records to your domain
   - Once verified, use `noreply@medinotes.live` as sender email

## Testing Your SMTP Setup

After configuring SMTP:

1. **Test signup email** - Create a new account
2. **Test password reset** - Use forgot password feature
3. **Check spam folder** - Emails might initially go to spam
4. **Verify sender name** - Should show "MediNotes" instead of "Supabase Auth"

## Troubleshooting

**Common Issues:**
- **Authentication failed:** Check username/password
- **Connection timeout:** Try port 465 instead of 587
- **Emails in spam:** Set up SPF/DKIM records (SendGrid helps with this)
- **Rate limiting:** Increase minimum interval per user

**Gmail Specific:**
- Must use App Password, not regular password
- 2FA must be enabled
- Check "Less secure app access" is not needed with App Passwords

**SendGrid Specific:**
- Username must be exactly "apikey"
- API key must have Mail Send permissions
- Domain verification required for custom sender email

## Recommended Configuration

**For Production (MediNotes):**
```
Provider: SendGrid
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: [SendGrid API Key]
Sender Name: MediNotes
Sender Email: noreply@medinotes.live (after domain verification)
Minimum Interval: 30 seconds
```

This setup will give you professional-looking emails from your own domain with reliable delivery.