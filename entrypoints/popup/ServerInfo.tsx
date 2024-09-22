import { fetchMikrusAPI, ServerData } from "@/utils";
import { i18n } from "#i18n";
import React from "react";
import { Button, Flex } from "@mantine/core";
import ServerInfoPanel from "./ServerInfoPanel";
import {
  IconPillFilled,
  IconRefresh,
  IconRefreshAlert,
} from "@tabler/icons-react";
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
          {i18n.t("server_info.controls.refresh")}
        </Button>
        <Button
          rightSection={<IconRefreshAlert size={14} />}
          loading={isRestartPending}
          disabled={isRestartPending}
          onClick={() => restartServerMutate()}
        >
          {i18n.t("server_info.controls.restart")}
        </Button>
        <Button
          rightSection={<IconPillFilled size={14} />}
          loading={isAmphetaminePending}
          disabled={isAmphetaminePending}
          onClick={() => getAmphetamineMutate()}
        >
          {i18n.t("server_info.controls.amphetamine")}
        </Button>
      </Flex>
      <ServerInfoPanel responseData={responseData} />
    </>
  );
};

export default ServerInfo;
