import { signal, trap } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import {
  AccountUI,
  PaymentMethodUI,
  TagUI,
  TXN_NECESSITIES,
} from "../../@libs/common/models/core";
import { getLowercaseTagName } from "../../@libs/common/utils";
import { Section } from "../../@libs/components";
import { PLAIN_EXTENDED_RECORD_VALUE_KEY } from "../../@libs/kvdb";
import { TagCategory } from "./TagsCategory";
import { db } from "../../@libs/common/localstorage/stores";

type TagsPageProps = {
  allTags?: TagUI[];
  allPaymentMethods?: PaymentMethodUI[];
  allAccounts?: AccountUI[];
};

export const TagsPage = component<TagsPageProps>(({}) => {
  const allAccounts = signal<AccountUI[]>([]);
  const allPaymentMethods = signal<PaymentMethodUI[]>([]);
  const allTags = signal<TagUI[]>([]);

  const onTagAdd = (newTag: string): boolean => {
    const existingTag = db.tags.getWhere(
      (tag) => tag[PLAIN_EXTENDED_RECORD_VALUE_KEY] === newTag
    );
    if (existingTag) return false;
    db.tags.add(newTag);
    allTags.value = db.tags.getAll();
    return true;
  };

  const onTagsPageMount = () => {
    allAccounts.value = db.accounts.getAll();
    allPaymentMethods.value = db.paymentMethods.getAll();
    allTags.value = db.tags.getAll();
  };

  return m.Div({
    onmount: onTagsPageMount,
    children: [
      Section({
        title: "Customizable Tags",
        children: [
          TagCategory({
            onTagTap: (tagIndex) => console.log(allTags.value.at(tagIndex)),
            onNewTagAdd: onTagAdd,
            cssClasses: "mb4",
            icon: "category",
            title: "UNCATEGORIZED",
            tags: trap(allTags).map(
              (tg) => tg[PLAIN_EXTENDED_RECORD_VALUE_KEY]
            ),
          }),
        ],
      }),
      Section({
        title: "Meta Tags",
        children: [
          TagCategory({
            cssClasses: "mb4",
            icon: "flag",
            title: "BASED ON NECESSITY",
            tags: TXN_NECESSITIES.map((s) => getLowercaseTagName(s)),
          }),
          TagCategory({
            cssClasses: "mb4",
            icon: "account_balance",
            title: "ACCOUNTS AS TAGS",
            tags: trap(allAccounts).map((acc) => getLowercaseTagName(acc.name)),
          }),
          TagCategory({
            cssClasses: "mb4",
            icon: "credit_card",
            title: "PAYMENT METHODS AS TAGS",
            tags: trap(allPaymentMethods).map((pm) =>
              getLowercaseTagName(pm.name)
            ),
          }),
        ],
      }),
    ],
  });
});
