#!/bin/bash

# Script to create admin accounts for QSPELL
# This script uses Supabase CLI and Admin API

echo "=========================================="
echo "🔐 QSPELL - Admin Account Creation"
echo "=========================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local with your Supabase credentials"
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env.local | xargs)

# Check for required variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_URL not found in .env.local"
    exit 1
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "⚠️  SUPABASE_SERVICE_ROLE_KEY not found in .env.local"
    echo "Please add your service role key to .env.local"
    echo "You can find it in: Supabase Dashboard > Project Settings > API"
    exit 1
fi

echo "✅ Environment variables loaded"
echo "📦 Installing dependencies..."
echo ""

# Install @supabase/supabase-js if needed
npm list @supabase/supabase-js > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Installing @supabase/supabase-js..."
    npm install @supabase/supabase-js
fi

echo ""
echo "🚀 Running admin account creation script..."
echo ""

# Run the Node.js script
node scripts/create-admin-accounts.js

echo ""
echo "✅ Script execution complete!"
echo ""
echo "Next steps:"
echo "1. Login with your CEO account (hatim.moro.2002@gmail.com)"
echo "2. You should see a red 'Admin' button in the navigation"
echo "3. Click it to access the admin dashboard"
echo ""

