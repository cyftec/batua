import { newUnstructuredRecord, unstructuredValue } from "@cyftec/kvdb";
import { trap } from "@cyftech/signal";
import { component, m } from "@mufw/maya";
import { store } from "../../../../controllers/state";
import { getLowercaseTagName } from "../../../../controllers/utils";
import { TXN_NECESSITIES } from "../../../../models/data-models";
import { Section, TagsList } from "../../../components";
import { Icon } from "../../../elements";
import { TagCategory } from "./TagsCategory";

type TagsPageProps = {};

export const TagsPage = component<TagsPageProps>(({}) => {
  const onTagAdd = (newTag: string): boolean => {
    const newTagName = getLowercaseTagName(newTag);
    const existingTag = store.tags.find(
      (tag) => unstructuredValue(tag) === newTagName
    );
    if (existingTag) return false;
    store.tags.save(newUnstructuredRecord(newTagName));
    return true;
  };

  const onTagsPageMount = () => {
    store.initialize();
  };

  return m.Div({
    onmount: onTagsPageMount,
    children: [
      Section({
        title: "Meta Tags",
        children: [
          TagCategory({
            cssClasses: "mb3",
            icon: "flag",
            title: "BASED ON NECESSITY",
            tags: TXN_NECESSITIES.map((s) => getLowercaseTagName(s)),
          }),
          TagCategory({
            cssClasses: "mb3",
            icon: "account_balance",
            title: "ACCOUNTS AS TAGS",
            tags: trap(store.accounts.list).map((acc) =>
              getLowercaseTagName(acc.name)
            ),
          }),
          TagCategory({
            cssClasses: "mb3",
            icon: "credit_card",
            title: "PAYMENT METHODS AS TAGS",
            tags: trap(store.paymentMethods.list).map((pm) =>
              getLowercaseTagName(pm.name)
            ),
          }),
        ],
      }),
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
            tags: trap(store.tags.list).map(unstructuredValue),
          }),
        ],
      }),
    ],
  });
});
