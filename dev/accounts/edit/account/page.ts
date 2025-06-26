import { m } from "@mufw/maya";
import { ACCOUNT_TYPES, MONEY_TYPES } from "../../../@libs/common/models/core";
import { HTMLPage, NavScaffold, Tag } from "../../../@libs/components";
import {
  DialogActionButtons,
  DropDown,
  Icon,
  Label,
  Section,
  TextBox,
} from "../../../@libs/elements";

export default HTMLPage({
  body: NavScaffold({
    header: "Add new account",
    content: m.Div({
      children: [
        Section({
          title: "Account details",
          children: [
            Label({ text: "Name of account" }),
            TextBox({
              cssClasses: `fw5 ba b--light-silver bw1 br4 pa3 outline-0 w-100`,
              text: "",
              placeholder: "Account name",
            }),
            Label({ text: "Type of account" }),
            DropDown({
              cssClasses: "f6 pa2 br3",
              withBorder: true,
              options: ACCOUNT_TYPES.filter((a) => a !== "market").map(
                (acc, i) => ({
                  id: acc,
                  label: `${acc.charAt(0).toUpperCase()}${acc.slice(1)}${
                    acc === "friend" ? " as an account" : " Account"
                  }`,
                  isSelected: i === 0,
                })
              ),
              onchange: function (optionId: string): void {
                throw new Error("Function not implemented.");
              },
            }),
            Label({ text: "Account vault type" }),
            DropDown({
              cssClasses: "f6 pa2 br3",
              withBorder: true,
              options: MONEY_TYPES.map((m, i) => ({
                id: m,
                label: `${m.charAt(0).toUpperCase()}${m.slice(1)}${
                  m === "physical" ? " Cash" : m === "digital" ? " Record" : ""
                }`,
                isSelected: i === 0,
              })),
              onchange: function (optionId: string): void {
                throw new Error("Function not implemented.");
              },
            }),
          ],
        }),
        Section({
          cssClasses: "pt2",
          contentCssClasses:
            "flex items-center ba b--light-silver bw1 br4 pa1 w-100",
          title: "Account balance",
          children: [
            DropDown({
              cssClasses: "f6 pa2 br3",
              options: ["Exactly", "Approx"].map((acc, i) => ({
                id: acc,
                label: acc,
                isSelected: i === 0,
              })),
              onchange: function (optionId: string): void {
                throw new Error("Function not implemented.");
              },
            }),
            TextBox({
              cssClasses: "bn pa2 mr1 outline-0",
              text: "",
              placeholder: "Account name",
            }),
          ],
        }),
        Section({
          cssClasses: "pt2",
          contentCssClasses: `ba b--light-silver bw1 br4 ph2 pb2 w-100`,
          title: "Connected payment methods",
          children: [
            m.Div({
              class: "flex flex-wrap",
              children: m.For({
                subject: ["ICICI Debit Card", "Net Banking", "Amazon Pay"],
                map: (item) =>
                  Tag({
                    cssClasses: "mr2 mt2",
                    size: "large",
                    state: "selected",
                    label: item,
                  }),
              }),
            }),
            m.Div({
              class: "mt3 pt2 f7 silver",
              children: "TAP TO SELECT METHODS FROM BELOW",
            }),
            m.Div({
              class: "flex flex-wrap",
              children: m.For({
                subject: ["PhonePe", "Google pay", "Bhim UPI", "Amazon Pay"],
                map: (item) =>
                  Tag({
                    cssClasses: "mr2 mt2",
                    size: "large",
                    state: "unselected",
                    label: item,
                  }),
              }),
            }),
          ],
        }),
      ],
    }),
    hideNavbar: true,
    navbarTop: DialogActionButtons({
      cssClasses: "sticky bottom-0 bg-near-white pv2 ph3 nl3 nr3",
      discardLabel: [
        Icon({ cssClasses: "nl2 mr2", iconName: "arrow_back" }),
        "Cancel",
      ],
      commitLabel: [Icon({ cssClasses: "nl3 mr2", iconName: "add" }), "Save"],
      onDiscard: () => history.back(),
      onCommit: () => history.back(),
    }),
  }),
});
