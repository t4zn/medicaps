# Medicaps Resources - Complete Setup Guide

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs @octokit/rest react-dropzone class-variance-authority @radix-ui/react-label @radix-ui/react-select @radix-ui/react-dialog
```

### 2. Environment Variables
Create `.env.local` file:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# GitHub
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=medicaps-resources-pdfs
```

### 3. Supabase Setup

#### A. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get your project URL and anon key from Settings > API

#### B. Run Database Schema
1. Go to Supabase Dashboard > SQL Editor
2. Copy and paste the content from `supabase-schema.sql`
3. Run the query

#### C. Configure Authentication
1. Go to Authentication > Settings
2. Enable email authentication
3. Configure email templates (optional)

### 4. GitHub Setup

#### A. Create Repository
1. Create a new public repository: `medicaps-resources-pdfs`
2. Initialize with README

#### B. Generate Personal Access Token
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate new token (classic)
3. Select scopes: `repo` (full control)
4. Copy the token

### 5. Test the Integration

#### A. Start Development Server
```bash
npm run dev
```

#### B. Test Features
1. Visit `/auth` - Sign up/Sign in
2. Visit `/upload` - Upload a PDF file
3. Visit `/browse` - Browse uploaded files
4. Check GitHub repo for uploaded files
5. Test download functionality

## 🎯 Features Included

### ✅ Authentication
- Email/password signup and login
- User profiles with Supabase
- Protected routes and components

### ✅ File Management
- PDF upload with drag & drop
- Automatic GitHub storage via API
- CDN delivery via jsDelivr
- File metadata in Supabase database

### ✅ UI Components
- Modern, responsive design
- File browser with search and filters
- Upload progress and status
- User dashboard

### ✅ Admin Features
- File approval system
- Download tracking
- User management via Supabase

## 🔧 Customization

### Adding New Subjects
Edit `settings/documents.ts` to add more subjects under each program/year.

### Styling
All components use Tailwind CSS and shadcn/ui components.

### File Size Limits
Current limit: 10MB per file. Adjust in `app/api/upload/route.ts`.

## 📊 Database Schema

### Tables Created:
- `profiles` - User information
- `files` - File metadata and paths
- `downloads` - Download tracking

### Security:
- Row Level Security (RLS) enabled
- Users can only see approved files
- Users can manage their own uploads

## 🚨 Important Notes

1. **GitHub Repository**: Must be public for CDN access
2. **File Approval**: All uploads require admin approval
3. **Storage**: GitHub provides unlimited storage for public repos
4. **CDN**: jsDelivr provides fast global delivery
5. **Security**: All sensitive operations use service role key

## 🎉 You're Ready!

Your Medicaps Resources platform is now fully functional with:
- User authentication
- File upload/download
- GitHub + Supabase integration
- Modern, responsive UI
- Admin approval system

Students can now upload and share study materials seamlessly!