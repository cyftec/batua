import { derive, effect, op, signal, trap } from "@cyftech/signal";
import { m } from "@mufw/maya";
import { tagsStore, txnsStore } from "../../@libs/common/localstorage/stores";
import {
  ID,
  TagUI,
  Txn,
  TXN_NECESSITIES,
} from "../../@libs/common/models/core";
import { getQueryParamValue, nameRegex } from "../../@libs/common/utils";
import { HTMLPage, NavScaffold, Tag } from "../../@libs/components";
import {
  DialogActionButtons,
  Icon,
  Label,
  NumberBox,
  Section,
  Select,
  Tabs,
  TextBox,
} from "../../@libs/elements";

const nowTime = new Date().getTime();
const error = signal("");
const txnType = signal<Txn["type"]>("expense");
const txnDate = signal<Txn["date"]>(nowTime);
const txnCreated = signal<Txn["created"]>(nowTime);
const txnModified = signal<Txn["modified"]>(nowTime);
const txnNecessity = signal<Txn["necessity"]>("Essential");
const txns = signal<Txn["payments"]>([]);
const txnTitle = signal<string>("");

const allTags = signal<TagUI[]>([]);
const selectedTags = signal<TagUI[]>([]);
const nonSelectedTags = derive(() => {
  const selectedTagNames = selectedTags.value.map((tg) => tg.name);
  return allTags.value
    .filter((tg) => !selectedTagNames.includes(tg.name))
    .sort((a, b) => (b.name as any) - (a.name as any));
});

const txnIdFromQuery = signal("");
const editableTxn = derive(() => {
  if (!txnIdFromQuery.value) return;
  const txnID: ID = +txnIdFromQuery.value;
  const txn = txnsStore.get(txnID);
  if (!txn) throw `Error fetching transaction for id - ${txnID}`;
  return txn;
});
const headerLabel = derive(() =>
  editableTxn.value
    ? `Edit '${editableTxn.value.title.text}'`
    : `Add new transaction`
);
const commitBtnLabel = op(editableTxn).ternary("Save", "Add");

effect(() => {
  if (!editableTxn.value) return;
  txnType.value = editableTxn.value.type.key;
  txnDate.value = editableTxn.value.date.getTime();
  txnCreated.value = editableTxn.value.created.getTime();
  txnModified.value = editableTxn.value.modified.getTime();
  txnNecessity.value = editableTxn.value.necessity;
  txns.value = editableTxn.value.payments.map((p) => p.id);
  selectedTags.value = editableTxn.value.tags;
  txnTitle.value = editableTxn.value.title.text;
});

const onTagTap = (tagID: ID, selectTag: boolean) => {
  const updatedSelectedTags = [...selectedTags.value];
  if (selectTag) {
    const selectedTag = allTags.value.find((tg) => tg.id === tagID) as TagUI;
    updatedSelectedTags.push(selectedTag);
  } else {
    const i = updatedSelectedTags.findIndex((tg) => tg.id === tagID);
    if (i < 0) throw `Tag not found in selected methods list for id - ${tagID}`;
    updatedSelectedTags.splice(i, 1);
  }
  selectedTags.value = updatedSelectedTags;
};

const validateForm = () => {
  if (!txnTitle.value) {
    error.value = "Name is empty.";
    return;
  }
  if (!nameRegex.test(txnTitle.value)) {
    error.value = "Invalid method name.";
    return;
  }
  error.value = "";
};

const discardAndGoBack = () => {
  history.back();
};

const saveTxn = () => {
  validateForm();
  if (error.value) return;
  // const uniqueIdObj = txnUniqueID.value ? { uniqueId: txnUniqueID.value } : {};

  // if (editableTxn.value) {
  //   txnsStore.update({
  //     ...editableTxn.value,
  //     name: txnTitle.value,
  //     mode: txnMode.value,
  //     ...uniqueIdObj,
  //   });
  // } else {
  //   txnsStore.add({
  //     isPermanent: 0,
  //     name: txnTitle.value,
  //     mode: txnMode.value,
  //     ...uniqueIdObj,
  //   });
  // }
  history.back();
};

const onPageMount = () => {
  const id = getQueryParamValue("id");
  if (id) txnIdFromQuery.value = id;
  allTags.value = tagsStore.getAll();
};

export default HTMLPage({
  onMount: onPageMount,
  body: NavScaffold({
    header: headerLabel,
    content: m.Div({
      children: [
        Section({
          title: "Transaction's basic details",
          children: [
            Label({ text: "Necessity of transaction" }),
            m.Div({
              class: "w-100 flex items-center justify-between",
              children: m.For({
                subject: TXN_NECESSITIES,
                map: (ness) => m.Div(ness),
              }),
            }),
            Label({ text: "Time of transaction" }),
            m.Div({
              class: "w-100 flex items-center justify-between",
              children: "Today 5:15 PM",
            }),
            Label({ text: "Title of transaction" }),
            TextBox({
              cssClasses: `fw5 ba b--light-silver bw1 br4 pa3 outline-0 w-100`,
              text: txnTitle,
              placeholder: "Title",
              onchange: (text) => (txnTitle.value = text.trim()),
            }),
          ],
        }),
        Section({
          title: "Payment details",
          children: [
            m.Div({
              children: [
                Select({
                  cssClasses: "f6 br3 pa2",
                  anchor: "left",
                  options: ["ICICI Savings", "Arindam Babu", "World"],
                  selectedOptionIndex: 0,
                  onChange: (option) =>
                    console.log("Function not implemented."),
                }),
                Select({
                  cssClasses: "br3 di pa2",
                  options: ["from", "to"],
                  selectedOptionIndex: 0,
                  onChange: (option) =>
                    console.log("Function not implemented."),
                }),
                NumberBox({
                  cssClasses: "w2",
                  num: 20,
                  onchange: (value) => console.log("Function not implemented."),
                }),
                m.Span("via"),
                Select({
                  cssClasses: "f6 br3 pa2",
                  anchor: "left",
                  options: ["GPay", "ICICI Debitcard"],
                  selectedOptionIndex: 0,
                  onChange: (option) =>
                    console.log("Function not implemented."),
                }),
              ],
            }),
            m.Div({
              children: "100 From Arindam Babu",
            }),
            m.Div({
              children: "120 to World Account",
            }),
          ],
        }),
        Section({
          title: "Associated tags",
          children: [
            m.Div({
              class: "flex flex-wrap",
              children: m.For({
                subject: selectedTags,
                map: (tg) =>
                  Tag({
                    onClick: () => onTagTap(tg.id, false),
                    cssClasses: "mr2 mt2",
                    size: "medium",
                    state: "selected",
                    label: tg.name,
                  }),
              }),
            }),
            m.If({
              subject: trap(nonSelectedTags).length,
              isTruthy: () =>
                m.Div({
                  class: "mt2 pt2 f7 silver",
                  children: "TAP TO SELECT METHODS FROM BELOW",
                }),
            }),
            m.Div({
              class: "flex flex-wrap",
              children: m.For({
                subject: nonSelectedTags,
                map: (tg) =>
                  Tag({
                    onClick: () => onTagTap(tg.id, true),
                    cssClasses: "mr2 mt2",
                    size: "medium",
                    state: "unselected",
                    label: tg.name,
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
      onDiscard: discardAndGoBack,
      onCommit: saveTxn,
    }),
  }),
});
