# MediNotes Email Templates

## Custom Email Templates for Supabase Auth

### 1. Confirm Signup Email Template

**Subject**: `Welcome to MediNotes - Confirm Your Email`

**HTML Template**:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to MediNotes</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #f0f0f0; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .content { padding: 30px 0; }
        .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 20px 0; }
        .features { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .feature-item { margin: 10px 0; }
        .footer { text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">📚 MediNotes</div>
        <p>Your Medical Study Companion</p>
    </div>
    
    <div class="content">
        <h2>Welcome to MediNotes! 🎉</h2>
        
        <p>Hi there,</p>
        
        <p>Thank you for joining MediNotes - the ultimate platform for medical students to access comprehensive study materials, notes, and previous year questions.</p>
        
        <p>To complete your registration and unlock access to our extensive collection of study resources, please confirm your email address:</p>
        
        <p style="text-align: center;">
            <a href="{{ .ConfirmationURL }}" class="button">Confirm Your Email Address</a>
        </p>
        
        <div class="features">
            <h3>🚀 What's waiting for you:</h3>
            <div class="feature-item">📚 <strong>Comprehensive Notes</strong> - Detailed study materials for all medical subjects</div>
            <div class="feature-item">📝 <strong>Previous Year Papers</strong> - Extensive collection of PYQs to practice</div>
            <div class="feature-item">📊 <strong>Formula Sheets</strong> - Quick reference guides and cheat sheets</div>
            <div class="feature-item">🎯 <strong>Organized Content</strong> - Subject-wise categorized materials</div>
            <div class="feature-item">💾 <strong>Easy Downloads</strong> - Access materials anytime, anywhere</div>
        </div>
        
        <p>If you didn't create an account with MediNotes, you can safely ignore this email.</p>
        
        <p>Happy studying! 📖</p>
        
        <p>Best regards,<br><strong>The MediNotes Team</strong></p>
    </div>
    
    <div class="footer">
        <p>This confirmation link will expire in 24 hours for security reasons.</p>
        <p>MediNotes | Your Medical Study Companion</p>
        <p>Visit us at <a href="https://medinotes.live">medinotes.live</a></p>
    </div>
</body>
</html>
```

### 2. Reset Password Email Template

**Subject**: `Reset Your MediNotes Password`

**HTML Template**:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - MediNotes</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #f0f0f0; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .content { padding: 30px 0; }
        .button { display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 20px 0; }
        .security-notice { background-color: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; margin: 20px 0; }
        .footer { text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🔐 MediNotes</div>
        <p>Password Reset Request</p>
    </div>
    
    <div class="content">
        <h2>Reset Your Password</h2>
        
        <p>Hi there,</p>
        
        <p>We received a request to reset the password for your MediNotes account. No worries - it happens to the best of us! 😊</p>
        
        <p>To create a new password, click the button below:</p>
        
        <p style="text-align: center;">
            <a href="{{ .ConfirmationURL }}" class="button">Reset Your Password</a>
        </p>
        
        <div class="security-notice">
            <strong>🛡️ Security Notice:</strong>
            <ul>
                <li>This link will expire in 1 hour for your security</li>
                <li>If you didn't request this reset, you can safely ignore this email</li>
                <li>Your current password will remain unchanged until you create a new one</li>
            </ul>
        </div>
        
        <p>After resetting your password, you'll be able to continue accessing all your study materials and resources on MediNotes.</p>
        
        <p>Need help? Feel free to contact our support team at <a href="mailto:support@medinotes.live">support@medinotes.live</a></p>
        
        <p>Best regards,<br><strong>The MediNotes Team</strong></p>
    </div>
    
    <div class="footer">
        <p>This password reset link expires in 1 hour.</p>
        <p>MediNotes | Your Medical Study Companion</p>
        <p>Visit us at <a href="https://medinotes.live">medinotes.live</a></p>
    </div>
</body>
</html>
```

### 3. Magic Link Email Template (if using magic links)

**Subject**: `Your MediNotes Login Link`

**HTML Template**:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login to MediNotes</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #f0f0f0; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .content { padding: 30px 0; }
        .button { display: inline-block; padding: 12px 24px; background-color: #059669; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 20px 0; }
        .footer { text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🔗 MediNotes</div>
        <p>Quick Login Link</p>
    </div>
    
    <div class="content">
        <h2>Login to MediNotes</h2>
        
        <p>Hi there,</p>
        
        <p>Click the button below to securely log in to your MediNotes account:</p>
        
        <p style="text-align: center;">
            <a href="{{ .ConfirmationURL }}" class="button">Login to MediNotes</a>
        </p>
        
        <p>This link will log you in automatically - no password required! 🎉</p>
        
        <p>If you didn't request this login link, you can safely ignore this email.</p>
        
        <p>Happy studying! 📚</p>
        
        <p>Best regards,<br><strong>The MediNotes Team</strong></p>
    </div>
    
    <div class="footer">
        <p>This login link will expire in 1 hour for security reasons.</p>
        <p>MediNotes | Your Medical Study Companion</p>
        <p>Visit us at <a href="https://medinotes.live">medinotes.live</a></p>
    </div>
</body>
</html>
```

## How to Apply These Templates

1. **Go to Supabase Dashboard** → Your Project → **Authentication** → **Email Templates**

2. **For each template type** (Confirm signup, Reset password, Magic link):
   - Copy the HTML template above
   - Paste it into the "Message (HTML)" field
   - Update the subject line
   - Save the template

3. **Configure Sender Settings**:
   - Sender name: `MediNotes`
   - Sender email: `noreply@medinotes.live` (or keep default until you set up custom domain)

4. **Test the templates** by triggering the respective actions (signup, password reset, etc.)

## Custom Domain Email (Advanced)

To use `noreply@medinotes.live` as the sender email:

1. **Set up SMTP** in Supabase Settings → Auth → SMTP Settings
2. **Use a service** like SendGrid, Mailgun, or Gmail SMTP
3. **Verify your domain** with your email provider
4. **Configure DNS records** as required by your email provider

This will make emails appear to come from your domain instead of Supabase.