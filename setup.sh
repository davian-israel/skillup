#!/bin/bash

echo "🚀 SkillFundr MVP Setup Script"
echo "================================"
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists. Skipping creation."
else
    echo "📝 Creating .env file..."
    cat > .env << 'EOF'
# Database
DATABASE_URL="postgresql://$(whoami)@localhost:5432/skillfundr"

# Authentication
JWT_SECRET="8f3a9d5c7e1b4f6a8c0d2e5f7a9b1c3d4e6f8a0b2c4d6e8f0a1b3c5d7e9f1a3b"
ENCRYPTION_KEY="generate-a-64-char-hex-string-for-aes-256-encryption-security"

# Next Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="7b2a4e8f1c5d9a6b3e7f0c4a8d2f6b9e1c5a7d3f9b0e4a6c8d1f5b7a9c3e5f1"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
EOF
    
    # Replace $(whoami) with actual username
    USERNAME=$(whoami)
    sed -i.bak "s/\$(whoami)/$USERNAME/g" .env
    rm .env.bak
    
    echo "✅ .env file created successfully!"
fi

echo ""
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

echo ""
echo "🗄️  Setting up database..."

# Check if database exists
if psql -lqt | cut -d \| -f 1 | grep -qw skillfundr; then
    echo "⚠️  Database 'skillfundr' already exists. Skipping creation."
else
    echo "Creating database 'skillfundr'..."
    createdb skillfundr
    echo "✅ Database created!"
fi

echo ""
echo "🔧 Generating Prisma client..."
npx prisma generate

echo ""
echo "🔄 Running database migrations..."
npx prisma migrate dev --name init

echo ""
echo "🌱 Seeding database with test data..."
npm run db:seed

echo ""
echo "✨ Setup complete!"
echo ""
echo "📧 Test Accounts Created:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "👨‍💼 Admin Account:"
echo "   Email: admin@skillfundr.com"
echo "   Password: Test1234"
echo ""
echo "👨‍🎓 Student Accounts:"
echo "   Email: john.student@example.com"
echo "   Password: Test1234"
echo ""
echo "   Email: sarah.student@example.com"
echo "   Password: Test1234"
echo ""
echo "🏢 Organization Accounts:"
echo "   Email: tech.ngo@example.com"
echo "   Password: Test1234"
echo ""
echo "   Email: startup@example.com"
echo "   Password: Test1234"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 You're all set! Run 'npm run dev' to start the development server."
echo ""

