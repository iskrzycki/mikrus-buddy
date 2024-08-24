interface DiskStats {
  total: number;
  used: number;
  available: number;
  reserved: number;
}
interface MemoryStats {
  total: number;
  used: number;
  free: number;
  shared: number;
  buffCache: number;
  available: number;
  swapTotal: number;
  swapUsed: number;
  swapFree: number;
}

export interface ServerInfo {
  server_id: string;
  server_name?: string;
  expires: string;
  uptime: string;
  mikrus_pro: string;
  expires_cytrus: string;
  expires_storage: string;
  lastlog_panel: string;
  memory: MemoryStats | null;
  disk: DiskStats | null;
}

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

export const getServerInfo = async (
  apiKey: string,
  serverId: string
): Promise<ServerInfo> => {
  const [info, stats] = await Promise.all([
    fetchMikrusAPI(apiKey, serverId, "info"),
    fetchMikrusAPI(apiKey, serverId, "stats"),
  ]);

  return {
    ...info,
    uptime: extractUptime(stats.uptime),
    memory: parseMemoryStats(stats.free),
    disk: parseDfString(stats.df),
  };
};
// 16:27:02 up 3 days, 22:15, 0 users, load average: 0.08, 0.10, 0.04 sh: 1: echo
const extractUptime = (uptimeString: string): string => {
  // Regular expression to match uptime with or without days
  const uptimeRegex = /up\s+((\d+\s+days?,\s+)?\d+:\d+)/;
  const match = uptimeRegex.exec(uptimeString);

  if (!match) {
    return "invalid uptime";
  }

  const uptime = match[1].trim();
  return uptime;
};

const parseMemoryStats = (memoryString: string): MemoryStats | null => {
  const memoryRegex = /Mem:\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/;
  const swapRegex = /Swap:\s+(\d+)\s+(\d+)\s+(\d+)/;

  const memoryMatch = memoryRegex.exec(memoryString);
  const swapMatch = swapRegex.exec(memoryString);

  if (!memoryMatch || !swapMatch) {
    return null;
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

// TODO tests
// "Filesystem                        Size  Used Avail Use% Mounted on\n/dev/mapper/pve-vm--630--disk--0   15G  9.2G  4.8G  66% /"
const parseDfString = (dfString: string): DiskStats | null => {
  const dfRegex = /\/dev\/mapper\/[^\s]+\s+(\d+)G\s+(\d+\.\d+)G\s+(\d+\.\d+)G/;
  const match = dfString.match(dfRegex);

  if (!match) {
    return null;
  }

  const total = parseFloat(match[1]);
  const used = parseFloat(match[2]);
  const available = parseFloat(match[3]);
  // TODO consider better rounding
  const reserved = Math.round(total - used - available);

  return { total, used, available, reserved };
};
