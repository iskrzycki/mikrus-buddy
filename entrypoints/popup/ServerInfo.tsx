import { fetchMikrusAPI, getServerInfo } from "@/utils";
import { i18n } from "#i18n";
import React from "react";
import { Button, Center, Flex, Loader } from "@mantine/core";
import ServerInfoPanel from "./ServerInfoPanel";
import {
  IconPillFilled,
  IconRefresh,
  IconRefreshAlert,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchMikrusEndpoint = async (endpoint: "restart" | "amfetamina") => {
  const { apiKey, serverId } = await browser.storage.sync.get([
    "apiKey",
    "serverId",
  ]);
  if (apiKey && serverId) {
    return await fetchMikrusAPI(apiKey, serverId, endpoint);
  }
};

const serverInfoQuery = async () => {
  const { apiKey, serverId } = await browser.storage.sync.get([
    "apiKey",
    "serverId",
  ]);
  if (apiKey && serverId) {
    return await getServerInfo(apiKey, serverId);
  }
  return null;
};

const ServerInfo: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["info"],
    queryFn: serverInfoQuery,
    refetchOnWindowFocus: false,
  });

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
      {isLoading ? (
        <Center>
          <Loader size={50} />
        </Center>
      ) : (
        data && <ServerInfoPanel data={data} />
      )}
    </>
  );
};

export default ServerInfo;
