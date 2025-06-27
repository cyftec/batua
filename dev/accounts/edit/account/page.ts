import { m } from "@mufw/maya";
import {
  CURRENCY_TYPES,
  CurrencyType,
  ID,
  PaymentMethodUI,
  SELF_ACCOUNT_TYPES,
  SelfAccountType,
} from "../../../@libs/common/models/core";
import { HTMLPage, NavScaffold, Tag } from "../../../@libs/components";
import {
  DialogActionButtons,
  DropDown,
  Icon,
  Label,
  Section,
  TextBox,
} from "../../../@libs/elements";
import {
  derive,
  effect,
  op,
  signal,
  SourceSignal,
  trap,
} from "@cyftech/signal";
import {
  accountsStore,
  paymentMethodsStore,
} from "../../../@libs/common/localstorage/stores";
import {
  capitalize,
  getQueryParamValue,
  nameRegex,
} from "../../../@libs/common/utils";

const accIdFromQuery = signal("");
const editableAccount = derive(() => {
  if (!accIdFromQuery.value) return;
  const accID: ID = +accIdFromQuery.value;
  const acc = accountsStore.get(accID);
  if (!acc) throw `Error fetching account for id - ${accID}`;
  return acc;
});
const headerLabel = derive(() =>
  editableAccount.value
    ? `Edit '${editableAccount.value.name}'`
    : `Add my new account`
);

const error = signal("");
const accountName = signal("");
const vaultType = signal<CurrencyType | undefined>("digital");
const selfAccountType = signal<SelfAccountType>("positive");
const allPaymentMethods = signal<PaymentMethodUI[]>([]);
const selectedPaymentMethods = signal<PaymentMethodUI[]>([]);
const nonSelectedPaymentMethods = derive(() => {
  const selectedMethodNames = selectedPaymentMethods.value.map((pm) => pm.name);
  return allPaymentMethods.value
    .filter((pm) => !selectedMethodNames.includes(pm.name))
    .sort((a, b) => b.isPermanent - a.isPermanent);
});
const commitBtnLabel = op(editableAccount).ternary("Save", "Add");

effect(() => {
  if (!editableAccount.value) return;
  accountName.value = editableAccount.value.name;
  vaultType.value = editableAccount.value.vault;
  selfAccountType.value = editableAccount.value.type as SelfAccountType;
});

const onTagTap = (pmID: number, selectTag: boolean) => {
  const updatedSelectedMethods = [...selectedPaymentMethods.value];
  if (selectTag) {
    const selectedMethod = allPaymentMethods.value.find(
      (pm) => pm.id === pmID
    ) as PaymentMethodUI;
    updatedSelectedMethods.push(selectedMethod);
  } else {
    const i = updatedSelectedMethods.findIndex((pm) => pm.id === pmID);
    if (i < 0)
      throw `Method not found in selected methods list for id - ${pmID}`;
    updatedSelectedMethods.splice(i, 1);
  }
  selectedPaymentMethods.value = updatedSelectedMethods;
};

const validateForm = () => {
  if (!accountName.value) {
    error.value = "Name is empty.";
    return;
  }
  if (!nameRegex.test(accountName.value)) {
    error.value = "Invalid name for account.";
    return;
  }
  error.value = "";
};

const goBack = () => history.back();

const savePaymentMethod = () => {
  validateForm();
  if (error.value) return;
  const vaultTypeObj = vaultType.value ? { vault: vaultType.value } : {};

  if (editableAccount.value) {
    accountsStore.update({
      ...editableAccount.value,
      name: accountName.value,
      type: selfAccountType.value,
      methods: selectedPaymentMethods.value,
      ...vaultTypeObj,
    });
  } else {
    accountsStore.add({
      isPermanent: 0,
      balance: 0,
      name: accountName.value,
      type: selfAccountType.value,
      methods: selectedPaymentMethods.value.map((pm) => pm.id),
      ...vaultTypeObj,
    });
  }
  goBack();
};

const triggerPageDataRefresh = () => {
  const id = getQueryParamValue("id");
  if (id) accIdFromQuery.value = id;
  allPaymentMethods.value = paymentMethodsStore.getAll();
};

const onPageMount = () => {
  triggerPageDataRefresh();
  window.addEventListener("pageshow", triggerPageDataRefresh);
};

export default HTMLPage({
  onMount: onPageMount,
  body: NavScaffold({
    header: headerLabel,
    content: m.Div({
      children: [
        Section({
          title: "Account details",
          children: [
            Label({ text: "Type of account" }),
            DropDown({
              cssClasses: "f6 pa2 br3",
              withBorder: true,
              options: SELF_ACCOUNT_TYPES,
              selectedOption: selfAccountType,
              optionFormattor: (o) => `${capitalize(o)} Balance Account`,
              onChange: (o) => {
                selfAccountType.value = o as SelfAccountType;
                vaultType.value = o === "negative" ? undefined : "digital";
              },
            }),
            m.If({
              subject: vaultType,
              isTruthy: m.Div([
                Label({ text: "My money vault type" }),
                DropDown({
                  cssClasses: "f6 pa2 br3",
                  withBorder: true,
                  options: CURRENCY_TYPES,
                  selectedOption: vaultType as SourceSignal<CurrencyType>,
                  optionFormattor: (option) => capitalize(option),
                  onChange: (op) => (vaultType.value = op as CurrencyType),
                }),
              ]),
            }),
            Label({ text: "Name of account" }),
            TextBox({
              cssClasses: `fw5 ba b--light-silver bw1 br4 pa3 outline-0 w-100`,
              text: "",
              placeholder: "Account name",
              onchange: (text) => (accountName.value = text.trim()),
            }),
          ],
        }),
        Section({
          title: "Payment methods",
          children: [
            m.Div({
              class: "flex flex-wrap",
              children: m.For({
                subject: selectedPaymentMethods,
                map: (pm) =>
                  Tag({
                    onClick: () => onTagTap(pm.id, false),
                    cssClasses: "mr2 mt2",
                    size: "large",
                    state: "selected",
                    label: pm.name,
                  }),
              }),
            }),
            m.If({
              subject: trap(nonSelectedPaymentMethods).length,
              isTruthy: m.Div({
                class: "mt3 pt2 f7 silver",
                children: "TAP TO SELECT METHODS FROM BELOW",
              }),
            }),
            m.Div({
              class: "flex flex-wrap",
              children: m.For({
                subject: nonSelectedPaymentMethods,
                map: (pm) =>
                  Tag({
                    onClick: () => onTagTap(pm.id, true),
                    cssClasses: "mr2 mt2",
                    size: "large",
                    state: "unselected",
                    label: pm.name,
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
      commitLabel: [
        Icon({ cssClasses: "nl3 mr2", iconName: commitBtnLabel }),
        commitBtnLabel,
      ],
      onDiscard: goBack,
      onCommit: savePaymentMethod,
    }),
  }),
});
