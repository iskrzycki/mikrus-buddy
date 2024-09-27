import { describe, expect, test } from "vitest";
import { extractSystemInfo, parseDfString, parseMemoryStats } from "../utils";

const serverStats = {
  free: "total        used        free      shared  buff/cache   available\nMem:            1280        1025           5          16         249         254\nSwap:              0           0           0",
  df: "Filesystem                                         Size  Used Avail Use% Mounted on\n/dev/mapper/pve-vm--630--disk--0                    15G   14G  848M  95% /\n/dev/mapper/storage01--vg--srv07-vm--630--disk--0  123G  259M  117G   1% /storage",
  uptime:
    "18:38:10 up 3 days, 22:14,  0 users,  load average: 0.00, 0.00, 0.00\nsh: 1: echo",
};

// TODO add more tests (also for the system time)
test("extractUptime", () => {
  expect(extractSystemInfo(serverStats.uptime).uptime).toBe("3 days, 22:14");

  expect(
    extractSystemInfo(
      "20:28:52 up 9 days, 5 min, 0 users, load average: 0.13, 0.20, 0.13 sh: 1: echo"
    ).uptime
  ).toBe("9 days, 5 min");
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

  expect(
    parseMemoryStats(
      "total        used        free      shared  buff/cache   available\nMem:            768         379         120           4         268         388\nSwap:             0           0           0"
    )
  ).toEqual({
    available: 388,
    buffCache: 268,
    free: 120,
    shared: 4,
    total: 768,
    used: 379,
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
  test("should parse df string - two storages, one with 0 used", () => {
    const dfString =
      "Filesystem                        Size  Used Avail Use% Mounted on\n/dev/mapper/pve-vm--552--disk--0  9.8G  7.8G  1.6G  83% /\nudev                               63G     0   63G   0% /dev/net";

    expect(parseDfString(dfString)).toEqual([
      {
        available: 1.6,
        filesystem: "/dev/mapper/pve-vm--552--disk--0",
        mountedOn: "/",
        size: 9.8,
        usePercent: "83%",
        used: 7.8,
        reserved: 0.4,
      },
      {
        available: 63,
        filesystem: "udev",
        mountedOn: "/dev/net",
        size: 63,
        usePercent: "0%",
        used: 0,
        reserved: 0,
      },
    ]);
  });
});


