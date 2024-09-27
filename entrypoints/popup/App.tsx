import { useEffect } from "react";
import { Paper, Tabs } from "@mantine/core";
import { i18n } from "#i18n";
import Settings from "./Settings";
import { useQueryClient } from "@tanstack/react-query";
import useStore from "./store";
import CMD from "./cmd";
import ServerInfo from "./ServerInfo";
import "./App.css";
import Logs from "./Logs";

function App() {
  const { isValidKey, activeTab, setActiveTab } = useStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("useEffect. activeTab", activeTab);
    if (activeTab === "info") {
      queryClient.invalidateQueries({ queryKey: ["info"] });
    } else if (activeTab === "logs") {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    }
  }, [activeTab, queryClient]);

  return (
    <Tabs value={activeTab} onChange={(tab) => setActiveTab(tab!)} h={568}>
      <Tabs.List mb={10}>
        <Tabs.Tab value="info" disabled={!isValidKey}>
          {i18n.t("main.server_info")}
        </Tabs.Tab>
        <Tabs.Tab value="cmd" disabled={!isValidKey}>
          {i18n.t("main.cmd")}
        </Tabs.Tab>
        <Tabs.Tab value="logs" disabled={!isValidKey}>
          {i18n.t("main.logs")}
        </Tabs.Tab>
        <Tabs.Tab value="settings">{i18n.t("main.settings")}</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="info">
        <Paper shadow="md" radius="md" w={500} h={520} p={15}>
          <ServerInfo />
        </Paper>
      </Tabs.Panel>
      <Tabs.Panel value="cmd">
        <Paper shadow="md" radius="md" w={500} h={520} p={15}>
          <CMD />
        </Paper>
      </Tabs.Panel>
      <Tabs.Panel value="logs">
        <Paper shadow="md" radius="md" w={500} h={520} p={15}>
          <Logs />
        </Paper>
      </Tabs.Panel>
      <Tabs.Panel value="settings">
        <Paper shadow="md" radius="md" w={500} h={520} p={15}>
          <Settings />
        </Paper>
      </Tabs.Panel>
    </Tabs>
  );
}

export default App;

// TODO fix uptime parsing
