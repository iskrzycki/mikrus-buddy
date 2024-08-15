const fetchMikrusAPI = async (
  apiKey: string,
  serverId: string,
  endpoint: string
) => {
  const formData = new FormData();
  formData.append("key", apiKey);
  formData.append("srv", serverId);

  const response = await fetch(`https://api.mikr.us/${endpoint}`, {
    method: "POST",
    body: formData,
  });

  if (response.status === 429) {
    throw new Error("Too Many Requests");
  }

  return response.json();
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
// 16:27:02 up 3 days, 22:15, 0 users, load average: 0.08, 0.10, 0.04 sh: 1: echo
const extractUptime = (uptimeString: string) => {
  // Regular expression to match uptime with or without days
  const uptimeRegex = /up\s+((\d+\s+days?,\s+)?\d+:\d+)/;
  const match = uptimeRegex.exec(uptimeString);

  if (!match) {
    return "invalid uptime";
  }

  const uptime = match[1].trim();
  return uptime;
};

const parseMemoryStats = (memoryString: string) => {
  const memoryRegex = /Mem:\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/;
  const swapRegex = /Swap:\s+(\d+)\s+(\d+)\s+(\d+)/;

  const memoryMatch = memoryRegex.exec(memoryString);
  const swapMatch = swapRegex.exec(memoryString);

  if (!memoryMatch || !swapMatch) {
    return "invalid memory stats";
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
