import { ServerData } from "@/utils";
import { Accordion, Grid, Text } from "@mantine/core";
import React from "react";
import { i18n } from "#i18n";
import StatsCircle from "./StatsCircle";
import {
  IconCpu,
  IconDatabase,
  IconDeviceDesktopAnalytics,
} from "@tabler/icons-react";

interface ServerInfoPanelProps {
  data: ServerData;
}

const ServerInfoPanel: React.FC<ServerInfoPanelProps> = ({ data }) => {
  return (
    <Accordion defaultValue="info" mt={20}>
      <Accordion.Item value="info">
        <Accordion.Control icon={<IconDeviceDesktopAnalytics />}>
          {i18n.t("server_info.info.title")}
        </Accordion.Control>
        <Accordion.Panel>
          <Text>
            <strong>{i18n.t("server_info.info.server_id")}:</strong>{" "}
            {data.server_id}
          </Text>
          {data.server_name && (
            <Text>
              <strong>{i18n.t("server_info.info.server_name")}:</strong>{" "}
              {data.server_name}
            </Text>
          )}
          <Text>
            <strong>{i18n.t("server_info.info.expires_at")}:</strong>{" "}
            {data.expires.split(" ")[0]}
          </Text>
          <Text>
            <strong>{i18n.t("server_info.info.expires_storage_at")}: </strong>
            {data.expires_storage
              ? data.expires_storage.split(" ")[0]
              : i18n.t("server_info.info.no_storage")}
          </Text>
          <Text>
            <strong>{i18n.t("server_info.info.ram")}:</strong> {data.param_ram}{" "}
            MB
          </Text>
          <Text>
            <strong>{i18n.t("server_info.info.hdd")}:</strong> {data.param_disk}{" "}
            GB
          </Text>
          <Text>
            {/* TODO consider using <Badge /> here */}
            <strong>{i18n.t("server_info.info.mikrus_pro")}:</strong>{" "}
            {data.mikrus_pro}
          </Text>
          <Text>
            <strong>{i18n.t("server_info.info.uptime")}:</strong> {data.uptime}
          </Text>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="ram">
        <Accordion.Control icon={<IconCpu />}>
          {i18n.t("server_info.RAM.title")}
        </Accordion.Control>
        <Accordion.Panel>
          {data.memory && (
            <StatsCircle
              title={i18n.t("server_info.RAM.chart.title")}
              total={data.memory.total}
              sections={[
                {
                  value: data.memory.used,
                  color: "cyan",
                  tooltip: i18n.t("server_info.RAM.chart.used", [
                    data.memory.used,
                  ]),
                },
                {
                  value: data.memory.free,
                  color: "orange",
                  tooltip: i18n.t("server_info.RAM.chart.free", [
                    data.memory.free,
                  ]),
                },
                {
                  value: data.memory.buffCache,
                  color: "grape",
                  tooltip: i18n.t("server_info.RAM.chart.buff", [
                    data.memory.buffCache,
                  ]),
                },
              ]}
            />
          )}
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="hdd">
        <Accordion.Control icon={<IconDatabase />}>
          {i18n.t("server_info.HDD.title")}
        </Accordion.Control>
        <Accordion.Panel>
          <Grid>
            {data.disk &&
              data.disk.map((disk) => (
                <Grid.Col span={6} key={disk.filesystem}>
                  <StatsCircle
                    key={disk.filesystem}
                    title={disk.mountedOn}
                    total={disk.size}
                    sections={[
                      {
                        value: disk.used,
                        color: "cyan",
                        tooltip: i18n.t("server_info.HDD.chart.used", [
                          disk.used,
                        ]),
                      },
                      {
                        value: disk.available,
                        color: "orange",
                        tooltip: i18n.t("server_info.HDD.chart.available", [
                          disk.available,
                        ]),
                      },
                      {
                        value: disk.reserved,
                        color: "gray",
                        tooltip: i18n.t("server_info.HDD.chart.reserved", [
                          disk.reserved,
                        ]),
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
