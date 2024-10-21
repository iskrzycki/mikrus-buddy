import { describe, expect, test } from "vitest";
import { extractSystemInfo, parseDfString, parseMemoryStats } from "../utils";

const serverStats = {
  free: "total        used        free      shared  buff/cache   available\nMem:            1280        1025           5          16         249         254\nSwap:              0           0           0",
  df: "Filesystem                                         Size  Used Avail Use% Mounted on\n/dev/mapper/pve-vm--630--disk--0                    15G   14G  848M  95% /\n/dev/mapper/storage01--vg--srv07-vm--630--disk--0  123G  259M  117G   1% /storage",
  uptime:
    "18:38:10 up 3 days, 22:14,  0 users,  load average: 0.00, 0.00, 0.00\nsh: 1: echo",
};

// debian, mikrus 3.5 + upgrade
const anotherStats = {
  free: "total        used        free      shared  buff/cache   available\nMem:            4352          76        4241           0          33        4275\nSwap:              0           0           0",
  df: "Filesystem                        Size  Used Avail Use% Mounted on\n/dev/mapper/pve-vm--608--disk--0   44G  3.3G   39G   8% /\nudev                               63G     0   63G   0% /dev/net",
  uptime:
    "14:34:21 up 106 days, 13:20,  0 user,  load average: 373.67, 381.77, 380.74\nsh: 1: echo",
  ps: ": not found\nUSER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot      176404  0.0  0.0   9468  3392 ?        S    14:34   0:00 bash -c cat | sh\nroot      176406  0.0  0.0   2576   900 ?        S    14:34   0:00  \\_ sh\nroot      176411  0.0  0.0  13576  4420 ?        R    14:34   0:00      \\_ ps auxf\nroot           1  0.0  0.1 168744  5668 ?        Ss   Jul07   0:33 /lib/systemd/systemd --system --deserialize=16\nroot         119  0.0  0.0   9144   556 ?        Ss   Jul07   0:08 /usr/sbin/cron -f\nmessage+     120  0.0  0.0   9304   724 ?        Ss   Jul07   0:00 /usr/bin/dbus-daemon --system --address=systemd: --nofork --nopidfile --systemd-activation --syslog-only\nroot         122  0.0  0.0 152140   756 ?        Ssl  Jul07   0:01 /usr/sbin/rsyslogd -n -iNONE\nroot         239  0.0  0.0   8032    92 pts/0    Ss+  Jul07   0:00 /sbin/agetty -o -p -- \\u --noclear --keep-baud - 115200,38400,9600 linux\nroot         240  0.0  0.0   8032    88 pts/1    Ss+  Jul07   0:00 /sbin/agetty -o -p -- \\u --noclear - linux\nroot         241  0.0  0.0   8032    92 pts/2    Ss+  Jul07   0:00 /sbin/agetty -o -p -- \\u --noclear - linux\nroot         242  0.0  0.0  15420  1328 ?        Ss   Jul07   0:00 sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups\ncoroqne+     254  0.0  0.1  17296  5932 ?        Ss   Jul07   0:00 /usr/bin/corosync-qnetd -f\nroot       21329  0.0  0.3 1726680 14496 ?       Ssl  Sep15   4:37 /usr/bin/containerd\nsystemd+   22476  0.0  0.0  18024  1188 ?        Ss   Sep15   0:02 /lib/systemd/systemd-networkd\nroot       22480  0.0  0.0  49340  3788 ?        Ss   Sep15   0:05 /lib/systemd/systemd-journald\nroot      166530  0.0  0.5 1938392 24828 ?       Ssl  Oct19   0:17 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock\nroot      166696  0.0  0.0 1523360  984 ?        Sl   Oct19   0:00  \\_ /usr/bin/docker-proxy -proto tcp -host-ip 0.0.0.0 -host-port 9001 -container-ip 172.17.0.2 -container-port 9001\nroot      166701  0.0  0.0 1597092 1296 ?        Sl   Oct19   0:00  \\_ /usr/bin/docker-proxy -proto tcp -host-ip :: -host-port 9001 -container-ip 172.17.0.2 -container-port 9001\nroot      166722  0.0  0.0 1237912 4204 ?        Sl   Oct19   1:08 /usr/bin/containerd-shim-runc-v2 -namespace moby -id 6a76b82ce7fde56c6ef8438cc41bb5197fc6f00eb0c391779b839651dbb8fbf9 -address /run/containerd/containerd.sock\nroot      166747  0.0  0.2 1277476 10436 ?       Ssl  Oct19   0:12  \\_ ./agent",
};

describe("extractUptime", () => {
  test.each([
    [
      "3 days, 22:14",
      "18:38:10 up 3 days, 22:14,  0 users,  load average: 0.00, 0.00, 0.00\nsh: 1: echo", // ubuntu
    ],
    [
      "9 days, 5 min",
      "20:28:52 up 9 days, 5 min, 0 users, load average: 0.13, 0.20, 0.13 sh: 1: echo", // ubuntu
    ],
    [
      "395 days, 20:15",
      "14:19:57 up 395 days, 20:15,  0 users,  load average: 0.08, 0.12, 0.09\nsh: 1: echo", // ubuntu
    ],
    [
      "106 days, 13:20",
      "14:34:21 up 106 days, 13:20,  0 user,  load average: 373.67, 381.77, 380.74\nsh: 1: echo", // debian
    ],
  ])(
    'should extract uptime "%s" from string "%s"',
    (expectedUptime: string, inputString: string) => {
      expect(extractSystemInfo(inputString).uptime).toBe(expectedUptime);
    }
  );
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
  // debian, mikrus 3.5 + upgrade
  expect(
    parseMemoryStats(
      "total        used        free      shared  buff/cache   available\nMem:            4352          76        4241           0          33        4275\nSwap:              0           0           0"
    )
  ).toEqual({
    available: 4275,
    buffCache: 33,
    free: 4241,
    shared: 0,
    total: 4352,
    used: 76,
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

  // debian, mikrus 3.5 + upgrade
  test("should parse df string - debian, just HDD + /net drive", () => {
    const dfString =
      "Filesystem                        Size  Used Avail Use% Mounted on\n/dev/mapper/pve-vm--608--disk--0   44G  3.3G   39G   8% /\nudev                               63G     0   63G   0% /dev/net";

    expect(parseDfString(dfString)).toEqual([
      {
        available: 39,
        filesystem: "/dev/mapper/pve-vm--608--disk--0",
        mountedOn: "/",
        size: 44,
        usePercent: "8%",
        used: 3.3,
        reserved: 1.7,
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
