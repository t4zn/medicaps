-- Add admin roles for specified email addresses
UPDATE profiles 
SET role = 'admin' 
WHERE email IN ('taizun8@gmail.com', 'tzkaptan53@gmail.com');

-- Verify the updates
SELECT id, email, full_name, role, created_at 
FROM profiles 
WHERE email IN ('taizun8@gmail.com', 'tzkaptan53@gmail.com');