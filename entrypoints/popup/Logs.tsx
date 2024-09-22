import { HoverCard, Loader, Table, Text } from "@mantine/core";
import { browser } from "wxt/browser";
import { i18n } from "#i18n";

import { fetchMikrusAPI } from "@/utils";
import { useQuery } from "@tanstack/react-query";

interface Log {
  id: string;
  server_id: string;
  task: string;
  when_created: string;
  when_done: string;
  output: string;
}

const logsQuery = async () => {
  const { apiKey, serverId } = await browser.storage.sync.get([
    "apiKey",
    "serverId",
  ]);
  if (apiKey && serverId) {
    return await fetchMikrusAPI(apiKey, serverId, "logs");
  }
  return null;
};

function Logs() {
  const { data, isLoading } = useQuery({
    queryKey: ["logs"],
    queryFn: logsQuery,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : data ? (
        <Table
          striped
          highlightOnHover
          withColumnBorders
          withTableBorder
          verticalSpacing={"xs"}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{i18n.t("logs.task")}</Table.Th>
              <Table.Th>{i18n.t("logs.created_at")}</Table.Th>
              <Table.Th>{i18n.t("logs.done_at")}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((log: Log) => (
              <HoverCard width={280} shadow="xl">
                <HoverCard.Target>
                  <Table.Tr key={log.id} className="prevent-select">
                    <Table.Td>{log.task}</Table.Td>
                    <Table.Td>{log.when_created}</Table.Td>
                    <Table.Td>{log.when_done}</Table.Td>
                  </Table.Tr>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text size="sm">{log.output}</Text>
                </HoverCard.Dropdown>
              </HoverCard>
            ))}
          </Table.Tbody>
        </Table>
      ) : null}
    </>
  );
}

export default Logs;
