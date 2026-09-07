🍽️ BiteFlow — Cafeteria Management System

A role-based cafeteria ordering and operations platform built as a 3rd Year IT Capstone Project. BiteFlow covers the full flow from menu browsing and ordering to kitchen fulfillment, nutrition tracking, and admin control — with a live React frontend backed by a Node/Express + Prisma API.

📦 Repository Structure
cafeteria-projectSSS/
├── cafeteria-ui/        # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # NavBar, Footer
│   │   ├── context/     # AppContext (global state, auth, cart, orders)
│   │   ├── pages/       # Home, MenuBrowser, OrderForm, KitchenDashboard, Dashboard, AdminPanel
│   │   └── App.jsx      # Route definitions
│   └── package.json
└── cafeteria-backend/   # Node/Express + Prisma API
    ├── src/
    │   ├── index.ts     # API routes & server entry
    │   └── seed.ts      # Database seed script
    ├── prisma/
    │   └── schema.prisma
    └── package.json
🛠️ Tech Stack
Frontend (cafeteria-ui)
Layer	Technology
Build tool	Vite 8
UI library	React 19.2
Routing	react-router-dom 7.18
Icons	lucide-react
State management	React Context (AppContext.jsx)
Linting	oxlint
Backend (cafeteria-backend)
Layer	Technology
Runtime	Node.js (via tsx)
Framework	Express 5
ORM	Prisma 5
Database	SQLite (dev.db)
Auth	JSON Web Tokens (jsonwebtoken) + bcrypt password hashing
Dev port	3000
👥 Roles (RBAC)

BiteFlow ships with an in-app RBAC Simulator Panel (visible in the NavBar) for demoing every role without separate logins:

Role	Access
customer / guest	Browse menu, place orders, view own order history
chef	Kitchen Console — view & update order status
cashier	Kitchen Console access, payment handling
nutritionist	Business Insights dashboard, nutrition data
manager	Business Insights dashboard
admin	Full access — Control Room (menu CRUD, audit logs)
🧭 Routes
Path	Page Component	Description
/	Home.jsx	Landing page with hero section & Chef's Specials
/menu	MenuBrowser.jsx	Searchable, filterable menu (category, diet, calories)
/order	OrderForm.jsx	Cart review & checkout (dining preference, payment, instructions)
/kitchen	KitchenDashboard.jsx	Kitchen console for order status updates (chef/cashier/admin only)
/dashboard	Dashboard.jsx	Business insights & analytics (manager/nutritionist/admin only)
/admin	AdminPanel.jsx	Menu item CRUD + audit log viewer (admin only)
🔌 API Endpoints
Method	Endpoint	Auth	Description
POST	/api/auth/login	—	Authenticate and receive a JWT
POST	/api/users	—	Register a new user
GET	/api/users	✅	List users
GET	/api/menu	—	List all menu items
POST	/api/menu	✅	Create a new menu item
GET	/api/orders	✅	List orders
POST	/api/orders	✅	Place a new order
PATCH	/api/orders/:id/status	✅	Update order status (Pending → Preparing → Ready → Completed)
GET	/api/inventory	✅	List inventory items
POST	/api/inventory	✅	Add an inventory item
🗄️ Data Model

Defined in cafeteria-backend/prisma/schema.prisma:

User — username, email, role (Customer/Chef/Cashier/Nutritionist), dietary restrictions
MenuItem — name, category, price, calories, allergens, linked chef
Order — customer, status, payment method, delivery preference, special instructions
OrderItem — order line items (menu item, quantity, unit price)
Inventory — item name, quantity, unit, reorder level, expiration date
🚀 Getting Started
Backend
bash
cd cafeteria-backend
npm install
npx prisma migrate dev
npm run dev        # runs on http://localhost:3000
Frontend
bash
cd cafeteria-ui
npm install
npm run dev         # runs on http://localhost:5173 (Vite default)

The frontend logs in automatically on load and pulls live menu/order data from the backend once a token is issued (see AppContext.jsx).

✨ Features
🔎 Menu browsing with category, dietary, and calorie filters
🛒 Cart + checkout with dining preference (Dine-in / Takeaway / Delivery) and payment method selection
👨‍🍳 Kitchen Console for real-time order status updates
📊 Business Insights dashboard for managers/nutritionists
🛡️ Admin Control Room — menu CRUD and audit log trail
🔔 In-app notifications and role-switching simulator for demos
