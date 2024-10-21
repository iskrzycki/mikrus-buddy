interface DiskStats {
  size: number;
  usePercent: string;
  used: number;
  available: number;
  mountedOn: string;
  filesystem: string;
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

export interface ServerData {
  server_id: string;
  server_name?: string;
  expires: string;
  uptime: string;
  mikrus_pro: string;
  expires_cytrus: string;
  expires_storage: string;
  lastlog_panel: string;
  memory: MemoryStats | null;
  disk: DiskStats[] | null;
}

export const fetchMikrusAPI = async (
  apiKey: string,
  serverId: string,
  endpoint: string
) => {
  const formData = new FormData();
  formData.append("key", apiKey);
  formData.append("srv", serverId);
  console.log(
    `fetching https://api.mikr.us/${endpoint}. Key: ${apiKey}, srv: ${serverId}`
  );

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
): Promise<ServerData> => {
  const [info, stats] = await Promise.all([
    fetchMikrusAPI(apiKey, serverId, "info"),
    fetchMikrusAPI(apiKey, serverId, "stats"),
  ]);

  return {
    ...info,
    uptime: extractSystemInfo(stats.uptime).uptime,
    memory: parseMemoryStats(stats.free),
    disk: parseDfString(stats.df),
  };
};

export const extractSystemInfo = (inputString: string): any => {
  // Regular expression to match the system time in the format HH:MM:SS
  const timeRegex = /^(\d{2}:\d{2}:\d{2})/;
  const timeMatch = inputString.match(timeRegex);

  // Regular expression to match everything between the system time and the user counter
  const uptimeRegex = /\d{2}:\d{2}:\d{2}\s+up\s+(.+?),\s+\d+\s+user/; // `user` in debian, `users` in ubuntu
  const uptimeMatch = inputString.match(uptimeRegex);

  if (!timeMatch || !uptimeMatch) {
    throw new Error("Invalid input string: " + inputString);
  }

  const systemTime = timeMatch[1];
  const uptime = uptimeMatch[1];

  return { systemTime, uptime };
};

export const parseMemoryStats = (memoryString: string): MemoryStats | null => {
  const memoryRegex = /Mem:\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/;
  const swapRegex = /Swap:\s+(\d+)\s+(\d+)\s+(\d+)/;

  const memoryMatch = memoryRegex.exec(memoryString);
  const swapMatch = swapRegex.exec(memoryString);

  if (!memoryMatch || !swapMatch) {
    throw new Error("Invalid memory string: " + memoryString);
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

export const parseDfString = (dfOutput: string): DiskStats[] => {
  const dfRegex = /(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)/;
  const lines = dfOutput.split("\n");
  const storageArray = [];

  // Skipping the first line (header)
  for (let i = 1; i < lines.length; i++) {
    const match = dfRegex.exec(lines[i]);
    if (match) {
      const [_, filesystem, size, used, available, usePercent, mountedOn] =
        match;

      const parsedSize = parseSizeString(size);
      const parsedUsed = parseSizeString(used);
      const parsedAvailable = parseSizeString(available);
      const calculatedReserved =
        Math.round(100 * (parsedSize - parsedUsed - parsedAvailable)) / 100;

      storageArray.push({
        filesystem,
        size: parsedSize,
        used: parsedUsed,
        available: parsedAvailable,
        usePercent,
        mountedOn,
        reserved: calculatedReserved,
      });
    }
  }

  return storageArray;
};

export const parseSizeString = (sizeString: string): number => {
  const sizeRegex = /^(\d+(\.\d+)?)([MG])?$/;

  const match = sizeRegex.exec(sizeString);

  if (!match) {
    throw new Error("Invalid size string: " + sizeString);
  }

  const size = parseFloat(match[1]);
  const unit = match[3];

  if (unit === "M") {
    return size / 1000;
  } else {
    return size;
  }
};
