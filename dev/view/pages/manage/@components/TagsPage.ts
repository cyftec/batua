import { signal, trap } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { db } from "../../../../state/localstorage/stores";
import {
  Account,
  PaymentMethod,
  Tag,
  TXN_NECESSITIES,
} from "../../../../models/core";
import { getLowercaseTagName } from "../../../../state/utils";
import { Section, TagsList } from "../../../components";
import { Icon } from "../../../elements";
import { primitiveValue } from "../../../../_kvdb";
import { TagCategory } from "./TagsCategory";

type TagsPageProps = {};

export const TagsPage = component<TagsPageProps>(({}) => {
  const allAccounts = signal<Account[]>([]);
  const allPaymentMethods = signal<PaymentMethod[]>([]);
  const allTags = signal<Tag[]>([]);

  const onTagAdd = (newTag: string): boolean => {
    const newTagName = getLowercaseTagName(newTag);
    const existingTag = db.tags.find(
      (tag) => primitiveValue(tag) === newTagName
    );
    if (existingTag) return false;
    db.tags.push(newTagName);
    allTags.value = db.tags.get();
    return true;
  };

  const onTagsPageMount = () => {
    allAccounts.value = db.accounts.get();
    allPaymentMethods.value = db.paymentMethods.get();
    allTags.value = db.tags
      .get()
      .sort((a, b) => primitiveValue(a).localeCompare(primitiveValue(b)));
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
            tags: trap(allTags).map(primitiveValue),
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
