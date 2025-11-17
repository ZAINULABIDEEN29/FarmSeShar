# Codebase Index - Farmers Marketplace

## Project Overview
A full-stack Farmers Marketplace application built with React (TypeScript) frontend and Node.js/Express backend, using MongoDB for data storage. The application supports dual authentication (users and farmers), product management, and marketplace functionality.

## Technology Stack

### Frontend (Client)
- **Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.7
- **Routing**: React Router DOM 7.9.5
- **State Management**: Redux Toolkit 2.10.1, React Query 5.90.7
- **UI Library**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS 4.1.17
- **Forms**: Formik 2.4.8, Yup 1.7.1
- **HTTP Client**: Axios 1.13.2
- **Notifications**: React Toastify 11.0.5
- **Icons**: Lucide React 0.553.0

### Backend (Server)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express 5.1.0
- **Database**: MongoDB 7.0 (via Mongoose 8.19.3)
- **Authentication**: JWT (jsonwebtoken 9.0.2), bcryptjs 3.0.3
- **Validation**: Zod 4.1.12
- **Email**: Resend 6.4.2, React Email
- **Security**: Helmet 8.1.0, CORS 2.8.5, Cookie Parser 1.4.7
- **Rate Limiting**: express-rate-limit 8.2.1
- **Logging**: Morgan 1.10.1

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: MongoDB containerized

---

## Project Structure

```
Farmers/
├── client/                 # Frontend React application
│   ├── dist/              # Production build output
│   ├── node_modules/      # Frontend dependencies
│   ├── public/            # Static assets
│   │   └── vite.svg
│   ├── src/               # Source code
│   │   ├── assets/        # Images, fonts, etc.
│   │   ├── components/    # React components
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── container/ # Layout containers
│   │   │   ├── footer/    # Footer components
│   │   │   ├── header/    # Header/Navigation components
│   │   │   ├── about/     # About page components
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── cart/      # Shopping cart components
│   │   │   ├── category/  # Category page components
│   │   │   ├── checkout/  # Checkout components
│   │   │   ├── common/    # Common/shared components
│   │   │   ├── contact/   # Contact page components
│   │   │   ├── container/ # Layout containers
│   │   │   ├── dashboard/ # Farmer dashboard components
│   │   │   ├── footer/    # Footer components
│   │   │   ├── header/    # Header/Navigation components
│   │   │   ├── payment/   # Payment components
│   │   │   ├── products/  # Product-related components
│   │   │   ├── sections/  # Page sections
│   │   │   └── ui/        # Reusable UI components (shadcn)
│   │   ├── conf/          # Configuration files
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── store/         # Redux store configuration
│   │   │   └── slices/    # Redux slices
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   ├── components.json    # shadcn/ui configuration
│   ├── eslint.config.js   # ESLint configuration
│   ├── index.html        # HTML entry point
│   ├── package.json      # Frontend dependencies
│   ├── README.md         # Frontend documentation
│   ├── tsconfig.json     # TypeScript configuration
│   ├── tsconfig.app.json # App-specific TS config
│   ├── tsconfig.node.json# Node-specific TS config
│   └── vite.config.ts    # Vite configuration
│
├── server/                # Backend Node.js application
│   ├── node_modules/      # Backend dependencies
│   ├── src/               # Source code
│   │   ├── constants.ts   # Application constants
│   │   ├── controllers/   # Request handlers
│   │   │   ├── authFarmer.controller.ts
│   │   │   ├── authUser.controller.ts
│   │   │   ├── cart.controller.ts
│   │   │   ├── dashboard.controller.ts
│   │   │   ├── order.controller.ts
│   │   │   ├── payment.controller.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── publicProduct.controller.ts
│   │   │   └── stripeWebhook.controller.ts
│   │   ├── db/            # Database configuration
│   │   │   └── db.ts      # MongoDB connection
│   │   ├── emails/        # Email templates (React Email)
│   │   │   ├── resetPasswordEmail.tsx
│   │   │   └── verificationEmail.tsx
│   │   ├── helpers/       # Helper functions
│   │   │   ├── sendResetPasswordEmail.tsx
│   │   │   └── sendVerificationEmail.tsx
│   │   ├── middlewares/   # Express middlewares
│   │   │   ├── asyncHandler.middleware.ts
│   │   │   ├── auth.middleware.ts
│   │   │   ├── errorHandler.middleware.ts
│   │   │   └── validate.middleware.ts
│   │   ├── models/        # Mongoose models
│   │   │   ├── blackListToken.model.ts
│   │   │   ├── cart.model.ts
│   │   │   ├── farmer.model.ts
│   │   │   ├── order.model.ts
│   │   │   ├── product.model.ts
│   │   │   ├── shipment.model.ts
│   │   │   └── user.model.ts
│   │   ├── routes/        # API route definitions
│   │   │   ├── cart.routes.ts
│   │   │   ├── farmer.routes.ts
│   │   │   ├── payment.routes.ts
│   │   │   ├── publicProduct.routes.ts
│   │   │   └── user.routes.ts
│   │   ├── services/      # Business logic layer
│   │   │   ├── cart.service.ts
│   │   │   ├── dashboard.service.ts
│   │   │   ├── farmer.service.ts
│   │   │   ├── order.service.ts
│   │   │   ├── product.service.ts
│   │   │   ├── publicProduct.service.ts
│   │   │   ├── shipment.service.ts
│   │   │   ├── stripe.service.ts
│   │   │   └── user.service.ts
│   │   ├── types/         # TypeScript type definitions
│   │   │   └── global.d.ts
│   │   ├── utils/         # Utility functions
│   │   │   ├── ApiError.ts
│   │   │   ├── auth.utils.ts
│   │   │   ├── db.utils.ts
│   │   │   ├── farmers.utils.ts
│   │   │   ├── jwt.ts
│   │   │   └── resend.ts
│   │   ├── validator/     # Zod validation schemas
│   │   │   ├── auth.schema.ts
│   │   │   ├── cart.schema.ts
│   │   │   ├── dashboard.schema.ts
│   │   │   ├── farmerAuth.schema.ts
│   │   │   ├── order.schema.ts
│   │   │   └── product.schema.ts
│   │   └── server.ts      # Express app entry point
│   ├── Dockerfile         # Docker image configuration
│   ├── package.json       # Backend dependencies
│   └── tsconfig.json      # TypeScript configuration
│
└── docker-compose.yml     # Docker Compose configuration
```

---

## Frontend (Client) Structure

### Entry Points
- **main.tsx** - React application entry point, sets up React Query and Redux providers
- **App.tsx** - Main app component with routing configuration
- **index.css** - Global styles and Tailwind CSS imports

### Pages (`client/src/pages/`)

#### User Authentication Pages
- **LandingPage.tsx** - Homepage/landing page
- **LoginPage.tsx** - User login page
- **SignupPage.tsx** - User registration page
- **ForgotPasswordPage.tsx** - Password reset request page
- **SetPasswordPage.tsx** - Set new password page
- **VerifyCodePage.tsx** - Email verification code entry

#### Farmer Authentication Pages
- **FarmerLoginPage.tsx** - Farmer login page
- **FarmerRegistrationPage.tsx** - Farmer registration form
- **FarmerForgotPasswordPage.tsx** - Farmer password reset request
- **FarmerResetPasswordPage.tsx** - Farmer password reset
- **FarmerVerifyCodePage.tsx** - Farmer email verification

#### Farmer Management Pages
- **FarmerDashboard.tsx** - Farmer dashboard with product management
- **FarmDetailsPage.tsx** - Farm information form
- **BankDetailsPage.tsx** - Bank account details form

#### Shopping & Marketplace Pages
- **CartPage.tsx** - Shopping cart page
- **CheckoutPage.tsx** - Checkout and order placement
- **PaymentPage.tsx** - Payment processing page
- **OrderConfirmationPage.tsx** - Order confirmation after successful payment

#### Category Pages
- **VegetablesPage.tsx** - Vegetables category page
- **FruitsPage.tsx** - Fruits category page
- **DairyPage.tsx** - Dairy category page
- **HerbsPage.tsx** - Herbs category page

#### Other Pages
- **AboutPage.tsx** - About us page
- **ContactPage.tsx** - Contact page
- **NotFoundPage.tsx** - 404 error page

### Components (`client/src/components/`)

#### Authentication Components (`auth/`)
- **BackLink.tsx** - Navigation back button
- **Divider.tsx** - Visual divider component with text
- **FormField.tsx** - Reusable form input field with label and error handling
- **ProtectedRoute.tsx** - Route guard for authenticated routes
- **SocialLoginButton.tsx** - Social media login button (Facebook, Google, Apple)
- **StepIndicator.tsx** - Multi-step form indicator/progress
- **TextAreaField.tsx** - Textarea form field component
- **index.ts** - Component exports

#### Container Components (`container/`)
- **Container.tsx** - Main layout container with max-width constraints

#### Footer Components (`footer/`)
- **Footer.tsx** - Main footer component
- **FooterContact.tsx** - Contact information section
- **FooterCopyright.tsx** - Copyright section
- **FooterLinks.tsx** - Footer navigation links
- **FooterLogo.tsx** - Footer logo/branding
- **FooterSocial.tsx** - Social media links
- **index.ts** - Component exports

#### Header Components (`header/`)
- **Header.tsx** - Main header component
- **AccountCart.tsx** - User account and cart icon
- **Logo.tsx** - Site logo/branding
- **NavMenu.tsx** - Navigation menu
- **SearchBar.tsx** - Product search bar
- **TopInfoBar.tsx** - Top information bar
- **index.ts** - Component exports

#### Cart Components (`cart/`)
- **CartItem.tsx** - Individual cart item component
- **OrderSummary.tsx** - Order summary with totals
- **index.ts** - Component exports

#### Checkout Components (`checkout/`)
- **CartSummary.tsx** - Cart summary in checkout
- **CheckoutAddressForm.tsx** - Address form for checkout
- **index.ts** - Component exports

#### Payment Components (`payment/`)
- **PaymentForm.tsx** - Payment form component
- **StripePaymentForm.tsx** - Stripe payment integration
- **index.ts** - Component exports

#### Dashboard Components (`dashboard/`)
- **CustomersSection.tsx** - Customers management section
- **HelpSection.tsx** - Help and support section
- **OrdersSection.tsx** - Orders management section
- **OverviewSection.tsx** - Dashboard overview/statistics
- **ProductsSection.tsx** - Products management section
- **ShipmentsSection.tsx** - Shipments tracking section
- **Sidebar.tsx** - Dashboard navigation sidebar
- **index.ts** - Component exports

#### Product Components (`products/`)
- **Breadcrumbs.tsx** - Breadcrumb navigation
- **FilterSidebar.tsx** - Product filtering sidebar
- **Pagination.tsx** - Pagination component
- **ProductCard.tsx** - Product card display component
- **ProductForm.tsx** - Product creation/editing form
- **ProductGridCard.tsx** - Grid view product card
- **ProductList.tsx** - List of products with filtering
- **index.ts** - Component exports

#### About Components (`about/`)
- **AboutHero.tsx** - About page hero section
- **JoinOurTeam.tsx** - Join our team section
- **OurImpact.tsx** - Impact section
- **OurStory.tsx** - Our story section
- **OurValues.tsx** - Values section
- **index.ts** - Component exports

#### Contact Components (`contact/`)
- **ConnectWithUs.tsx** - Contact form section
- **GetInTouch.tsx** - Contact information section
- **SupportHero.tsx** - Contact page hero
- **index.ts** - Component exports

#### Common Components (`common/`)
- **ErrorBoundary.tsx** - React error boundary
- **Loader.tsx** - Loading spinner component
- **index.ts** - Component exports

#### Section Components (`sections/`)
- **FeaturedProductsSection.tsx** - Featured products display
- **HeroSection.tsx** - Hero/banner section
- **ShopByCategorySection.tsx** - Category browsing section
- **WhyChooseUsSection.tsx** - Value proposition section
- **index.ts** - Component exports

#### UI Components (`ui/`) - shadcn/ui components
- **badge.tsx** - Badge component
- **button.tsx** - Button component with variants
- **card.tsx** - Card container component
- **checkbox.tsx** - Checkbox input component
- **input.tsx** - Input field component

### Services (`client/src/services/`)
- **api.ts** - Axios instance with interceptors for API calls, base URL configuration
- **cart.service.ts** - Shopping cart API calls
- **dashboard.service.ts** - Farmer dashboard API calls
- **farmer.service.ts** - Farmer authentication and management API calls
- **order.service.ts** - Order management API calls
- **payment.service.ts** - Payment processing API calls
- **product.service.ts** - Product CRUD operations API calls
- **user.service.ts** - User authentication and management API calls

### Hooks (`client/src/hooks/`)
- **useAuth.ts** - Custom hooks for authentication:
  - `useRegisterUser` - User registration mutation
  - `useVerifyUserCode` - User email verification
  - `useLoginUser` - User login mutation
  - `useForgotPassword` - Password reset request
  - `useResetPassword` - Password reset
  - `useRegisterFarmer` - Farmer registration mutation
  - `useVerifyFarmerCode` - Farmer email verification
  - `useLoginFarmer` - Farmer login mutation
  - `useForgotPasswordFarmer` - Farmer password reset request
  - `useResetPasswordFarmer` - Farmer password reset
  - `useGetUser` - Get current user query
  - `useGetFarmer` - Get current farmer query
  - `useLogout` - Logout mutation (handles both user and farmer)
- **useCart.ts** - Custom hooks for shopping cart management
- **useCategoryPage.ts** - Custom hooks for category pages
- **useDashboard.ts** - Custom hooks for farmer dashboard
- **useErrorHandler.ts** - Custom hooks for error handling
- **usePayment.ts** - Custom hooks for payment processing
- **useProducts.ts** - Custom hooks for product management:
  - `useGetMyProducts` - Get farmer's products query
  - `useGetProduct` - Get single product query
  - `useCreateProduct` - Create product mutation
  - `useUpdateProduct` - Update product mutation
  - `useDeleteProduct` - Delete product mutation
  - `useToggleProductAvailability` - Toggle product availability mutation

### Store (`client/src/store/`)
- **index.ts** - Redux store configuration with Redux Toolkit
- **hooks.ts** - Typed Redux hooks (useAppDispatch, useAppSelector)
- **slices/authSlice.ts** - Authentication state slice:
  - Manages user and farmer authentication state
  - Actions: `setUser`, `setFarmer`, `logout`, `clearAuth`
  - Persists state to localStorage
- **slices/cartSlice.ts** - Shopping cart state slice:
  - Manages cart items and cart state
  - Actions for adding, removing, updating cart items

### Types (`client/src/types/`)
- **cart.types.ts** - Shopping cart TypeScript types
- **checkout.types.ts** - Checkout process TypeScript types
- **dashboard.types.ts** - Dashboard TypeScript types
- **farmer.types.ts** - Farmer-related TypeScript types:
  - `Farmer`
  - `RegisterFarmerInput`, `LoginFarmerInput`
  - `VerifyFarmerCodeInput`, `ForgotPasswordFarmerInput`, `ResetPasswordFarmerInput`
  - API response types
- **payment.types.ts** - Payment processing TypeScript types
- **product.types.ts** - Product-related TypeScript types:
  - `Product`, `FarmerInfo`
  - `CreateProductInput`, `UpdateProductInput`
  - `ProductFilters`, `ProductResponse`
- **user.types.ts** - User-related TypeScript types:
  - `User`, `FullName`
  - `RegisterUserInput`, `LoginUserInput`
  - `VerifyCodeInput`, `ForgotPasswordInput`, `ResetPasswordInput`
  - API response types

### Utilities (`client/src/utils/`)
- **storage.ts** - LocalStorage utility functions with type safety:
  - `storage.get<T>()` - Get item with type
  - `storage.set()` - Set item
  - `storage.remove()` - Remove item
  - `STORAGE_KEYS` - Constants for storage keys

### Configuration (`client/src/conf/`)
- **conf.ts** - Application configuration (backend URL, API endpoints)

### Libraries (`client/src/lib/`)
- **react-query.ts** - React Query client configuration
- **utils.ts** - Utility functions (cn() for className merging with tailwind-merge)

---

## Backend (Server) Structure

### Entry Point
- **server.ts** - Express application setup:
  - Middleware configuration (CORS, cookie parser, JSON parser, Helmet, Morgan)
  - Route mounting (`/api/users`, `/api/farmers`)
  - Error handling middleware
  - MongoDB connection
  - Server startup

### Routes (`server/src/routes/`)

#### User Routes (`user.routes.ts`) - `/api/users`
- `POST /create` - User registration
- `POST /verify` - Email verification
- `POST /login` - User login
- `POST /forgot-password` - Password reset request
- `POST /reset-password` - Password reset
- `GET /me` - Get current user (protected)
- `GET /logout` - User logout (protected)

#### Farmer Routes (`farmer.routes.ts`) - `/api/farmers`
- `POST /register-farmer` - Farmer registration
- `POST /verify-farmer` - Farmer email verification
- `POST /login-farmer` - Farmer login
- `POST /forgot-password` - Farmer password reset request
- `POST /reset-password` - Farmer password reset
- `GET /farmer` - Get current farmer (protected)
- `GET /logout` - Farmer logout (protected)
- `GET /products` - Get farmer's products (protected)
- `GET /products/:id` - Get product by ID (protected)
- `POST /products` - Create product (protected)
- `PUT /products/:id` - Update product (protected)
- `DELETE /products/:id` - Delete product (protected)
- `PATCH /products/:id/toggle-availability` - Toggle product availability (protected)
- `GET /dashboard/stats` - Get dashboard statistics (protected)
- `GET /dashboard/customers` - Get dashboard customers (protected)
- `GET /dashboard/orders` - Get dashboard orders (protected)
- `GET /dashboard/shipments` - Get dashboard shipments (protected)

### Public Product Routes (`publicProduct.routes.ts`) - `/api/public/products`
- `GET /` - Get public products with filtering
- `GET /:id` - Get single public product by ID

### Cart Routes (`cart.routes.ts`) - `/api/cart`
- `GET /` - Get user's cart (protected)
- `POST /` - Add item to cart (protected)
- `PUT /:itemId` - Update cart item (protected)
- `DELETE /:itemId` - Remove item from cart (protected)
- `DELETE /` - Clear cart (protected)

### Payment Routes (`payment.routes.ts`) - `/api/payment`
- `POST /create-intent` - Create payment intent (protected)
- `POST /confirm` - Confirm payment (protected)
- `POST /webhook` - Stripe webhook endpoint (public)

### Controllers (`server/src/controllers/`)

#### User Authentication Controller (`authUser.controller.ts`)
- `registerUser` - Handle user registration
- `verifyOtp` - Handle email verification
- `loginUser` - Handle user login
- `getUser` - Get current authenticated user
- `logoutUser` - Handle user logout
- `forgotPassword` - Handle password reset request
- `resetPassword` - Handle password reset

#### Farmer Authentication Controller (`authFarmer.controller.ts`)
- `registerFarmer` - Handle farmer registration
- `verifyCodeForFarmer` - Handle farmer email verification
- `loginFarmer` - Handle farmer login
- `getFarmer` - Get current authenticated farmer
- `logoutFarmer` - Handle farmer logout
- `forgotPasswordFarmer` - Handle farmer password reset request
- `resetPasswordFarmer` - Handle farmer password reset

#### Product Controller (`product.controller.ts`)
- `createProduct` - Create new product
- `getProducts` - Get farmer's products with filtering
- `getProductById` - Get single product by ID
- `updateProduct` - Update product details
- `deleteProduct` - Delete product
- `toggleProductAvailability` - Toggle product availability status

#### Public Product Controller (`publicProduct.controller.ts`)
- `getPublicProducts` - Get public products with filtering (for marketplace)
- `getPublicProductById` - Get single public product by ID

#### Cart Controller (`cart.controller.ts`)
- `getCart` - Get user's shopping cart
- `addToCart` - Add item to cart
- `updateCartItem` - Update cart item quantity
- `removeFromCart` - Remove item from cart
- `clearCart` - Clear entire cart

#### Order Controller (`order.controller.ts`)
- `createOrder` - Create new order from cart
- `getOrders` - Get user's orders
- `getOrderById` - Get single order by ID
- `getFarmerOrders` - Get farmer's orders (for dashboard)

#### Payment Controller (`payment.controller.ts`)
- `createPaymentIntent` - Create Stripe payment intent
- `confirmPayment` - Confirm payment completion

#### Stripe Webhook Controller (`stripeWebhook.controller.ts`)
- `handleWebhook` - Handle Stripe webhook events

#### Dashboard Controller (`dashboard.controller.ts`)
- `getDashboardStats` - Get farmer dashboard statistics
- `getDashboardCustomers` - Get farmer's customers
- `getDashboardOrders` - Get farmer's orders with filtering
- `getDashboardShipments` - Get farmer's shipments

### Services (`server/src/services/`)

#### User Service (`user.service.ts`)
- Business logic for user authentication
- User CRUD operations
- Password hashing and verification
- JWT token generation
- Email verification code generation

#### Farmer Service (`farmer.service.ts`)
- Business logic for farmer authentication
- Farmer CRUD operations
- Password hashing and verification
- JWT token generation
- Email verification code generation

#### Product Service (`product.service.ts`)
- Product CRUD operations
- Product filtering and querying
- Product availability management
- Farmer-product association

#### Public Product Service (`publicProduct.service.ts`)
- Public product listing with filters
- Product search functionality
- Category-based filtering
- Price range filtering

#### Cart Service (`cart.service.ts`)
- Shopping cart CRUD operations
- Cart item management
- Cart total calculations

#### Order Service (`order.service.ts`)
- Order creation from cart
- Order status management
- Order history retrieval
- Order-farmer association

#### Payment Service (`stripe.service.ts`)
- Stripe payment intent creation
- Payment confirmation
- Payment status tracking

#### Shipment Service (`shipment.service.ts`)
- Shipment creation and tracking
- Shipment status updates
- Delivery management

#### Dashboard Service (`dashboard.service.ts`)
- Dashboard statistics aggregation
- Revenue calculations
- Order analytics
- Customer analytics
- Shipment tracking

### Models (`server/src/models/`)

#### User Model (`user.model.ts`)
- Mongoose schema for users
- Fields: fullName (firstName, lastName), email, phoneNumber, password, isVerified, etc.

#### Farmer Model (`farmer.model.ts`)
- Mongoose schema for farmers
- Fields: fullName, cnic, email, phoneNumber, farmName, farmLocation, farmDescription, accountHolderName, bankAccountNumber, isVerified, etc.

#### Product Model (`product.model.ts`)
- Mongoose schema for products
- Fields: name, description, price, category, quantity, unit, image, images, farmerId, isAvailable, etc.

#### Cart Model (`cart.model.ts`)
- Mongoose schema for shopping carts
- Fields: userId, items (productId, quantity), totalAmount, etc.

#### Order Model (`order.model.ts`)
- Mongoose schema for orders
- Fields: orderId, customerId, farmerId, items, totalAmount, status, shippingAddress, etc.

#### Shipment Model (`shipment.model.ts`)
- Mongoose schema for shipments
- Fields: shipmentId, orderId, farmerId, status, trackingNumber, carrier, etc.

#### Blacklist Token Model (`blackListToken.model.ts`)
- Mongoose schema for blacklisted JWT tokens
- Used for logout functionality

### Middlewares (`server/src/middlewares/`)

#### Authentication Middleware (`auth.middleware.ts`)
- `authUser` - Verify JWT token for user routes
- `authFarmer` - Verify JWT token for farmer routes
- Attaches user/farmer object to request

#### Async Handler Middleware (`asyncHandler.middleware.ts`)
- Wraps async route handlers
- Catches errors and passes to error handler

#### Error Handler Middleware (`errorHandler.middleware.ts`)
- Global error handling
- Formats error responses
- Handles validation errors, API errors, and unexpected errors

#### Validation Middleware (`validate.middleware.ts`)
- Validates request body/query/params using Zod schemas
- Returns validation errors if invalid

### Validators (`server/src/validator/`)

#### User Auth Schema (`auth.schema.ts`)
- Zod schemas for user authentication:
  - `registerSchema` - User registration validation
  - `loginSchema` - User login validation
  - `verifyCode` - Email verification validation
  - `forgotPasswordSchema` - Password reset request validation
  - `resetPasswordSchema` - Password reset validation

#### Farmer Auth Schema (`farmerAuth.schema.ts`)
- Zod schemas for farmer authentication:
  - `registerFarmerSchema` - Farmer registration validation
  - `loginFarmerSchema` - Farmer login validation
  - `verifyCodeSchema` - Farmer email verification validation
  - `forgotPasswordSchema` - Farmer password reset request validation
  - `resetPasswordSchema` - Farmer password reset validation

#### Product Schema (`product.schema.ts`)
- Zod schemas for product operations:
  - `createProductSchema` - Product creation validation
  - `updateProductSchema` - Product update validation
  - `productQuerySchema` - Product query/filter validation

#### Cart Schema (`cart.schema.ts`)
- Zod schemas for cart operations:
  - Cart item validation
  - Cart update validation

#### Order Schema (`order.schema.ts`)
- Zod schemas for order operations:
  - Order creation validation
  - Order status validation

#### Dashboard Schema (`dashboard.schema.ts`)
- Zod schemas for dashboard queries:
  - Dashboard stats query validation
  - Date range validation

### Utilities (`server/src/utils/`)

#### JWT Utility (`jwt.ts`)
- JWT token generation
- JWT token verification
- Access and refresh token management

#### Auth Utilities (`auth.utils.ts`)
- Authentication helper functions
- Password comparison utilities

#### Database Utilities (`db.utils.ts`)
- Database helper functions
- Query utilities

#### Farmer Utilities (`farmers.utils.ts`)
- Farmer-specific utility functions

#### API Error (`ApiError.ts`)
- Custom error class for API errors
- Extends Error with status code and message

#### Resend Utility (`resend.ts`)
- Resend email service configuration
- Email sending utilities

### Helpers (`server/src/helpers/`)
- **sendVerificationEmail.tsx** - Send email verification email using React Email template
- **sendResetPasswordEmail.tsx** - Send password reset email using React Email template

### Email Templates (`server/src/emails/`)
- **verificationEmail.tsx** - Email verification template (React Email)
- **resetPasswordEmail.tsx** - Password reset email template (React Email)

### Database (`server/src/db/`)
- **db.ts** - MongoDB connection configuration using Mongoose

### Types (`server/src/types/`)
- **global.d.ts** - Global TypeScript type definitions
  - Extends Express Request interface with user/farmer properties

### Constants (`server/src/constants.ts`)
- Application-wide constants (JWT expiration times, etc.)

---

## API Routes Summary

### User Routes (`/api/users`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/create` | User registration | No |
| POST | `/verify` | Email verification | No |
| POST | `/login` | User login | No |
| POST | `/forgot-password` | Password reset request | No |
| POST | `/reset-password` | Password reset | No |
| GET | `/me` | Get current user | Yes (User) |
| GET | `/logout` | User logout | Yes (User) |

### Farmer Routes (`/api/farmers`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register-farmer` | Farmer registration | No |
| POST | `/verify-farmer` | Farmer email verification | No |
| POST | `/login-farmer` | Farmer login | No |
| POST | `/forgot-password` | Farmer password reset request | No |
| POST | `/reset-password` | Farmer password reset | No |
| GET | `/farmer` | Get current farmer | Yes (Farmer) |
| GET | `/logout` | Farmer logout | Yes (Farmer) |
| GET | `/products` | Get farmer's products | Yes (Farmer) |
| GET | `/products/:id` | Get product by ID | Yes (Farmer) |
| POST | `/products` | Create product | Yes (Farmer) |
| PUT | `/products/:id` | Update product | Yes (Farmer) |
| DELETE | `/products/:id` | Delete product | Yes (Farmer) |
| PATCH | `/products/:id/toggle-availability` | Toggle availability | Yes (Farmer) |
| GET | `/dashboard/stats` | Get dashboard statistics | Yes (Farmer) |
| GET | `/dashboard/customers` | Get dashboard customers | Yes (Farmer) |
| GET | `/dashboard/orders` | Get dashboard orders | Yes (Farmer) |
| GET | `/dashboard/shipments` | Get dashboard shipments | Yes (Farmer) |

### Public Product Routes (`/api/public/products`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get public products with filters | No |
| GET | `/:id` | Get single public product | No |

### Cart Routes (`/api/cart`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user's cart | Yes (User) |
| POST | `/` | Add item to cart | Yes (User) |
| PUT | `/:itemId` | Update cart item | Yes (User) |
| DELETE | `/:itemId` | Remove item from cart | Yes (User) |
| DELETE | `/` | Clear cart | Yes (User) |

### Payment Routes (`/api/payment`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/create-intent` | Create payment intent | Yes (User) |
| POST | `/confirm` | Confirm payment | Yes (User) |
| POST | `/webhook` | Stripe webhook | No |

---

## Docker Configuration

### Services
1. **mongodb** - MongoDB database container (port 27017)
2. **server** - Backend API server (port 8000)
3. **client** - Frontend development server (port 5173)

### Network
- All services connected via `farmers-network` bridge network

---

## Development Scripts

### Frontend
- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start development server with hot reload (tsx watch)
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server

---

## Environment Variables

### Frontend
- `VITE_BACKEND_URL` - Backend API URL

### Backend
- `PORT` - Server port (default: 5000, currently 8000)
- `MONGO_URI` - MongoDB connection string
- `CLIENT_URL` - Frontend URL for CORS
- `JWT_ACCESS_SECRET` - JWT access token secret
- `JWT_REFRESH_SECRET` - JWT refresh token secret
- `JWT_ACCESS_EXPIRY` - Access token expiration time
- `JWT_REFRESH_EXPIRY` - Refresh token expiration time
- `RESEND_API_KEY` - Resend API key for email service
- `EMAIL_FROM` - Email sender address

---

## Key Features

1. **Dual Authentication System**
   - User authentication (customers)
   - Farmer authentication (sellers)
   - JWT-based authentication with refresh tokens
   - Email verification for both user types
   - Password reset functionality

2. **User Management**
   - User registration and login
   - Email verification
   - Password reset via email
   - Profile management

3. **Farmer Management**
   - Multi-step farmer registration
   - Farm details collection
   - Bank details collection
   - Email verification
   - Password reset

4. **Product Management**
   - Product CRUD operations (Create, Read, Update, Delete)
   - Product availability toggle
   - Product filtering and search
   - Category-based organization
   - Image support
   - Public product listing for marketplace

5. **Shopping Cart**
   - Add/remove items from cart
   - Update item quantities
   - Cart persistence
   - Cart total calculations

6. **Order Management**
   - Order creation from cart
   - Order status tracking
   - Order history
   - Order-farmer association

7. **Payment Processing**
   - Stripe payment integration
   - Payment intent creation
   - Payment confirmation
   - Webhook handling

8. **Shipment Tracking**
   - Shipment creation
   - Tracking number management
   - Delivery status updates
   - Carrier information

9. **Farmer Dashboard**
   - Dashboard statistics (revenue, orders, products)
   - Customer management
   - Order management
   - Shipment tracking

10. **Email Services**
    - Email verification using React Email templates
    - Password reset emails
    - Professional email templates via Resend

11. **State Management**
    - Redux Toolkit for global state (authentication, cart)
    - React Query for server state (API data)
    - LocalStorage persistence for auth state

---

## Architecture Patterns

- **Frontend**: 
  - Component-based architecture with separation of concerns
  - Custom hooks for reusable logic
  - Service layer for API calls
  - Type-safe state management with Redux Toolkit
  - Server state management with React Query

- **Backend**: 
  - MVC-like pattern (Routes → Controllers → Services → Models)
  - Middleware-based request processing
  - Service layer for business logic
  - Repository pattern via Mongoose models

- **Authentication**: 
  - JWT tokens with cookie-based storage
  - Separate authentication for users and farmers
  - Token blacklisting for logout

- **Validation**: 
  - Zod schemas on backend
  - Yup schemas on frontend
  - Request validation middleware

- **Error Handling**: 
  - Centralized error handling middleware
  - Custom API error class
  - Consistent error response format

- **Email**: 
  - React Email for templated emails
  - Resend for email delivery
  - Type-safe email templates

---

## Data Flow

### Authentication Flow
1. User/Farmer submits registration form
2. Frontend validates with Yup
3. API call via service layer
4. Backend validates with Zod
5. Service creates user/farmer in database
6. Email verification code sent
7. User verifies email
8. Login with credentials
9. JWT tokens generated and stored in cookies
10. Redux store updated with user/farmer data
11. LocalStorage updated for persistence

### Product Management Flow
1. Farmer logs in and navigates to dashboard
2. React Query fetches products
3. Farmer creates/updates/deletes product
4. Mutation hook calls service
5. Service makes API call
6. Backend validates and processes
7. Database updated
8. React Query cache invalidated
9. UI updates automatically

---

## Recent Updates

### Fixed Issues
- **TypeScript Error in `publicProduct.service.ts`**: Fixed type error where `_id` was being assigned as string but expected ObjectId. Updated `PublicProduct` interface to properly handle string IDs for public API responses.

### Codebase Structure
- All services, controllers, models, and routes have been indexed
- Complete frontend component structure documented
- All API endpoints documented with authentication requirements

*Last Updated: Based on current codebase structure - All errors fixed*
