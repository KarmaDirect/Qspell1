-- Helper SQL to set admin roles after manual account creation

-- This file contains SQL commands to run AFTER creating admin accounts manually

-- Step 1: Create accounts manually via Supabase Dashboard or registration
-- Go to https://supabase.com/dashboard/project/YOUR_PROJECT/auth/users
-- Click "Add user" and create each account with:
--   - admin.tournois@qspell.gg
--   - admin.coaching@qspell.gg  
--   - admin.moderateur@qspell.gg
-- Password: AdminQspell2024!

-- Step 2: Run these commands to set admin roles

-- Set CEO role for hatim.moro.2002@gmail.com
UPDATE profiles 
SET role = 'ceo', display_name = 'Hatim (CEO)'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'hatim.moro.2002@gmail.com'
);

-- Set admin role for admin.tournois@qspell.gg
UPDATE profiles 
SET role = 'admin', display_name = 'Admin Tournois'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin.tournois@qspell.gg'
);

-- Set admin role for admin.coaching@qspell.gg
UPDATE profiles 
SET role = 'admin', display_name = 'Admin Coaching'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin.coaching@qspell.gg'
);

-- Set admin role for admin.moderateur@qspell.gg
UPDATE profiles 
SET role = 'admin', display_name = 'Admin Modérateur'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'admin.moderateur@qspell.gg'
);

-- Verify roles
SELECT 
  u.email,
  p.username,
  p.display_name,
  p.role
FROM auth.users u
JOIN profiles p ON p.id = u.id
WHERE p.role IN ('admin', 'ceo')
ORDER BY p.role DESC, u.email;

-- Display result
DO $$ 
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'RÔLES ADMIN CONFIGURÉS';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Vérifiez les résultats ci-dessus.';
  RAISE NOTICE 'Tous les comptes avec role "admin" ou "ceo" ont accès au dashboard admin.';
  RAISE NOTICE '========================================';
END $$;

