# Complete Setup Instructions for Cart & Stripe Integration

## 🎯 Overview

This guide will help you set up the complete cart functionality and Stripe payment integration for your Farmers marketplace.

## 📦 What's Been Implemented

### Backend:
1. ✅ Cart Model - Stores user cart items in database
2. ✅ Cart Service - Business logic for cart operations
3. ✅ Cart Controller & Routes - API endpoints for cart management
4. ✅ Stripe Payment Service - Secure payment processing
5. ✅ Payment Controller & Routes - Payment API endpoints
6. ✅ Stripe Webhook Handler - Payment event processing

### Frontend:
1. ✅ Cart Service - API integration for cart operations
2. ✅ Payment Service - Stripe payment integration
3. ✅ Cart Hooks - React Query hooks for cart management
4. ✅ Payment Hooks - React Query hooks for payments
5. ✅ Stripe Payment Form - Secure card payment UI
6. ✅ Updated Payment Page - Integrated with Stripe

## 🚀 Step-by-Step Setup

### Step 1: Install Dependencies

**Backend:**
```bash
cd server
npm install stripe
```

**Frontend:**
```bash
cd client
npm install @stripe/stripe-js @stripe/react-stripe-js
```

✅ **Already done!** The packages are installed.

### Step 2: Set Up Stripe Account

1. **Create Stripe Account**
   - Go to https://stripe.com
   - Sign up for a free account
   - Complete account verification

2. **Get API Keys**
   - Dashboard → Developers → API keys
   - Copy your **Publishable key** (starts with `pk_test_`)
   - Copy your **Secret key** (starts with `sk_test_`)
   - ⚠️ **Keep secret key secure!**

3. **Set Up Webhook** (for production)
   - Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the **Signing secret** (starts with `whsec_`)

### Step 3: Configure Environment Variables

**Backend (`server/.env`):**
```env
# Existing variables...
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Stripe Configuration (OPTIONAL - only needed for card payments)
# Cash payments work without Stripe!
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

**Frontend (`client/.env`):**
```env
# Existing variables...
VITE_BACKEND_URL=http://localhost:5000/api

# Stripe Configuration (OPTIONAL - only needed for card payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### Step 4: Test the Integration

#### Test Cart Functionality:

1. **Start the server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the client:**
   ```bash
   cd client
   npm run dev
   ```

3. **Test Cart Operations:**
   - Login as a user
   - Add products to cart
   - View cart
   - Update quantities
   - Remove items

#### Test Payment (Cash - No Stripe Needed):

1. Add items to cart
2. Go to checkout
3. Enter shipping address
4. Select "Cash on Delivery"
5. Place order
6. ✅ Order should be created successfully

#### Test Payment (Card - Requires Stripe):

1. **Set up Stripe keys** in `.env` files (see Step 3)
2. Add items to cart
3. Go to checkout
4. Enter shipping address
5. Select "Pay with Card"
6. Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits
7. Complete payment
8. ✅ Order should be created after successful payment

## 🔒 Security Features Explained

### Why This Implementation is Secure:

1. **Server-Side Amount Calculation**
   - All prices are calculated on the server
   - Client cannot manipulate payment amounts
   - Product availability is verified before payment

2. **Payment Intent Pattern**
   - Uses Stripe's recommended secure method
   - Payment amount is set server-side
   - Client only receives a `clientSecret` to complete payment

3. **Webhook Verification**
   - All webhook events are verified using Stripe signatures
   - Prevents fake payment notifications
   - Ensures payment actually succeeded

4. **Stock Verification**
   - Products are verified before payment
   - Stock is checked again before order creation
   - Prevents overselling

5. **User Authentication**
   - All cart and payment operations require authentication
   - Users can only access their own cart
   - Payment intents are tied to authenticated users

## 📚 API Endpoints

### Cart Endpoints (All require authentication):

- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
  ```json
  {
    "productId": "product_id_here",
    "quantity": 2
  }
  ```
- `PUT /api/cart/items/:productId` - Update item quantity
  ```json
  {
    "quantity": 3
  }
  ```
- `DELETE /api/cart/items/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Payment Endpoints (All require authentication):

- `POST /api/payment/create-intent` - Create payment intent
  ```json
  {
    "shippingAddress": {
      "streetAddress": "123 Main St",
      "houseNo": "A-1",
      "town": "Downtown",
      "city": "Lahore",
      "country": "Pakistan",
      "postalCode": "54000"
    },
    "paymentMethod": "card" // or "cash"
  }
  ```
- `POST /api/payment/confirm` - Confirm payment and create order
  ```json
  {
    "paymentIntentId": "pi_xxx",
    "shippingAddress": { ... }
  }
  ```

### Webhook Endpoint (No authentication - uses Stripe signature):

- `POST /api/webhooks/stripe` - Stripe webhook handler
  - Automatically called by Stripe
  - Verifies payment events
  - Updates order status

## 🧪 Testing Checklist

### Cart Testing:
- [ ] Add item to cart
- [ ] Add same item again (should increase quantity)
- [ ] Update item quantity
- [ ] Remove item from cart
- [ ] Clear entire cart
- [ ] Verify cart persists after page refresh
- [ ] Test with multiple products

### Payment Testing (Cash):
- [ ] Create order with cash payment
- [ ] Verify order is created
- [ ] Verify cart is cleared
- [ ] Verify product quantities are updated
- [ ] Verify order status is "pending"

### Payment Testing (Card - if Stripe configured):
- [ ] Create payment intent
- [ ] Complete payment with test card
- [ ] Verify order is created
- [ ] Verify cart is cleared
- [ ] Test with declined card (4000 0000 0000 0002)
- [ ] Test webhook events (if webhook is set up)

## 🐛 Troubleshooting

### "Stripe is not configured"
- **Solution**: Stripe keys are optional. Cash payments work without Stripe.
- If you want card payments, add Stripe keys to `.env` files.

### "Cart is empty" error
- **Solution**: Make sure you're logged in and have items in cart.
- Check that cart API is working: `GET /api/cart`

### "Payment intent creation failed"
- **Solution**: 
  - Check Stripe secret key is correct
  - Verify cart has items
  - Check server logs for detailed error

### "Webhook signature verification failed"
- **Solution**:
  - Verify webhook secret is correct
  - Ensure webhook endpoint uses raw body parser
  - Check webhook URL in Stripe Dashboard

### Cart not syncing with backend
- **Solution**:
  - Check user is authenticated
  - Verify API base URL is correct
  - Check browser console for errors
  - Ensure cart hooks are being used

## 📖 How It Works

### Cart Flow:
1. User adds product → Frontend calls `POST /api/cart/add`
2. Backend validates product exists and is available
3. Backend adds to user's cart in database
4. Frontend updates Redux store and UI

### Payment Flow (Card):
1. User proceeds to checkout → Frontend calls `POST /api/payment/create-intent`
2. Backend calculates total from cart items (server-side)
3. Backend creates Stripe Payment Intent
4. Backend returns `clientSecret` to frontend
5. Frontend uses Stripe.js to collect payment method
6. Stripe processes payment securely
7. Frontend calls `POST /api/payment/confirm` with payment intent ID
8. Backend verifies payment and creates order
9. Backend clears cart and updates inventory

### Payment Flow (Cash):
1. User selects cash payment → Frontend calls `POST /api/payment/create-intent`
2. Backend creates order directly (no Stripe needed)
3. Backend clears cart and updates inventory
4. Order status: "pending" (awaiting cash on delivery)

## 🎓 Learning Resources

### Stripe Documentation:
- [Payment Intents](https://stripe.com/docs/payments/payment-intents)
- [Stripe Elements](https://stripe.com/docs/stripe-js/react)
- [Webhooks](https://stripe.com/docs/webhooks)
- [Testing](https://stripe.com/docs/testing)

### Security Best Practices:
- [Stripe Security Guide](https://stripe.com/docs/security/guide)
- [PCI Compliance](https://stripe.com/docs/security/guide#validating-pci-compliance)

## ✅ Next Steps

1. **Test thoroughly** with both cash and card payments
2. **Set up production Stripe account** when ready to go live
3. **Configure webhooks** for production
4. **Add email notifications** for order confirmations
5. **Set up error monitoring** (e.g., Sentry)
6. **Add order tracking** functionality

## 🆘 Need Help?

- Check the `STRIPE_SETUP_GUIDE.md` for detailed Stripe setup
- Review server logs for error details
- Check browser console for frontend errors
- Verify all environment variables are set correctly

---

**Remember**: Cash payments work without Stripe! You can test the entire flow using cash payments first, then add Stripe when ready.

