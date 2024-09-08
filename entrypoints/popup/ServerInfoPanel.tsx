import { ServerData } from "@/utils";
import { Accordion, Grid } from "@mantine/core";
import React from "react";
import StatsCircle from "./StatsCircle";
import { IconPrinter } from "@tabler/icons-react";

interface ServerInfoPanelProps {
  responseData: ServerData;
}

const ServerInfoPanel: React.FC<ServerInfoPanelProps> = ({ responseData }) => {
  return (
    <Accordion defaultValue="info">
      <Accordion.Item value="info">
        <Accordion.Control icon={<IconPrinter />}>
          Server info
        </Accordion.Control>
        <Accordion.Panel>
          <p>
            <strong>Server id:</strong> {responseData.server_id}
          </p>
          {responseData.server_name && (
            <p>
              <strong>Server name:</strong> {responseData.server_name}
            </p>
          )}
          <p>
            <strong>Expires:</strong> {responseData.expires.split(" ")[0]}
          </p>
          <p>
            <strong>Expires storage: </strong>
            {responseData.expires_storage
              ? responseData.expires_storage.split(" ")[0]
              : "no storage"}
          </p>
          <p>
            <strong>RAM:</strong> {responseData.param_ram} MB
          </p>
          <p>
            <strong>HDD:</strong> {responseData.param_disk} GB
          </p>
          <p>
            <strong>mikr.us pro:</strong> {responseData.mikrus_pro}
          </p>
          <p>
            <strong>uptime:</strong> {responseData.uptime}
          </p>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="ram">
        <Accordion.Control icon={<IconPrinter />}>RAM stats</Accordion.Control>
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
        <Accordion.Control icon={<IconPrinter />}>HDD stats</Accordion.Control>
        <Accordion.Panel>
          <Grid>
            {responseData.disk &&
              responseData.disk.map((disk) => (
                <Grid.Col span={6}>
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
