import { Alert, Loader, Text } from "@mantine/core";
import { browser } from "wxt/browser";

import { fetchMikrusAPI } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { IconInfoCircle } from "@tabler/icons-react";

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
      <Alert
        variant="light"
        color="blue"
        title="Logs"
        icon={<IconInfoCircle />}
        mb={50}
      >
        Work in progress!
      </Alert>
      {isLoading ? (
        <Loader />
      ) : (
        // TODO Log type
        data.map((log: any) => (
          <Text>
            {log.task} ({log.when_created})
          </Text>
        ))
      )}
    </>
  );
}

export default Logs;
