import { getServerInfo } from "@/utils";
import { useState, useEffect } from "react";
import { browser } from "wxt/browser";
import ServerInfo from "./ServerInfo";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({ apiKey: "", serverId: "" });
  const [formMode, setFormMode] = useState<"INFO" | "LOGIN">("LOGIN");
  const [mikrusInfo, setMikrusInfo] = useState(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    browser.storage.sync.set({ [name]: value });
  };

  useEffect(() => {
    browser.storage.sync.get(["apiKey", "serverId"]).then(async (result) => {
      setFormData({
        apiKey: result.apiKey || "",
        serverId: result.serverId || "",
      });
      if (result.apiKey && result.serverId) {
        try {
          const info = await getServerInfo(result.apiKey, result.serverId);
          setMikrusInfo(info);
          setFormMode("INFO");
        } catch (error) {
          alert(error);
          console.error("Error fetching data:", error);
        }
      }
    });
  }, []);

  const handleSendRequest = async () => {
    try {
      const info = await getServerInfo(formData.apiKey, formData.serverId);
      setMikrusInfo(info);
      setFormMode("INFO");
    } catch (error) {
      alert("Error fetching data");
      alert(error);
      console.error("Error fetching data:", error);
    }
  };

  const handleLogout = async () => {
    browser.storage.sync.set({ apiKey: undefined, serverId: undefined });
    setFormData({
      apiKey: "",
      serverId: "",
    });
    setFormMode("LOGIN");
  };

  return (
    <>
      <div className="card">
        {formMode === "LOGIN" && (
          <div>
            <input
              type="text"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleInputChange}
              placeholder="Enter your mikr.us API key"
            />
            <input
              type="text"
              name="serverId"
              value={formData.serverId}
              onChange={handleInputChange}
              placeholder="Enter your server ID"
            />
            <button
              onClick={handleSendRequest}
              disabled={!formData.apiKey || !formData.serverId}
            >
              Save data
            </button>
          </div>
        )}
        {formMode === "INFO" && <button onClick={handleLogout}>Logout</button>}
      </div>
      {formMode === "INFO" && (
        <div className="card">
          <button onClick={handleSendRequest}>Refresh</button>
          {mikrusInfo && <ServerInfo responseData={mikrusInfo} />}
        </div>
      )}
    </>
  );
}

export default App;

// TODO fix uptime parsing
// TODO memory chart
