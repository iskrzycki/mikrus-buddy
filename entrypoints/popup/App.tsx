import { Button, Paper, Tabs } from "@mantine/core";
import { useState, useEffect } from "react";
import { browser } from "wxt/browser";
import ServerInfoPanel from "./ServerInfoPanel";
import Settings from "./Settings";
import { getServerInfo, ServerInfo } from "@/utils";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState<string | null>("settings");
  const [isValidKey, setIsValidKey] = useState<boolean>(false);
  const [mikrusInfo, setMikrusInfo] = useState<ServerInfo | null>(null);

  browser.storage.onChanged.addListener((changes) => {
    setIsValidKey(changes.isValidKey.newValue);
    if (changes.isValidKey.newValue) {
      setActiveTab("info");
    } else {
      setActiveTab("settings");
    }
  });

  useEffect(() => {
    browser.storage.sync.get(["apiKey", "serverId"]).then(async (result) => {
      if (result.apiKey && result.serverId) {
        try {
          const info = await getServerInfo(result.apiKey, result.serverId);
          setMikrusInfo(info);
        } catch (error) {
          alert(error);
          console.error("Error fetching data:", error);
        }
      }
    });
  }, []);

  const handleSendRequest = async () => {
    try {
      const { apiKey, serverId } = await browser.storage.sync.get([
        "apiKey",
        "serverId",
      ]);
      const info = await getServerInfo(apiKey, serverId);
      setMikrusInfo(info);
    } catch (error) {
      alert("Error fetching data");
      alert(error);
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Tabs value={activeTab} onChange={setActiveTab}>
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
        <Paper shadow="md" radius="md" w={400}>
          <Button onClick={handleSendRequest}>Refresh</Button>
          {mikrusInfo && <ServerInfoPanel responseData={mikrusInfo} />}
        </Paper>
      </Tabs.Panel>
      <Tabs.Panel value="cmd">
        <Paper shadow="md" radius="md" w={400}>
          <p>CMD list</p>
        </Paper>
      </Tabs.Panel>
      <Tabs.Panel value="settings">
        <Settings />
      </Tabs.Panel>
    </Tabs>
  );
}

export default App;

// TODO fix uptime parsing
// TODO memory chart -> use RingProgress
