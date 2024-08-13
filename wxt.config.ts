import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    permissions: ["storage"],
    version: "1.0",
    host_permissions: ["https://api.mikr.us/*"],
    action: {
      default_popup: "popup.html",
    },
    name: "mikr.us addon",
    description: "A Chrome extension to make a POST request with an API key.",
  },
});
