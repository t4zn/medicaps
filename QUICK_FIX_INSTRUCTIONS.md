# Quick Fix Instructions

## Step 1: Run Emergency SQL Fix
Run this SQL in Supabase SQL Editor:

```sql
-- Emergency fix - remove role constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Set default and clean data
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'user';
UPDATE profiles SET role = 'user' WHERE role IS NULL OR role = '';

-- Set owner roles
UPDATE profiles SET role = 'owner' WHERE email IN ('taizun8@gmail.com', 'tzkaptan53@gmail.com');
UPDATE profiles SET role = 'admin' WHERE email = 'pathforge2025@gmail.com';
```

## Step 2: Verify the Fix
After running the SQL, the following should work:
- Profile page should load without errors
- Admin panel should be accessible to owner emails
- User management should work

## Step 3: Add Constraint Back (Optional)
Once everything is working, you can add the constraint back:

```sql
-- Add constraint back
ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('owner', 'admin', 'moderator', 'uploader', 'user'));
```

## Current Status
- ✅ Fallback system implemented for critical functions
- ✅ Error handling improved in components
- ✅ Owner emails hardcoded as backup
- ✅ Emergency SQL provided

## Files Modified
- `lib/roles-fallback.ts` - Fallback permission system
- `components/navigation/navbar.tsx` - Uses fallback for admin access
- `components/admin/UserManagement.tsx` - Uses fallback for user management
- `components/profile/SavedResources.tsx` - Better error handling
- `emergency-roles-fix.sql` - Emergency database fix