import { INITIAL_DATA } from "./initial-data";
import { db } from "./db";

export const populateDbWithInitialData = async () => {
  try {
    const accounts = await db.accounts.getAll();
    if (!accounts)
      throw new Error("DB didn't return records from accounts store");
    if (!accounts.length) {
      for (let acc of INITIAL_DATA.ACCOUNTS) {
        await db.accounts.add({ ...acc });
      }
    } else console.log(`accounts store store already populated`);

    const budgets = await db.budgets.getAll();
    if (!budgets)
      throw new Error("DB didn't return records from tag-categories store");
    if (!budgets.length) {
      for (let budget of INITIAL_DATA.BUDGETS) {
        await db.budgets.add({ ...budget });
      }
    } else console.log(`budgets store already populated`);

    const paymentMethods = await db.paymentMethods.getAll();
    if (!paymentMethods)
      throw new Error("DB didn't return records from payment-methods store");
    if (!paymentMethods.length) {
      for (let ps of INITIAL_DATA.PAYMENT_METHODS) {
        await db.paymentMethods.add({ ...ps });
      }
    } else console.log(`payment-methods store already populated`);

    const tagCategories = await db.tagCategories.getAll();
    if (!tagCategories)
      throw new Error("DB didn't return records from tag-categories store");
    if (!tagCategories.length) {
      for (let cat of INITIAL_DATA.TAG_CATEGORIES) {
        await db.tagCategories.add(cat);
      }
    } else console.log(`tag-categories store already populated`);

    const newlyAddedCategories = await db.tagCategories.getAll();
    if (!newlyAddedCategories)
      throw new Error(
        "DB didn't return newly created records from tag-categories store"
      );
    const tags = await db.tags.getAll();
    if (!tags) throw new Error("DB didn't return records from tags store");
    if (!tags.length) {
      for (let tag of INITIAL_DATA.TAGS) {
        const category = newlyAddedCategories.find(
          (newCat) => newCat.id === tag.category
        );
        if (!category)
          throw new Error(
            `No category id fround for tag with category - ${tag.name}`
          );
        await db.tags.add(tag);
      }
    } else console.log(`tags store already populated`);

    const transactions = await db.transactions.getAll();
    if (!transactions)
      throw new Error("DB didn't return records from transactions store");
    if (!transactions.length) {
      for (let txn of INITIAL_DATA.TRANSACTIONS) {
        await db.transactions.add({ ...txn });
        for (const pid of txn.payments) {
          const payment = INITIAL_DATA.PAYMENTS.find((p) => p.id === pid);
          if (!payment)
            throw new Error(
              "No payment found for this transaction. Add correct payment for relevant transaction."
            );
          await db.payments.add(payment);
        }
      }
    } else console.log(`transactions store already populated`);
  } catch (error) {
    console.log(error);
  }
};
