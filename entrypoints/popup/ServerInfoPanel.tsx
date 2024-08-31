import { ServerData } from "@/utils";
import { Grid, RingProgress, Text } from "@mantine/core";
import React from "react";

interface ServerInfoPanelProps {
  responseData: ServerData;
}

const ServerInfoPanel: React.FC<ServerInfoPanelProps> = ({ responseData }) => {
  return (
    <div>
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
        <strong>RAM:</strong> {responseData.param_ram} MB (
        {responseData.memory && responseData.memory.available} MB available)
      </p>
      <p>
        <strong>HDD:</strong> {responseData.param_disk} GB (
        {responseData.disk.available} GB available )
      </p>
      <p>
        <strong>mikr.us pro:</strong> {responseData.mikrus_pro}
      </p>
      <p>
        <strong>uptime:</strong> {responseData.uptime}
      </p>
      <Grid>
        <Grid.Col span={6}>
          {responseData.memory && (
            <RingProgress
              size={170}
              thickness={16}
              label={
                <Text
                  size="xs"
                  ta="center"
                  px="xs"
                  style={{ pointerEvents: "none" }}
                >
                  RAM (hover for details)
                </Text>
              }
              sections={[
                {
                  value:
                    (100 * parseInt(responseData.memory.used)) /
                    parseInt(responseData.memory.total),
                  color: "cyan",
                  tooltip: `Used (${responseData.memory.used} mb)`,
                },
                {
                  value:
                    (100 * parseInt(responseData.memory.free)) /
                    parseInt(responseData.memory.total),
                  color: "orange",
                  tooltip: `Free (${responseData.memory.free} mb)`,
                },
                {
                  value:
                    (100 * parseInt(responseData.memory.buffCache)) /
                    parseInt(responseData.memory.total),
                  color: "grape",
                  tooltip: `Buff/cache (${responseData.memory.buffCache} mb)`,
                },
              ]}
            />
          )}
        </Grid.Col>
        <Grid.Col span={6}>
          {responseData.disk && (
            <RingProgress
              size={170}
              thickness={16}
              label={
                <Text
                  size="xs"
                  ta="center"
                  px="xs"
                  style={{ pointerEvents: "none" }}
                >
                  HDD (hover for details)
                </Text>
              }
              sections={[
                {
                  value:
                    (100 * parseFloat(responseData.disk.used)) /
                    parseFloat(responseData.disk.total),
                  color: "cyan",
                  tooltip: `Used (${responseData.disk.used} Gb)`,
                },
                {
                  value:
                    (100 * parseFloat(responseData.disk.available)) /
                    parseFloat(responseData.disk.total),
                  color: "orange",
                  tooltip: `Available (${responseData.disk.available} Gb)`,
                },
                {
                  value:
                    (100 * parseFloat(responseData.disk.reserved)) /
                    parseFloat(responseData.disk.total),
                  color: "gray",
                  tooltip: `Reserved (${responseData.disk.reserved} Gb)`,
                },
              ]}
            />
          )}
        </Grid.Col>
      </Grid>
      {/* TODO HANDLE THESE FIELDS */}
      {/* <div><strong>expires_cytrus:</strong> {responseData.expires_cytrus !== null ? responseData.expires_cytrus : 'null'}</div> */}
      {/* <div><strong>expires_storage:</strong> {responseData.expires_storage !== null ? responseData.expires_storage : 'null'}</div> */}
      {/* <div><strong>lastlog_panel:</strong> {responseData.lastlog_panel}</div> */}
    </div>
  );
};

export default ServerInfoPanel;
