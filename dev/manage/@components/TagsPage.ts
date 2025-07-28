import { signal, trap } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { db } from "../../@libs/common/localstorage/stores";
import {
  AccountUI,
  PaymentMethodUI,
  TagUI,
  TXN_NECESSITIES,
} from "../../@libs/common/models/core";
import { getLowercaseTagName } from "../../@libs/common/utils";
import { Section, TagsList } from "../../@view/components";
import { Icon } from "../../@view/elements";
import { getPrimitiveRecordValue } from "../../@libs/kvdb";
import { TagCategory } from "./TagsCategory";

type TagsPageProps = {};

export const TagsPage = component<TagsPageProps>(({}) => {
  const allAccounts = signal<AccountUI[]>([]);
  const allPaymentMethods = signal<PaymentMethodUI[]>([]);
  const allTags = signal<TagUI[]>([]);

  const onTagAdd = (newTag: string): boolean => {
    const newTagName = getLowercaseTagName(newTag);
    const existingTag = db.tags.getWhere(
      (tag) => getPrimitiveRecordValue(tag) === newTagName
    );
    if (existingTag) return false;
    db.tags.add(newTagName);
    allTags.value = db.tags.getAll();
    return true;
  };

  const onTagsPageMount = () => {
    allAccounts.value = db.accounts.getAll();
    allPaymentMethods.value = db.paymentMethods.getAll();
    allTags.value = db.tags
      .getAll()
      .sort((a, b) =>
        getPrimitiveRecordValue(a).localeCompare(getPrimitiveRecordValue(b))
      );
  };

  return m.Div({
    onmount: onTagsPageMount,
    children: [
      Section({
        title: "Customizable Tags",
        children: [
          m.Div({
            class: "flex items-center silver",
            children: [
              Icon({ iconName: "category", size: 14 }),
              m.Div({ class: "f7 ml2", children: "UNCATEGORIZED" }),
            ],
          }),
          TagsList({
            onTagAdd: onTagAdd,
            tagsState: "idle",
            hideSuggestion: true,
            tagClasses: "mt2 mr2",
            tags: trap(allTags).map(getPrimitiveRecordValue),
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
