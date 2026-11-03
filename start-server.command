#!/bin/bash
cd "$(dirname "$0")/server"

echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
  echo "Installing packages (first time)..."
  npm install
fi

echo "🗄️  Running database migrations..."
npx prisma migrate dev --name init 2>/dev/null || npx prisma db push 2>/dev/null || true

echo ""
echo "🚀 Starting E-Menu server..."
echo "──────────────────────────────"
echo "  Open: http://localhost:5000/app.html"
echo "──────────────────────────────"
echo ""
npm run dev
