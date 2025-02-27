import { m } from "@mufw/maya";
import { Button } from "./@libs/elements";
import { Page } from "./@libs/components";

export default Page({
  htmlTitle: "Batua - Money Tracker App",
  headerTitle: "Home Page",
  mainContent: m.Div([
    m.H3("home page stuff"),
    Button({
      label: "Go to transactions",
      onTap: () => (location.href = "/transactions"),
    }),
  ]),
  sideContent: "",
});
