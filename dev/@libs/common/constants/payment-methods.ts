import { PaymentMethod } from "../models";

export const paymentMethods: PaymentMethod[] = [
  {
    code: "CASH",
    displayName: "Cash",
  },
  {
    code: "BHIM",
    displayName: "BHIM Upi",
    uniqueId: "9852432671@upi",
  },
  {
    code: "GPAY",
    displayName: "Google Pay",
    uniqueId: "9852432671@okaxis",
  },
  {
    code: "PHONEPE",
    displayName: "PhonePe",
    uniqueId: "9852432671@ybl",
  },
  {
    code: "DEBIT",
    displayName: "Debit Card",
    uniqueId: "499912348765",
    expiry: new Date(),
  },
  {
    code: "CREDIT",
    displayName: "Credit Card",
    uniqueId: "500012348765",
    expiry: new Date(),
  },
];
