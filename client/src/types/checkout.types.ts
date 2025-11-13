export interface CheckoutAddress {
  streetAddress: string;
  houseNo: string;
  town: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface CheckoutFormData {
  address: CheckoutAddress;
}

