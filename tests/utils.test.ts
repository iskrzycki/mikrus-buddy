import { describe, expect, test } from "vitest";
import { extractUptime, parseDfString, parseMemoryStats } from "../utils";

const serverStats = {
  free: "total        used        free      shared  buff/cache   available\nMem:            1280        1025           5          16         249         254\nSwap:              0           0           0",
  df: "Filesystem                                         Size  Used Avail Use% Mounted on\n/dev/mapper/pve-vm--630--disk--0                    15G   14G  848M  95% /\n/dev/mapper/storage01--vg--srv07-vm--630--disk--0  123G  259M  117G   1% /storage",
  uptime:
    "18:38:10 up 3 days, 22:14,  0 users,  load average: 0.00, 0.00, 0.00\nsh: 1: echo",
};

test("extractUptime", () => {
  expect(extractUptime(serverStats.uptime)).toBe("3 days, 22:14");
});

test("parseMemoryStats", () => {
  expect(parseMemoryStats(serverStats.free)).toEqual({
    available: 254,
    buffCache: 249,
    free: 5,
    shared: 16,
    total: 1280,
    used: 1025,
    swapFree: 0,
    swapTotal: 0,
    swapUsed: 0,
  });
});

describe("parseDfString", () => {
  test("should parse df string with two storages", () => {
    const dfString =
      "Filesystem                                         Size  Used Avail Use% Mounted on\n/dev/mapper/pve-vm--630--disk--0                    15G   14G  848M  95% /\n/dev/mapper/storage01--vg--srv07-vm--630--disk--0  123G  259M  117G   1% /storage";

    expect(parseDfString(dfString)).toEqual([
      {
        available: 0.848,
        filesystem: "/dev/mapper/pve-vm--630--disk--0",
        mountedOn: "/",
        size: 15,
        usePercent: "95%",
        used: 14,
        reserved: 0.15,
      },
      {
        available: 117,
        filesystem: "/dev/mapper/storage01--vg--srv07-vm--630--disk--0",
        mountedOn: "/storage",
        size: 123,
        usePercent: "1%",
        used: 0.259,
        reserved: 5.74,
      },
    ]);
  });

  test("should parse df string with one storage", () => {
    const dfString =
      "Filesystem                        Size  Used Avail Use% Mounted on\n/dev/mapper/pve-vm--630--disk--0   15G  9.2G  4.8G  66% /";

    expect(parseDfString(dfString)).toEqual([
      {
        available: 4.8,
        filesystem: "/dev/mapper/pve-vm--630--disk--0",
        mountedOn: "/",
        size: 15,
        usePercent: "66%",
        used: 9.2,
        reserved: 1,
      },
    ]);
  });
});
