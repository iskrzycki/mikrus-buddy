import { fetchMikrusAPI, ServerData } from "@/utils";
import React from "react";
import ServerInfoPanel from "./ServerInfoPanel";
import { Button, Flex } from "@mantine/core";
import { IconPill, IconRefresh, IconRefreshAlert } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ServerInfoProps {
  responseData: ServerData;
}

const fetchMikrusEndpoint = async (endpoint: "restart" | "amfetamina") => {
  const { apiKey, serverId } = await browser.storage.sync.get([
    "apiKey",
    "serverId",
  ]);
  if (apiKey && serverId) {
    return await fetchMikrusAPI(apiKey, serverId, endpoint);
  }
};

const ServerInfo: React.FC<ServerInfoProps> = ({ responseData }) => {
  const queryClient = useQueryClient();
  const { isPending: isRestartPending, mutate: restartServerMutate } =
    useMutation({
      mutationFn: () => fetchMikrusEndpoint("restart"),
      onSuccess: () => console.log("Server restarted"),
      onError: (error) => console.error("Failed to restart server", error),
    });
  const { isPending: isAmphetaminePending, mutate: getAmphetamineMutate } =
    useMutation({
      mutationFn: () => fetchMikrusEndpoint("amfetamina"),
      onSuccess: () => console.log("Amphetamine taken"),
      onError: (error) => console.error("Failed to get amphetamine", error),
    });

  return (
    <>
      <Flex justify="space-between">
        <Button
          rightSection={<IconRefresh size={14} />}
          onClick={async () =>
            await queryClient.invalidateQueries({ queryKey: ["info"] })
          }
        >
          Refresh
        </Button>
        <Button
          rightSection={<IconRefreshAlert size={14} />}
          loading={isRestartPending}
          disabled={isRestartPending}
          onClick={() => restartServerMutate()}
        >
          Restart server
        </Button>
        <Button
          rightSection={<IconPill size={14} />}
          loading={isAmphetaminePending}
          disabled={isAmphetaminePending}
          onClick={() => getAmphetamineMutate()}
        >
          Amphetamine
        </Button>
      </Flex>
      <ServerInfoPanel responseData={responseData} />
    </>
  );
};

export default ServerInfo;
