Smart Expense - Group Expense Tracker
A real-time expense splitting app built for Indian groups. Split bills, track balances, and settle up with minimal transactions.

🎯 What it does
Ever been on a trip with friends and spent hours calculating who owes what? This app solves exactly that problem. Add expenses, split them among group members, and get the optimal settlement plan that minimizes the number of transactions needed.

Live Demo: smart-expense-production.up.railway.app

✨ Key Features
   ->Smart Settlements: Uses algorithms to minimize transactions (if 5 people owe money, you might only need 2-3 transactions instead of 10+)
   ->Real-time Updates: When someone adds an expense, everyone sees it instantly
   ->UPI Integration: Generate QR codes for settlements (perfect for Indian users)
   ->Group Management: Create groups, add members, manage expenses
   ->Balance Tracking: Always know who owes what at a glance

🛠 Tech Stack
   1.Backend
      -Node.js with Express
      -MongoDB for data storage
      -Redis for caching (makes balance calculations super fast)
      -Socket.io for real-time features
      -JWT authentication
   2.Frontend
      -React 18+ with modern hooks
      -Tailwind CSS for styling
      -Socket.io client for real-time sync
      -Axios for API calls
   3.Testing & Deployment
      -Jest for testing
      -Railway for backend & frontend deployment

🚀 Getting Started
   ->Prerequisites
      -Node.js (v18+)
      -MongoDB
      -Redis (optional for local dev)

Installation
   # Clone the repo
   git clone https://github.com/yourusername/smart-expense.git
   cd smart-expense
   
   # Install backend dependencies
   cd api
   npm install
   
   # Install frontend dependencies  
   cd ../client
   npm install

Environment Setup
   Create .env file in the api directory:
      # Database
      MONGODB_URI=mongodb://localhost:27017/smart-expense
      # JWT Secrets (use strong random strings in production)
      JWT_ACCESS_SECRET=your-access-secret-here
      JWT_REFRESH_SECRET=your-refresh-secret-here
      # Redis (optional for local dev)
      REDIS_URL=redis://localhost:6379
      # Server
      PORT=5000
      NODE_ENV=development
      
Running Locally
   # Start backend (from api directory)
   npm run dev
   
   # Start frontend (from client directory)  
   npm run dev

The app will be available at http://localhost:5000

💡 How the Settlement Algorithm Works
   This was the most interesting part to build. Instead of everyone paying everyone else (which can be a lot of transactions), the app calculates the minimum number of payments needed.
   For example:
      ->Alice paid ₹300, should pay ₹100 → she's owed ₹200
      ->Bob should pay ₹150 but paid ₹0 → he owes ₹150
      ->Carol should pay ₹150 but paid ₹50 → she owes ₹100
      ->Instead of 3 separate transactions, Bob pays Alice ₹150 and Carol pays Alice ₹50. Done in 2 transactions instead of 3.

🏗 Architecture Highlights
      -Layered Backend: Controllers → Services → Models pattern for clean separation
      -Caching Strategy: Redis caches balance calculations (200ms → 5ms improvement)
      -Real-time Sync: Socket.io rooms for group-based updates
      -Indian UPI: QR code generation for seamless payments

🧪 Running Tests
   # Backend tests
   cd api
   npm test
   
   # The tests use an in-memory MongoDB so no setup needed

🎯 Future Ideas
       -Proper UPI Integration
       -Multi-currency support
       -Export to PDF/Excel
       -Bank integration for automatic expense detection
       -Advanced analytics and spending insights
       
🚀 Deployment
   The app is deployed with:
      ->Backend & Frontend: Railway
      ->Database: MongoDB Atlas
      ->Cache: Railway Redis

📝 Notes
      -Built this while learning full-stack development
      -The settlement algorithm was inspired by the "minimum cash flow" problem
      -Redis caching made a huge difference in performance for complex group calculations
      -Socket.io was tricky to get right with authentication, but the real-time experience is worth it

🤝 Contributing
   Feel free to open issues or submit PRs if you find bugs or have suggestions!
