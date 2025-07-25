import { component, m } from "@mufw/maya";
import { PeopleOrShopAccountUI } from "../../@libs/common/models/core";
import { URL, goToPage, handleTap } from "../../@libs/common/utils";
import { CardButton, Section } from "../../@libs/elements";

type PeopleOrShopAccountsProps = {
  peopleOrShopAccounts: PeopleOrShopAccountUI[];
};

export const PeopleOrShopAccounts = component<PeopleOrShopAccountsProps>(
  ({ peopleOrShopAccounts }) => {
    return Section({
      title: "Peoples as unsettled accounts",
      children: m.Div(
        m.For({
          subject: peopleOrShopAccounts,
          n: Infinity,
          nthChild: CardButton({
            onTap: () => goToPage(URL.EDIT.ACCOUNT, { type: "People" }),
            icon: "person_add",
            label: "Add person",
          }),
          map: (acc) =>
            m.Div({
              class: "mb3",
              children: acc.name,
              onclick: handleTap(() =>
                goToPage(URL.EDIT.ACCOUNT, { id: acc.id, type: "People" })
              ),
            }),
        })
      ),
    });
  }
);
