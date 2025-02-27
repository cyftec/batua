import { dpromise } from "@cyftech/signal";
import { db } from "../storage/localdb/setup";
import type { Payment } from "../../@libs/common";

const [getAllPayments, payments] = dpromise(() => db.payments.getAll());

const [addPayment] = dpromise((payment: Payment) => db.payments.add(payment));

const [updatePayment] = dpromise((payment: Payment) =>
  db.payments.put(payment)
);

const [deletePayment] = dpromise((paymentId: Payment["id"]) =>
  db.payments.delete(paymentId)
);

export { payments, getAllPayments, addPayment, updatePayment, deletePayment };
