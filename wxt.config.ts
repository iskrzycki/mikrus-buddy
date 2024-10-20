import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/i18n/module"],
  manifest: {
    permissions: ["storage"],
    version: "0.1.4",
    host_permissions: ["https://api.mikr.us/*"],
    action: {
      default_popup: "popup.html",
    },
    name: "Mikrus buddy",
    description: "An extension that helps you manage your mikr.us server",
    default_locale: "en",
  },
});
