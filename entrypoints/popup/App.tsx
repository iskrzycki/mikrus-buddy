import { Paper, Tabs } from "@mantine/core";
import { browser } from "wxt/browser";
import Settings from "./Settings";
import { getServerInfo } from "@/utils";
import "./App.css";
import { useQuery } from "@tanstack/react-query";
import useStore from "./store";
import CMD from "./cmd";
import ServerInfo from "./ServerInfo";

const tempInfo = async () => {
  const { apiKey, serverId } = await browser.storage.sync.get([
    "apiKey",
    "serverId",
  ]);
  if (apiKey && serverId) {
    return await getServerInfo(apiKey, serverId);
  }
};

function App() {
  const { isValidKey, activeTab, setActiveTab } = useStore();
  const { data } = useQuery({
    queryKey: ["info"],
    queryFn: tempInfo,
    refetchOnWindowFocus: false,
  });

  return (
    <Tabs value={activeTab} onChange={(tab) => setActiveTab(tab!)}>
      <Tabs.List>
        <Tabs.Tab value="info" disabled={!isValidKey}>
          Server info
        </Tabs.Tab>
        <Tabs.Tab value="cmd" disabled={!isValidKey}>
          CMD
        </Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="info">
        <Paper shadow="md" radius="md" w={420} p={20}>
          {data ? <ServerInfo responseData={data} /> : null}
        </Paper>
      </Tabs.Panel>
      <Tabs.Panel value="cmd">
        <Paper shadow="md" radius="md" w={420} p={20}>
          <CMD />
        </Paper>
      </Tabs.Panel>
      <Tabs.Panel value="settings">
        <Paper shadow="md" radius="md" w={420} p={20}>
          <Settings />
        </Paper>
      </Tabs.Panel>
    </Tabs>
  );
}

export default App;

// TODO fix uptime parsing
// TODO memory chart -> use RingProgress
