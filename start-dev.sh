#!/bin/bash

# Nova Amino Development Server Startup Script
echo "🚀 Starting Nova Amino Development Server..."

# Kill any existing processes on common ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Wait a moment for cleanup
sleep 1

# Start the development server on a specific port
echo "🔧 Starting Vite development server..."
npx vite --port 3000 --host 0.0.0.0 --open

echo "✅ Development server should be running at http://localhost:3000"
echo "📝 If port 3000 is busy, Vite will automatically try the next available port"