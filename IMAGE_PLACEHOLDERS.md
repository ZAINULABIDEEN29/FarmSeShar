# Image Placeholders in Frontend Code

This document lists all image placeholders found in the frontend code that need to be replaced with actual images.

## 1. Hero Section - Main Landing Image
**File:** `client/src/components/sections/HeroSection.tsx`
**Line:** 98
**Current:** Text placeholder "Image Placeholder"
**Location:** Right side of hero section (desktop only)
**Code:**
```tsx
<div className="w-full max-w-md h-96 md:h-[500px] bg-white rounded-2xl shadow-lg flex items-center justify-center">
  <span className="text-gray-400 text-lg">Image Placeholder</span>
</div>
```
**Action:** Replace with an actual hero image (e.g., fresh produce, farmers, farm scene)

---

## 2. Featured Products Section - Product Images
**File:** `client/src/components/sections/FeaturedProductsSection.tsx`
**Line:** 123-124
**Current:** Text placeholder "Product Image"
**Location:** Featured products cards
**Code:**
```tsx
<div className="w-full h-48 bg-gray-200 flex items-center justify-center relative">
  <span className="text-gray-400 text-sm">Product Image</span>
</div>
```
**Action:** Replace with actual product images. The `Product` interface has an optional `image?: string` property that should be populated.

---

## 3. Dicebear Avatar URLs (Farmer Profile Images)
**File:** `client/src/hooks/useProducts.ts`
**Lines:** 126, 141
**Current:** Generated avatar URLs using Dicebear API
**Code:**
```tsx
// Line 126
? `https://api.dicebear.com/7.x/avataaars/svg?seed=${product.farmer.fullName.firstName}${product.farmer.fullName.lastName}`

// Line 141
? `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`
```
**Action:** Replace with actual farmer profile images or keep Dicebear if you want generated avatars. If replacing, update the `farmerImage` property to use real image URLs.

---

## 4. Product Form - Image URL Placeholder
**File:** `client/src/components/products/ProductForm.tsx`
**Line:** 186
**Current:** Placeholder text in input field
**Code:**
```tsx
placeholder="https://example.com/image.jpg"
```
**Action:** This is just a placeholder text in a form field - no action needed unless you want to change the example URL.

---

## 5. "No Image" Fallbacks
These appear when products don't have images. Consider replacing with a default product image instead of text.

### 5.1 Product Image Gallery
**File:** `client/src/components/products/ProductImageGallery.tsx`
**Lines:** 17, 35
**Code:**
```tsx
<span className="text-gray-400 text-sm">No Image</span>
```

### 5.2 Product Grid Card
**File:** `client/src/components/products/ProductGridCard.tsx`
**Line:** 63
**Code:**
```tsx
<span className="text-gray-400 text-sm">No Image</span>
```

### 5.3 Product Card (Dashboard)
**File:** `client/src/components/products/ProductCard.tsx`
**Line:** 33
**Code:**
```tsx
<span className="text-gray-400 text-sm">No Image</span>
```

### 5.4 Cart Item
**File:** `client/src/components/cart/CartItem.tsx`
**Line:** 46
**Code:**
```tsx
<span className="text-gray-400 text-xs">No Image</span>
```

### 5.5 Cart Summary
**File:** `client/src/components/checkout/CartSummary.tsx`
**Line:** 54
**Code:**
```tsx
<span className="text-gray-400 text-xs">No Image</span>
```

**Action for all "No Image" fallbacks:** Replace with a default placeholder image:
```tsx
<img 
  src="/images/default-product.png" 
  alt="No image available" 
  className="w-full h-full object-cover"
/>
```

---

## Summary of Actions Needed

1. **Hero Section Image** - Add a hero image (recommended: 800x500px, farm/fresh produce theme)
2. **Featured Products Images** - Add images to the `defaultProducts` array in `FeaturedProductsSection.tsx`
3. **Farmer Avatars** - Decide whether to keep Dicebear or replace with real farmer profile images
4. **Default Product Image** - Create a default product image and replace all "No Image" text placeholders
5. **Product Images** - Ensure all products in the database have image URLs

---

## Recommended Image Specifications

- **Hero Image:** 800x500px, JPG/WebP, optimized for web
- **Product Images:** 400x400px, square format, JPG/WebP
- **Farmer Avatars:** 200x200px, square format, JPG/PNG
- **Default Product Image:** 400x400px, square format, transparent background preferred

---

## Quick Fix Locations

To quickly find and replace all image placeholders, search for:
- `"Image Placeholder"`
- `"Product Image"`
- `"No Image"`
- `dicebear.com`
- `example.com/image.jpg`

