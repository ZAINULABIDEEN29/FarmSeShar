# Common Components

## ErrorBoundary

React Error Boundary component for catching and handling React component errors.

### Usage

```tsx
import ErrorBoundary from "@/components/common/ErrorBoundary";

<ErrorBoundary
  onError={(error, errorInfo) => {
    // Custom error handling
    console.error("Error caught:", error);
  }}
  fallback={<CustomErrorUI />} // Optional custom fallback
>
  <YourComponent />
</ErrorBoundary>
```

### Features

- Catches React component errors
- User-friendly error UI with reset options
- Error details in development mode
- Optional custom fallback UI
- Error callback for logging/monitoring

## Loader Components

Themed loading components matching the application's green color scheme.

### Loader

Basic spinner loader.

```tsx
import Loader from "@/components/common/Loader";

// Basic usage
<Loader />

// With size
<Loader size="sm" /> // or "md" | "lg"

// Full screen
<Loader fullScreen />
```

### PageLoader

Full-page loader for route transitions.

```tsx
import { PageLoader } from "@/components/common/Loader";

<PageLoader message="Loading page..." />
```

### InlineLoader

Inline loader for sections/containers.

```tsx
import { InlineLoader } from "@/components/common/Loader";

<InlineLoader message="Loading data..." />
```

