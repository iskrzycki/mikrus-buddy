import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/i18n/module"],
  manifest: {
    permissions: ["storage"],
    version: "0.1.5",
    host_permissions: ["https://api.mikr.us/*"],
    action: {
      default_popup: "popup.html",
    },
    name: "Mikrus buddy",
    description: "Rozszerzenie, które pozwala mieć Twojego mikrusa na oku",
    default_locale: "pl",
  },
});
