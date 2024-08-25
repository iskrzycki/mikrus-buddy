import { Button, Loader, Paper, Tabs } from "@mantine/core";
import { browser } from "wxt/browser";
import ServerInfoPanel from "./ServerInfoPanel";
import Settings from "./Settings";
import { getServerInfo } from "@/utils";
import "./App.css";
import { useQuery, useQueryClient } from "react-query";
import useStore from "./store";
import { IconRefresh } from "@tabler/icons-react";

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
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["info"],
    queryFn: tempInfo,
    refetchOnWindowFocus: false,
  });

  return (
    <Tabs value={activeTab} onChange={(tab) => setActiveTab(tab!)}>
      <Tabs.List>
        <Tabs.Tab value="info">Server info</Tabs.Tab>
        <Tabs.Tab value="cmd">CMD</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="info">
        <Paper shadow="md" radius="md" w={400} p={20}>
          <Button
            onClick={async () => await queryClient.invalidateQueries("info")}
          >
            <IconRefresh />
          </Button>
          {data ? <ServerInfoPanel responseData={data} /> : null}
        </Paper>
      </Tabs.Panel>
      <Tabs.Panel value="cmd">
        <Paper shadow="md" radius="md" w={400} p={20}>
          <p>CMD list</p>
        </Paper>
      </Tabs.Panel>
      <Tabs.Panel value="settings">
        <Paper shadow="md" radius="md" w={400} p={20}>
          <Settings />
        </Paper>
      </Tabs.Panel>
    </Tabs>
  );
}

export default App;

// TODO fix uptime parsing
// TODO memory chart -> use RingProgress
