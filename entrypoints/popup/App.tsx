import { getServerInfo } from "@/utils";
import { useState, useEffect } from "react";
import { browser } from "wxt/browser";
import ServerInfo from "./ServerInfo";

function App() {
  const [apiKey, setApiKey] = useState("");
  const [serverId, setServerId] = useState("");
  const [mikrusInfo, setMikrusInfo] = useState(null);

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
    browser.storage.sync.set({ apiKey: event.target.value });
  };
  const handleServerIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setServerId(event.target.value);
    browser.storage.sync.set({ serverId: event.target.value });
  };

  useEffect(() => {
    browser.storage.sync.get(["apiKey", "serverId"]).then((result) => {
      setApiKey(result.apiKey || "");
      setServerId(result.serverId || "");
    });
  }, []);

  const handleSendRequest = async () => {
    try {
      const info = await getServerInfo(apiKey, serverId);
      setMikrusInfo(info);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="card">
      <input
        type="text"
        value={apiKey}
        onChange={handleApiKeyChange}
        placeholder="Enter your mikr.us API key"
      />
      <input
        type="text"
        value={serverId}
        onChange={handleServerIdChange}
        placeholder="Enter your server ID"
      />
      <button onClick={handleSendRequest} disabled={!apiKey || !serverId}>
        Send Request
      </button>
      {mikrusInfo && <ServerInfo responseData={mikrusInfo} />}
    </div>
  );
}

export default App;
