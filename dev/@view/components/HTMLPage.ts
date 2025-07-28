import { signal } from "@cyftech/signal";
import { Child, component, m } from "@mufw/maya";
import { isNewToApp } from "../../@controller/localstorage";
import { AccountCreator } from "./AccountCreator";

type HTMLPageProps = {
  cssClasses?: string;
  body: Child;
  onMount?: () => void;
  onUnMount?: () => void;
};

export const HTMLPage = component<HTMLPageProps>(
  ({ cssClasses, body, onMount, onUnMount }) => {
    const stylesRel = signal<"preload" | "stylesheet">("preload");
    const modalOpen = signal(false);

    const onBodyMount = () => {
      stylesRel.value = "stylesheet";
      if (isNewToApp()) modalOpen.value = true;
      if (onMount) {
        onMount();
        window.addEventListener("pageshow", onMount);
      }
    };

    const closeModal = () => (modalOpen.value = false);

    const onAccountCreationDone = () => {
      closeModal();
      onMount && onMount();
    };

    return m.Html({
      lang: "en",
      children: [
        m.Head({
          children: [
            m.Meta({
              "http-equiv": "Content-Security-Policy",
              content: `
                default-src 'self';
                script-src 'self';
                style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com;
                font-src https://fonts.gstatic.com;
                object-src 'none';
                base-uri 'none';
              `,
            }),
            m.Meta({
              name: "viewport",
              content: "width=device-width, initial-scale=1.0",
            }),
            m.Meta({ charset: "UTF-8" }),
            m.Meta({ "http-equiv": "X-UA-Compatible", content: "IE=edge" }),
            m.Link({
              rel: "icon",
              type: "image/x-icon",
              href: "/assets/images/favicon.ico",
            }),
            m.Title("Batua (by Cyfer)"),
            m.Link({ rel: stylesRel, href: "/assets/styles.css", as: "style" }),
            m.Link({ rel: "manifest", href: "/manifest.json" }),
          ],
        }),
        m.Body({
          tabindex: "-1",
          class: cssClasses,
          onmount: onBodyMount,
          onunmount: onUnMount,
          children: [
            m.Script({ src: "main.js", defer: true }),
            AccountCreator({
              isOpen: modalOpen,
              onClose: closeModal,
              onDone: onAccountCreationDone,
            }),
            body,
          ],
        }),
      ],
    });
  }
);
