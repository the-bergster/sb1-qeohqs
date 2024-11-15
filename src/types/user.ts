export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  subscription?: {
    id: string;
    status: string;
    priceId: string;
    currentPeriodEnd: Date;
  };
}