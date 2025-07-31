import { component, m } from "@mufw/maya";
import { URL, goToPage, handleTap } from "../../../../state/utils";
import { CardButton, Section } from "../../../elements";
import { PeopleAccount, ShopAccount } from "../../../../models/core";

type EntityAccountsProps = {
  allShopAccounts: ShopAccount[];
  allPeopleAccounts: PeopleAccount[];
};

export const EntityAccounts = component<EntityAccountsProps>(
  ({ allShopAccounts, allPeopleAccounts }) => {
    return m.Div([
      Section({
        title: "Shops as accounts",
        children: m.Div(
          m.For({
            subject: allShopAccounts,
            n: Infinity,
            nthChild: CardButton({
              onTap: () => goToPage(URL.EDIT.ACCOUNT, { type: "shop" }),
              icon: "add_business",
              label: "Add new shop",
            }),
            map: (acc) =>
              m.Div({
                class: "mb3",
                children: acc.name,
                onclick: handleTap(() =>
                  goToPage(URL.EDIT.ACCOUNT, { id: acc.id, type: "shop" })
                ),
              }),
          })
        ),
      }),
      Section({
        title: "People as accounts",
        children: m.Div(
          m.For({
            subject: allPeopleAccounts,
            n: Infinity,
            nthChild: CardButton({
              onTap: () => goToPage(URL.EDIT.ACCOUNT, { type: "people" }),
              icon: "person_add",
              label: "Add person",
            }),
            map: (acc) =>
              m.Div({
                class: "mb3",
                children: acc.name,
                onclick: handleTap(() =>
                  goToPage(URL.EDIT.ACCOUNT, { id: acc.id, type: "people" })
                ),
              }),
          })
        ),
      }),
    ]);
  }
);
