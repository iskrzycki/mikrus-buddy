const fetchMikrusAPI = async (
  apiKey: string,
  serverId: string,
  endpoint: string
) => {
  const formData = new FormData();
  formData.append("key", apiKey);
  formData.append("srv", serverId);

  return fetch(`https://api.mikr.us/${endpoint}`, {
    method: "POST",
    body: formData,
  }).then((response) => response.json());
};

export const getServerInfo = async (apiKey: string, serverId: string) => {
  const [info, stats] = await Promise.all([
    fetchMikrusAPI(apiKey, serverId, "info"),
    fetchMikrusAPI(apiKey, serverId, "stats"),
  ]);

  return {
    ...info,
    uptime: extractUptime(stats.uptime),
    memory: parseMemoryStats(stats.free),
  };
};

const extractUptime = (uptimeString: string) => {
  const uptimeRegex = /up\s+([^,]*)/;
  const match = uptimeRegex.exec(uptimeString);

  if (!match) {
    throw new Error("Invalid uptime string format");
  }

  return match[1].trim();
};

const parseMemoryStats = (memoryString: string) => {
  const memoryRegex = /Mem:\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/;
  const swapRegex = /Swap:\s+(\d+)\s+(\d+)\s+(\d+)/;

  const memoryMatch = memoryRegex.exec(memoryString);
  const swapMatch = swapRegex.exec(memoryString);

  if (!memoryMatch || !swapMatch) {
    throw new Error("Invalid memory string format: " + memoryString);
  }

  const memoryStats = {
    total: parseInt(memoryMatch[1], 10),
    used: parseInt(memoryMatch[2], 10),
    free: parseInt(memoryMatch[3], 10),
    shared: parseInt(memoryMatch[4], 10),
    buffCache: parseInt(memoryMatch[5], 10),
    available: parseInt(memoryMatch[6], 10),
    swapTotal: parseInt(swapMatch[1], 10),
    swapUsed: parseInt(swapMatch[2], 10),
    swapFree: parseInt(swapMatch[3], 10),
  };

  return memoryStats;
};
