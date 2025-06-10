SmartExpense
A UPI-first expense split & budget tracker PWA for Indian users. With a focus on clean architecture and modern tooling, SmartExpense enables seamless group expense management, real-time notifications, and secure UPI deep-link payments.
🚀 Features

User Authentication: Secure signup, login, JWT access & refresh tokens.
Group Management: Create, view, update expense groups with member lists.
Expense Tracking: Add, view, and split expenses (equal, percentage, shares).
UPI Payments: Generate UPI deep-links and QR codes for instant settlement.
Dashboard: React-based dashboard with charts to visualize spends and balances.
Real-time Notifications: WebSocket notifications via Redis pub/sub.
CI/CD: Automated tests and deployment via GitHub Actions.

📦 Tech Stack



Layer
Technology




Backend
Node.js 20, Express, TypeScript


Database
MongoDB Atlas, Mongoose


Cache & Jobs
Redis, BullMQ, ioredis


Real-time
ws (WebSockets)


Auth & Security
bcrypt, JWT, helmet, rate-limiter


Payments
UPI deep-links, Razorpay Orders API


Frontend
React, Vite, Tailwind CSS, React-Query


State & Forms
Zustand, react-hook-form, Zod


Charts
Recharts


Testing
Jest, Supertest, React Testing Library


CI/CD & Deploy
GitHub Actions, Render (API), Netlify (UI)



🛠️ Installation & Setup


Clone the repository:
git clone https://github.com/ramblingbugbear2/smart-expense.git
cd smart-expense



Install dependencies:
npm install



Create a .env file in the project root with the following variables:
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
REDIS_HOST=<your-redis-host>
REDIS_PORT=<your-redis-port>
REDIS_PASSWORD=<your-redis-password>
JWT_ACCESS_SECRET=<your-access-token-secret>
JWT_REFRESH_SECRET=<your-refresh-token-secret>



Start the development server:
npm run dev



Open the frontend:
cd client
npm install
npm run dev

Visit http://localhost:5173 in your browser.


📚 API Endpoints

GET /hello – Health check
POST /signup – User registration
POST /login – User login & token issuance
GET /groups – List user groups
POST /groups – Create a new group
GET /groups/:id – Get group details
PATCH /groups/:id – Update group info
POST /groups/:id/expenses – Add an expense to a group
GET /groups/:id/expenses – List group expenses
GET /groups/:id/settle-up – Generate UPI link/QR for settlement

🎯 Roadmap

[ ] Dark mode & PWA support
[ ] OCR-based receipt scanning
[ ] Automatic categorization & spend alerts
[ ] OAuth 2.0 social login
[ ] Observability with Prometheus & Grafana

🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request.
📄 License
This project is licensed under the ISC License.

Crafted with ❤️ by Vivek Chauhan
