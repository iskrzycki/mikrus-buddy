import { fetchMikrusAPI, ServerData } from "@/utils";
import React from "react";
import ServerInfoPanel from "./ServerInfoPanel";
import { Button, Grid } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ServerInfoProps {
  responseData: ServerData;
}

const restartServer = async () => {
  const { apiKey, serverId } = await browser.storage.sync.get([
    "apiKey",
    "serverId",
  ]);
  if (apiKey && serverId) {
    return await fetchMikrusAPI(apiKey, serverId, "restart");
  }
};

const ServerInfo: React.FC<ServerInfoProps> = ({ responseData }) => {
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: restartServer,
    onSuccess: () => console.log("Server restarted"),
    onError: (error) => console.error("Failed to restart server", error),
  });
  return (
    <>
      <Grid>
        <Grid.Col span={2}>
          <Button
            onClick={async () =>
              await queryClient.invalidateQueries({ queryKey: ["info"] })
            }
          >
            <IconRefresh />
          </Button>
        </Grid.Col>
        <Grid.Col span={2}>
          <Button
            loading={isPending}
            disabled={isPending}
            onClick={() => mutate()}
          >
            Restart server
          </Button>
        </Grid.Col>
      </Grid>
      <ServerInfoPanel responseData={responseData} />
    </>
  );
};

export default ServerInfo;
