export interface CheckoutAddress {
  streetAddress: string;
  houseNo: string;
  town: string;
  city: string;
  country: string;
  postalCode: string;
}

// Alias for backend compatibility
export type ShippingAddress = CheckoutAddress;

export interface CheckoutFormData {
  address: CheckoutAddress;
}

