import { ServerData } from "@/utils";
import { Accordion, Grid, Text } from "@mantine/core";
import React from "react";
import StatsCircle from "./StatsCircle";
import {
  IconCpu,
  IconDatabase,
  IconDeviceDesktopAnalytics,
} from "@tabler/icons-react";

interface ServerInfoPanelProps {
  responseData: ServerData;
}

const ServerInfoPanel: React.FC<ServerInfoPanelProps> = ({ responseData }) => {
  return (
    <Accordion defaultValue="info" mt={20}>
      <Accordion.Item value="info">
        <Accordion.Control icon={<IconDeviceDesktopAnalytics />}>
          Server info
        </Accordion.Control>
        <Accordion.Panel>
          <Text>
            <strong>Server id:</strong> {responseData.server_id}
          </Text>
          {responseData.server_name && (
            <Text>
              <strong>Server name:</strong> {responseData.server_name}
            </Text>
          )}
          <Text>
            <strong>Expires:</strong> {responseData.expires.split(" ")[0]}
          </Text>
          <Text>
            <strong>Expires storage: </strong>
            {responseData.expires_storage
              ? responseData.expires_storage.split(" ")[0]
              : "no storage"}
          </Text>
          <Text>
            <strong>RAM:</strong> {responseData.param_ram} MB
          </Text>
          <Text>
            <strong>HDD:</strong> {responseData.param_disk} GB
          </Text>
          <Text>
            {/* TODO consider using <Badge /> here */}
            <strong>mikr.us pro:</strong> {responseData.mikrus_pro}
          </Text>
          <Text>
            <strong>uptime:</strong> {responseData.uptime}
          </Text>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="ram">
        <Accordion.Control icon={<IconCpu />}>RAM stats</Accordion.Control>
        <Accordion.Panel>
          {responseData.memory && (
            <StatsCircle
              title="RAM"
              total={responseData.memory.total}
              sections={[
                {
                  value: responseData.memory.used,
                  color: "cyan",
                  tooltip: `Used (${responseData.memory.used} mb)`,
                },
                {
                  value: responseData.memory.free,
                  color: "orange",
                  tooltip: `Free (${responseData.memory.free} mb)`,
                },
                {
                  value: responseData.memory.buffCache,
                  color: "grape",
                  tooltip: `Buff/cache (${responseData.memory.buffCache} mb)`,
                },
              ]}
            />
          )}
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="hdd">
        <Accordion.Control icon={<IconDatabase />}>HDD stats</Accordion.Control>
        <Accordion.Panel>
          <Grid>
            {responseData.disk &&
              responseData.disk.map((disk) => (
                <Grid.Col span={6} key={disk.filesystem}>
                  <StatsCircle
                    key={disk.filesystem}
                    title={disk.mountedOn}
                    total={disk.size}
                    sections={[
                      {
                        value: disk.used,
                        color: "cyan",
                        tooltip: `Used (${disk.used} G)`,
                      },
                      {
                        value: disk.available,
                        color: "orange",
                        tooltip: `Available (${disk.available} G)`,
                      },
                      {
                        value: disk.reserved,
                        color: "gray",
                        tooltip: `Reserved (${disk.reserved} G)`,
                      },
                    ]}
                  />
                </Grid.Col>
              ))}
          </Grid>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default ServerInfoPanel;

// TODO HANDLE THESE FIELDS
// <div><strong>expires_cytrus:</strong> {responseData.expires_cytrus !== null ? responseData.expires_cytrus : 'null'}</div>
// <div><strong>expires_storage:</strong> {responseData.expires_storage !== null ? responseData.expires_storage : 'null'}</div>
// <div><strong>lastlog_panel:</strong> {responseData.lastlog_panel}</div>
