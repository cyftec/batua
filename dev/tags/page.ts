import { m } from "@mufw/maya";
import { Page } from "../@libs/components";
import { TagsSection } from "./@components/tags-section";
import { TAG_CATEGORIES } from "../@libs/storage/localdb/setup/initial-data/tags-and-categories";

export default Page({
  htmlTitle: "Batua | Tags & Categories",
  headerTitle: "Categorise your transactions using tags",
  selectedTabIndex: 3,
  mainContent: [
    TagsSection({
      title: "System generated fixed tags".toUpperCase(),
      categories: TAG_CATEGORIES.filter((tc) =>
        [
          "Necessity of transaction",
          "Payemnt Source",
          "Payemnt Method",
        ].includes(tc.name)
      ),
    }),
    TagsSection({
      title: "Editable tags".toUpperCase(),
      categories: TAG_CATEGORIES.filter(
        (tc) =>
          ![
            "Necessity of transaction",
            "Payemnt Source",
            "Payemnt Method",
          ].includes(tc.name)
      ),
    }),
  ],
  sideContent: "",
});
