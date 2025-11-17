# Stripe Payment Integration Setup Guide

This guide will walk you through setting up Stripe payments securely in your Farmers marketplace application.

## 🔒 Security Overview

### Why This Implementation is Secure:

1. **Server-Side Payment Processing**: All payment amounts are calculated on the server, preventing client-side manipulation
2. **Payment Intent Pattern**: Uses Stripe's Payment Intent API which is the recommended secure method
3. **Webhook Verification**: All webhook events are verified using Stripe signatures
4. **Environment Variables**: All sensitive keys are stored in environment variables, never in code
5. **HTTPS Only**: Stripe requires HTTPS in production (automatically enforced)
6. **Amount Validation**: Server validates product availability and calculates totals before payment

## 📋 Prerequisites

1. A Stripe account (free to create at https://stripe.com)
2. Node.js backend running
3. HTTPS enabled (for production)

## 🚀 Step-by-Step Setup

### Step 1: Create a Stripe Account

1. Go to https://stripe.com and sign up
2. Complete your account setup
3. You'll be taken to the Stripe Dashboard

### Step 2: Get Your API Keys

1. In Stripe Dashboard, go to **Developers** → **API keys**
2. You'll see two keys:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)

   ⚠️ **IMPORTANT**: 
   - Use **test keys** (`_test_`) during development
   - Use **live keys** (`_live_`) only in production
   - **NEVER** share your secret key publicly

### Step 3: Set Up Webhook Endpoint

Webhooks allow Stripe to notify your server about payment events.

#### For Development (using Stripe CLI):

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:8000/api/webhooks/stripe
   ```
4. Copy the webhook signing secret (starts with `whsec_`)

#### For Production:

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)

### Step 4: Configure Environment Variables

Add these to your `server/.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

**For Production:**
```env
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
```

### Step 5: Install Stripe Package

The package should already be installed, but if not:

```bash
cd server
npm install stripe
```

### Step 6: Test the Integration

1. Start your server: `npm run dev`
2. Test with Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Use any future expiry date and any CVC

## 🔐 Security Best Practices

### ✅ DO:

1. **Always validate amounts server-side** - Never trust client-provided amounts
2. **Use Payment Intents** - This is Stripe's recommended secure method
3. **Verify webhook signatures** - Always verify Stripe webhook signatures
4. **Use HTTPS in production** - Stripe requires HTTPS for live payments
5. **Store keys in environment variables** - Never commit keys to git
6. **Use test keys during development** - Test thoroughly before going live
7. **Log payment events** - Keep logs for debugging and auditing
8. **Handle errors gracefully** - Show user-friendly error messages

### ❌ DON'T:

1. **Don't expose secret keys** - Never put secret keys in frontend code
2. **Don't trust client-side calculations** - Always calculate amounts on server
3. **Don't skip webhook verification** - Always verify webhook signatures
4. **Don't use live keys in development** - Use test keys for testing
5. **Don't store card details** - Stripe handles this securely
6. **Don't ignore webhook events** - Process all relevant payment events

## 📊 Payment Flow

### Card Payment Flow:

1. **User adds items to cart** → Cart stored in database
2. **User proceeds to checkout** → Frontend calls `/api/payment/create-intent`
3. **Server creates Payment Intent** → Returns `clientSecret` to frontend
4. **Frontend uses Stripe.js** → Collects payment method securely
5. **Stripe processes payment** → Payment handled by Stripe
6. **Webhook confirms payment** → Server creates order
7. **Order created** → Cart cleared, inventory updated

### Cash Payment Flow:

1. **User selects cash payment** → Frontend calls `/api/payment/create-intent`
2. **Server creates order directly** → No Stripe needed
3. **Order status: pending** → Awaiting cash payment on delivery

## 🧪 Testing

### Test Cards (Stripe Test Mode):

| Card Number | Scenario |
|------------|----------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Card declined |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0025 0000 3155` | Requires authentication (3D Secure) |

Use any:
- Future expiry date (e.g., 12/25)
- Any 3-digit CVC
- Any billing ZIP code

### Testing Checklist:

- [ ] Add items to cart
- [ ] Create payment intent (card)
- [ ] Create payment intent (cash)
- [ ] Complete card payment with test card
- [ ] Verify order creation
- [ ] Verify cart cleared
- [ ] Verify inventory updated
- [ ] Test webhook events
- [ ] Test error scenarios

## 🐛 Troubleshooting

### Common Issues:

1. **"Stripe is not configured"**
   - Check that `STRIPE_SECRET_KEY` is set in `.env`
   - Restart server after adding environment variables

2. **Webhook signature verification fails**
   - Ensure webhook secret is correct
   - Check that webhook endpoint uses `express.raw()` middleware
   - Verify webhook URL is correct in Stripe Dashboard

3. **Payment Intent creation fails**
   - Check Stripe API key is valid
   - Verify amount is in smallest currency unit (cents)
   - Ensure minimum amount (Rs. 0.50)

4. **Webhook not receiving events**
   - Check webhook endpoint URL is accessible
   - Verify webhook is enabled in Stripe Dashboard
   - Check server logs for errors

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Payment Intents API](https://stripe.com/docs/payments/payment-intents)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Security Best Practices](https://stripe.com/docs/security/guide)
- [Testing Guide](https://stripe.com/docs/testing)

## 🎓 Understanding the Code

### Key Files:

1. **`server/src/services/stripe.service.ts`**
   - Handles all Stripe API interactions
   - Creates payment intents
   - Verifies payments
   - Processes webhooks

2. **`server/src/controllers/payment.controller.ts`**
   - API endpoints for payment operations
   - Validates requests
   - Calls service layer

3. **`server/src/controllers/stripeWebhook.controller.ts`**
   - Handles Stripe webhook events
   - Verifies webhook signatures
   - Processes payment events

### Security Features:

1. **Amount Calculation**: Always calculated server-side from cart items
2. **Stock Verification**: Checks product availability before payment
3. **Payment Verification**: Verifies payment status before creating order
4. **Webhook Verification**: Verifies Stripe signature on all webhooks
5. **User Verification**: Ensures payment belongs to authenticated user

## 🚨 Production Checklist

Before going live:

- [ ] Switch to live Stripe keys
- [ ] Set up production webhook endpoint
- [ ] Enable HTTPS
- [ ] Test with real payment (small amount)
- [ ] Set up error monitoring
- [ ] Configure email notifications
- [ ] Review security settings
- [ ] Test all payment scenarios
- [ ] Set up backup webhook endpoint
- [ ] Document payment process

## 💡 Tips

1. **Start with test mode** - Test thoroughly before going live
2. **Monitor webhooks** - Use Stripe Dashboard to monitor webhook events
3. **Handle edge cases** - Test scenarios like out-of-stock items
4. **Log everything** - Keep detailed logs for debugging
5. **Update regularly** - Keep Stripe SDK updated

---

**Need Help?** Check Stripe's excellent documentation or their support team.

