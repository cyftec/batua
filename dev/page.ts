import { m } from "@mufw/maya";
import { Button } from "./@libs/elements";
import { HtmlPage } from "./@libs/components";

export default HtmlPage({
  htmlTitle: "Batua - Money Tracker App",
  headerTitle: "Home HtmlPage",
  mainContent: m.Div([
    m.H3("home page stuff"),
    Button({
      label: "Go to transactions",
      onTap: () => (location.href = "/transactions"),
    }),
  ]),
  sideContent: "",
});
