# Farmers Marketplace Platform

A full-stack e-commerce platform connecting farmers directly with customers. Built with React, TypeScript, Node.js, Express, and MongoDB.

## 🌟 Features

### User Features
- **Secure Authentication**: JWT-based authentication with HTTP-only cookies
- **Shopping Cart**: Add, update, and remove products from cart
- **Checkout Process**: Multi-step checkout with address and payment information
- **Order Management**: View order history and track shipments
- **Payment Options**: Support for card and cash on delivery

### Farmer Features
- **Farmer Dashboard**: Comprehensive dashboard with statistics and analytics
- **Product Management**: CRUD operations for products with availability toggle
- **Order Management**: View and update order statuses
- **Customer Management**: View customer details and order history
- **Shipment Management**: Create and track shipments with tracking numbers
- **Analytics**: Real-time statistics on products, orders, customers, and revenue

### Platform Features
- **Secure Token Handling**: HTTP-only cookies for access and refresh tokens
- **Automatic Token Refresh**: Seamless authentication experience
- **Email Verification**: Email-based verification using Nodemailer
- **Password Reset**: Secure password reset functionality
- **Responsive Design**: Fully responsive UI for all screen sizes
- **Modern UI/UX**: Clean, professional interface using Tailwind CSS and Shadcn UI

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Redux Toolkit** - State management
- **React Query (TanStack Query)** - Server state management
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - UI component library
- **Formik & Yup** - Form management and validation
- **React Toastify** - Toast notifications
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js 5** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT (jsonwebtoken)** - Authentication tokens
- **Bcryptjs** - Password hashing
- **Zod** - Schema validation
- **Nodemailer** - Email service (SMTP)
- **React Email** - Email templates
- **Cookie Parser** - Cookie handling
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Morgan** - HTTP request logger

## 📁 Project Structure

```
Farmers/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── cart/       # Shopping cart components
│   │   │   ├── checkout/   # Checkout components
│   │   │   ├── contact/    # Contact page components
│   │   │   ├── dashboard/  # Farmer dashboard components
│   │   │   ├── header/     # Header and navigation
│   │   │   ├── footer/     # Footer components
│   │   │   ├── payment/    # Payment components
│   │   │   ├── products/   # Product components
│   │   │   └── ui/         # UI component library
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── hooks/          # Custom React hooks
│   │   ├── store/          # Redux store and slices
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   └── conf/           # Configuration files
│   ├── public/             # Static assets
│   └── package.json
│
├── server/                 # Backend Node.js application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic layer
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Express middlewares
│   │   ├── validator/      # Zod validation schemas
│   │   ├── utils/          # Utility functions
│   │   ├── helpers/        # Helper functions
│   │   ├── emails/         # Email templates
│   │   ├── db/             # Database connection
│   │   └── server.ts       # Entry point
│   └── package.json
│
├── docker-compose.yml      # Docker compose configuration
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Farmers
   ```

2. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../server
   npm install
   ```

### Environment Variables

#### Frontend (`client/.env`)

Create a `.env` file in the `client` directory:

```env
VITE_BACKEND_URL=http://localhost:8000/api
```

#### Backend (`server/.env`)

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017

# CORS
CLIENT_URL=http://localhost:5173

# JWT Configuration
JWT_ACCESS_SECRET=your-access-token-secret-key
JWT_REFRESH_SECRET=your-refresh-token-secret-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Email Service (Nodemailer - SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_SERVICE=gmail
SMTP_PORT=587
SMTP_MAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=noreply@yourdomain.com
```

**Note**: Replace all placeholder values with your actual credentials.

### Running the Application

#### Development Mode

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:8000`

3. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

#### Production Mode

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Build the backend**
   ```bash
   cd server
   npm run build
   ```

3. **Start the backend**
   ```bash
   npm start
   ```

#### Using Docker

1. **Start all services**
   ```bash
   docker-compose up -d
   ```

2. **Stop all services**
   ```bash
   docker-compose down
   ```

## 📡 API Endpoints

### Authentication Endpoints

#### User Authentication
- `POST /api/users/create` - Register new user
- `POST /api/users/verify` - Verify user email
- `POST /api/users/login` - User login
- `POST /api/users/refresh` - Refresh access token
- `GET /api/users/me` - Get current user (protected)
- `GET /api/users/logout` - User logout (protected)
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/reset-password` - Reset password

#### Farmer Authentication
- `POST /api/farmers/register-farmer` - Register new farmer
- `POST /api/farmers/verify-farmer` - Verify farmer email
- `POST /api/farmers/login-farmer` - Farmer login
- `POST /api/farmers/refresh` - Refresh access token
- `GET /api/farmers/farmer` - Get current farmer (protected)
- `GET /api/farmers/logout` - Farmer logout (protected)
- `POST /api/farmers/forgot-password` - Request password reset
- `POST /api/farmers/reset-password` - Reset password

### Product Endpoints (Farmer Only)
- `GET /api/farmers/products` - Get all products for farmer (protected)
- `GET /api/farmers/products/:id` - Get product by ID (protected)
- `POST /api/farmers/products` - Create new product (protected)
- `PUT /api/farmers/products/:id` - Update product (protected)
- `DELETE /api/farmers/products/:id` - Delete product (protected)
- `PATCH /api/farmers/products/:id/toggle-availability` - Toggle product availability (protected)

### Dashboard Endpoints (Farmer Only)
- `GET /api/farmers/dashboard/stats` - Get dashboard statistics (protected)
- `GET /api/farmers/dashboard/customers` - Get customers list (protected)
- `GET /api/farmers/dashboard/orders` - Get orders list (protected)
- `GET /api/farmers/dashboard/shipments` - Get shipments list (protected)

### Order Endpoints
- `POST /api/users/orders` - Create new order (protected, user only)

### Order Management (Farmer Only)
- `PATCH /api/farmers/orders/:id/status` - Update order status (protected)

### Shipment Endpoints (Farmer Only)
- `POST /api/farmers/shipments` - Create new shipment (protected)
- `PATCH /api/farmers/shipments/:id/status` - Update shipment status (protected)

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication with the following security features:

- **HTTP-only Cookies**: Tokens are stored in HTTP-only cookies to prevent XSS attacks
- **Access Tokens**: Short-lived tokens (15 minutes) for API requests
- **Refresh Tokens**: Long-lived tokens (7 days) stored in HTTP-only cookies
- **Automatic Token Refresh**: Frontend automatically refreshes expired access tokens
- **Token Rotation**: Refresh tokens are rotated on each use for enhanced security
- **Token Blacklisting**: Tokens are blacklisted on logout

## 📦 Key Features Implementation

### Shopping Cart
- Add/remove products
- Update quantities
- Apply promo codes
- Calculate totals with discounts
- Persistent cart state using Redux

### Checkout Process
- Multi-step checkout flow
- Address form validation
- Payment method selection (card/cash)
- Order creation and confirmation

### Farmer Dashboard
- Real-time statistics (products, orders, customers, revenue)
- Product management with search and filters
- Customer management with order history
- Order management with status updates
- Shipment tracking and management

### Order Management
- Order creation from cart
- Order status updates (pending, confirmed, processing, shipped, delivered, cancelled)
- Automatic product quantity updates
- Shipment creation and tracking

## 🧪 Testing

### Frontend
```bash
cd client
npm run lint
```

### Backend
```bash
cd server
npm run build
```

## 📝 Scripts

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- React Email for email templates
- Nodemailer for email delivery service
- Shadcn UI for UI components
- Tailwind CSS for styling

## 📞 Support

For support, email support@farmers.com or create an issue in the repository.

---

**Note**: This is a development project. Ensure all environment variables are properly configured before running in production.

