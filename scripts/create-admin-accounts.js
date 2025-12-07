// Script to create admin accounts using Supabase Admin API
// Run with: node scripts/create-admin-accounts.js

const { createClient } = require('@supabase/supabase-js')

// Get credentials from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Service role key needed

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const adminAccounts = [
  {
    email: 'admin.tournois@qspell.gg',
    password: 'AdminQspell2024!',
    username: 'admin-tournois',
    displayName: 'Admin Tournois',
    role: 'admin'
  },
  {
    email: 'admin.coaching@qspell.gg',
    password: 'AdminQspell2024!',
    username: 'admin-coaching',
    displayName: 'Admin Coaching',
    role: 'admin'
  },
  {
    email: 'admin.moderateur@qspell.gg',
    password: 'AdminQspell2024!',
    username: 'admin-modo',
    displayName: 'Admin Modérateur',
    role: 'admin'
  }
]

async function createAdminAccounts() {
  console.log('🚀 Starting admin account creation...\n')

  // First, set CEO role for existing account
  console.log('👑 Setting CEO role for hatim.moro.2002@gmail.com...')
  
  const { data: existingUser } = await supabase
    .from('auth.users')
    .select('id')
    .eq('email', 'hatim.moro.2002@gmail.com')
    .single()

  if (existingUser) {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        role: 'ceo',
        display_name: 'Hatim (CEO)'
      })
      .eq('id', existingUser.id)

    if (updateError) {
      console.error('❌ Error setting CEO role:', updateError.message)
    } else {
      console.log('✅ CEO role set successfully\n')
    }
  }

  // Create admin accounts
  for (const account of adminAccounts) {
    console.log(`📝 Creating account: ${account.email}...`)

    try {
      // Create user with admin API
      const { data: userData, error: createError } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: {
          username: account.username
        }
      })

      if (createError) {
        if (createError.message.includes('already registered')) {
          console.log(`⚠️  Account already exists, updating role...`)
          
          // Get user ID
          const { data: existingUser } = await supabase
            .from('auth.users')
            .select('id')
            .eq('email', account.email)
            .single()

          if (existingUser) {
            // Update profile role
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ 
                role: account.role,
                display_name: account.displayName
              })
              .eq('id', existingUser.id)

            if (updateError) {
              console.error(`❌ Error updating role: ${updateError.message}`)
            } else {
              console.log(`✅ Role updated successfully`)
            }
          }
        } else {
          console.error(`❌ Error creating user: ${createError.message}`)
        }
        continue
      }

      if (!userData.user) {
        console.error(`❌ No user data returned`)
        continue
      }

      console.log(`✅ User created with ID: ${userData.user.id}`)

      // Update profile role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          role: account.role,
          display_name: account.displayName,
          username: account.username
        })
        .eq('id', userData.user.id)

      if (profileError) {
        console.error(`❌ Error updating profile: ${profileError.message}`)
      } else {
        console.log(`✅ Profile updated with admin role`)
      }

      console.log()

    } catch (error) {
      console.error(`❌ Unexpected error:`, error)
      console.log()
    }
  }

  // Verify all admin accounts
  console.log('🔍 Verifying admin accounts...\n')
  
  const { data: adminProfiles, error: verifyError } = await supabase
    .from('profiles')
    .select(`
      id,
      username,
      display_name,
      role
    `)
    .in('role', ['admin', 'ceo'])
    .order('role', { ascending: false })

  if (verifyError) {
    console.error('❌ Error verifying accounts:', verifyError.message)
  } else {
    console.log('✅ Admin accounts created/updated:\n')
    console.table(adminProfiles)
  }

  console.log('\n========================================')
  console.log('✨ Admin account setup complete!')
  console.log('========================================')
  console.log('\n📋 Credentials:')
  console.log('CEO: hatim.moro.2002@gmail.com (your existing password)')
  console.log('Admin 1: admin.tournois@qspell.gg / AdminQspell2024!')
  console.log('Admin 2: admin.coaching@qspell.gg / AdminQspell2024!')
  console.log('Admin 3: admin.moderateur@qspell.gg / AdminQspell2024!')
  console.log('\n⚠️  Remember to change passwords after first login!')
}

createAdminAccounts().catch(console.error)

