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
  responseData: ServerData;
}

const ServerInfoPanel: React.FC<ServerInfoPanelProps> = ({ responseData }) => {
  return (
    <Accordion defaultValue="info" mt={20}>
      <Accordion.Item value="info">
        <Accordion.Control icon={<IconDeviceDesktopAnalytics />}>
          {i18n.t("server_info.info.title")}
        </Accordion.Control>
        <Accordion.Panel>
          <Text>
            <strong>{i18n.t("server_info.info.server_id")}:</strong>{" "}
            {responseData.server_id}
          </Text>
          {responseData.server_name && (
            <Text>
              <strong>{i18n.t("server_info.info.server_name")}:</strong>{" "}
              {responseData.server_name}
            </Text>
          )}
          <Text>
            <strong>{i18n.t("server_info.info.expires_at")}:</strong>{" "}
            {responseData.expires.split(" ")[0]}
          </Text>
          <Text>
            <strong>{i18n.t("server_info.info.expires_storage_at")}: </strong>
            {responseData.expires_storage
              ? responseData.expires_storage.split(" ")[0]
              : i18n.t("server_info.info.no_storage")}
          </Text>
          <Text>
            <strong>{i18n.t("server_info.info.ram")}:</strong>{" "}
            {responseData.param_ram} MB
          </Text>
          <Text>
            <strong>{i18n.t("server_info.info.hdd")}:</strong>{" "}
            {responseData.param_disk} GB
          </Text>
          <Text>
            {/* TODO consider using <Badge /> here */}
            <strong>{i18n.t("server_info.info.mikrus_pro")}:</strong>{" "}
            {responseData.mikrus_pro}
          </Text>
          <Text>
            <strong>{i18n.t("server_info.info.uptime")}:</strong>{" "}
            {responseData.uptime}
          </Text>
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item value="ram">
        <Accordion.Control icon={<IconCpu />}>
          {i18n.t("server_info.RAM.title")}
        </Accordion.Control>
        <Accordion.Panel>
          {responseData.memory && (
            <StatsCircle
              title={i18n.t("server_info.RAM.chart.title")}
              total={responseData.memory.total}
              sections={[
                {
                  value: responseData.memory.used,
                  color: "cyan",
                  tooltip: i18n.t("server_info.RAM.chart.used", [
                    responseData.memory.used,
                  ]),
                },
                {
                  value: responseData.memory.free,
                  color: "orange",
                  tooltip: i18n.t("server_info.RAM.chart.free", [
                    responseData.memory.free,
                  ]),
                },
                {
                  value: responseData.memory.buffCache,
                  color: "grape",
                  tooltip: i18n.t("server_info.RAM.chart.buff", [
                    responseData.memory.buffCache,
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
