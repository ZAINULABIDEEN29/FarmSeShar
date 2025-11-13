export type PaymentMethod = "card" | "cash";

export interface CardPaymentDetails {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string; // MM/YY format
  cvv: string;
}

export interface PaymentData {
  paymentMethod: PaymentMethod;
  cardDetails?: CardPaymentDetails;
}

export interface OrderData {
  address: {
    streetAddress: string;
    houseNo: string;
    town: string;
    city: string;
    country: string;
    postalCode: string;
  };
  payment: PaymentData;
}

