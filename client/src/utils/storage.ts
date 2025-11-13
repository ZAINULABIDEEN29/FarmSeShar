// Local Storage Utilities
export const storage = {
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },

  get: <T = any>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};

// Storage Keys
// Only non-sensitive data should be stored in localStorage
// Tokens and user/farmer data are stored in Redux (memory) and HTTP-only cookies
export const STORAGE_KEYS = {
  USER_ID: "userId", // Temporary storage for verification flow (non-sensitive)
  FARMER_ID: "farmerId", // Temporary storage for verification flow (non-sensitive)
  RESET_TOKEN: "resetToken", // Temporary storage for password reset (non-sensitive)
} as const;

