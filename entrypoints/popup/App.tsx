import { Center, Loader, Paper, Tabs } from "@mantine/core";
import { browser } from "wxt/browser";
import Settings from "./Settings";
import { getServerInfo } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import useStore from "./store";
import CMD from "./cmd";
import ServerInfo from "./ServerInfo";
import "./App.css";

const tempInfo = async () => {
  const { apiKey, serverId } = await browser.storage.sync.get([
    "apiKey",
    "serverId",
  ]);
  if (apiKey && serverId) {
    return await getServerInfo(apiKey, serverId);
  }
  return null;
};

function App() {
  const { isValidKey, activeTab, setActiveTab } = useStore();
  const { data, isLoading } = useQuery({
    queryKey: ["info"],
    queryFn: tempInfo,
    refetchOnWindowFocus: false,
  });

  return (
    <Tabs value={activeTab} onChange={(tab) => setActiveTab(tab!)} h={568}>
      <Tabs.List mb={10}>
        <Tabs.Tab value="info" disabled={!isValidKey}>
          Server info
        </Tabs.Tab>
        <Tabs.Tab value="cmd" disabled={!isValidKey}>
          CMD
        </Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="info">
        <Paper shadow="md" radius="md" w={500} h={520} p={15}>
          {data ? (
            <ServerInfo responseData={data} />
          ) : isLoading ? (
            <Center>
              <Loader size={50} />
            </Center>
          ) : null}
        </Paper>
      </Tabs.Panel>
      <Tabs.Panel value="cmd">
        <Paper shadow="md" radius="md" w={500} h={520} p={15}>
          <CMD />
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
