import { m, signal } from "@maya/core";
import { Page } from "../@components";
import { Summary, Tile } from "./@components";

export default () =>
  Page({
    title: "Batua - Money Tracker App",
    headerTitle: "Expenses List",
    selectedTabIndex: 0,
    content: m.Div({
      class: "flex items-between justify-between",
      children: [
        m.Div({
          children: m.For({
            items: signal(
              Array(30).fill({
                amount: "183.50",
                title: "Paneer biryani from Swiggy",
                date: new Date(),
                tags: [
                  "eatingout",
                  "swiggy",
                  "luxary",
                  "eatingout",
                  "swiggy",
                  "luxary",
                  "eatingout",
                  "swiggy",
                  "luxary",
                ],
                paymentMethod: "Bhim UPI",
              })
            ),
            map: (expense) =>
              Tile({
                className: "mb4 pb4",
                amount: expense.amount,
                title: expense.title,
                date: expense.date,
                tags: expense.tags,
                paymentMethod: expense.paymentMethod,
              }),
          }),
        }),
        Summary({
          className: "sticky top-3 right-0 bottom-0 bg-washed-yellow",
          title: "October 2024",
          amount: "48,513.56",
        }),
      ],
    }),
  });
