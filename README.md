SMARTEXPENSE
A UPI-first expense split and budget tracker PWA for Indian users. Focused on clean architecture and modern tooling, SmartExpense enables group expense management, real-time notifications, and secure UPI deep-link payments.


FEATURES

User Authentication: Secure signup, login, JSON Web Tokens (access and refresh).
Group Management: Create, view, and update expense groups.
Expense Tracking: Add and split expenses (equal, percentage, shares).
UPI Payments: Generate UPI deep-links and QR codes for instant settlement.
Dashboard: Interactive React PWA with spending charts and balances.
Real-Time Notifications: WebSocket alerts powered by Redis pub/sub.
CI/CD: Automated testing and deployment via GitHub Actions.



TECH STACK
Backend: Node.js 20, Express, TypeScript, Zod, Mongoose
Database: MongoDB Atlas
Cache and Jobs: Redis, BullMQ
Real-Time: ws (WebSockets)
Auth and Security: bcrypt, JWT, helmet, rate-limiter-flexible
Payments: UPI deep-links, Razorpay Orders API
Frontend: React, Vite, Tailwind CSS, React Query
State and Forms: Zustand, react-hook-form, Zod
Charts: Recharts
Testing: Jest, Supertest, React Testing Library
Deployment: GitHub Actions, Render (API), Netlify (UI)


INSTALLATION AND SETUP
a. Clone repository:
git clone https://github.com/ramblingbugbear2/smart-expense.git
cd smart-expense
b. Install dependencies:
npm install
c. Create a .env file with the following variables:
PORT=5000
MONGODB_URI=
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
d. Start the backend server:
npm run dev
e. Start the frontend:
cd client
npm install
npm run dev
f. Open browser at http://localhost:5173 to view the app.


API ENDPOINTS
GET    /hello            Health check
POST   /signup           User registration
POST   /login            User login and token issuance
GET    /groups           List user groups
POST   /groups           Create a new group
GET    /groups/:id       Get group details
PATCH  /groups/:id       Update group information
POST   /groups/:id/expenses    Add an expense to a group
GET    /groups/:id/expenses    List expenses for a group
GET    /groups/:id/settle-up   Generate UPI link and QR code for settlement


CONTRIBUTING
Contributions are welcome. Fork the repo, create a feature branch, commit changes, and open a pull request.


LICENSE
ISC License


Crafted with care by Vivek Chauhan
