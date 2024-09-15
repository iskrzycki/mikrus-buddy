import { useEffect } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Button,
  PasswordInput,
  Group,
  Text,
  Image,
  Anchor,
  Grid,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import packageJson from "../../package.json";

import { fetchMikrusAPI } from "@/utils";
import useStore from "./store";

function Settings() {
  const queryClient = useQueryClient();
  const { isValidKey, setIsValidKey, setActiveTab, reset } = useStore();
  const [error, setError] = useState("");

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      apiKey: "",
      serverId: "",
    },
    validate: {
      apiKey: (value) =>
        value.trim().length !== 40 ? "API key must have 40 letters" : null,
      serverId: (value) =>
        value.trim().length < 2
          ? "ServerId must have at least 2 letters"
          : null,
    },
  });

  useEffect(() => {
    browser.storage.sync.get(["apiKey", "serverId"]).then(async (result) => {
      if (result.apiKey && result.serverId) {
        try {
          form.setValues(result);
        } catch (e) {
          console.log("Failed to parse stored value");
        }
      }
    });
  }, []);

  const onSubmit = async (values: Record<string, any>) => {
    setError("");
    const { apiKey, serverId } = {
      apiKey: values.apiKey.trim(),
      serverId: values.serverId.trim(),
    };
    await browser.storage.sync.set({ apiKey, serverId });

    const data = await queryClient.fetchQuery({
      queryKey: ["serwery"],
      queryFn: () => fetchMikrusAPI(apiKey, serverId, "serwery"),
    });
    console.log("data", data);
    const isSuccess = Array.isArray(data);

    await browser.storage.sync.set({
      isValidKey: isSuccess,
    });
    setIsValidKey(isSuccess);
    if (isSuccess) {
      setActiveTab("info");
      await queryClient.invalidateQueries({ queryKey: ["info"] });
    } else {
      setError(data.error);
      console.log("error", data);
      // TODO: consider https://mantine.dev/x/notifications/
    }
  };

  const onLogout = async () => {
    form.reset();
    await browser.storage.sync.set({
      apiKey: undefined,
      serverId: undefined,
      isValidKey: false,
    });
    setIsValidKey(false);
    reset();
  };

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <PasswordInput
          label="API key"
          placeholder="API key"
          key={form.key("apiKey")}
          {...form.getInputProps("apiKey")}
        />
        <TextInput
          mt="md"
          label="Server ID"
          placeholder="Server ID"
          key={form.key("serverId")}
          {...form.getInputProps("serverId")}
        />
        <Text pt={10} c="red">
          {error}
        </Text>
        <Group justify="center" mt="xl">
          <Button type="submit" disabled={isValidKey}>
            Validate
          </Button>
          <Button onClick={onLogout} disabled={!isValidKey}>
            Logout
          </Button>
        </Group>
      </form>
      <Grid mt={230} align="center">
        <Grid.Col span={5}>
          <Text>
            Author:{" "}
            <Anchor href="https://github.com/iskrzycki" target="_blank">
              Rafał Iskrzycki
            </Anchor>
          </Text>
          <Text>App version: {packageJson.version}</Text>
          {/* TODO consider linking repo here */}
        </Grid.Col>
        <Grid.Col span={4} offset={3}>
          <Anchor href="https://buycoffee.to/iskrzycki" target="_blank">
            <Image
              src="https://buycoffee.to/img/share-button-primary.png"
              alt="Buy me a coffee"
              w={130}
            />
          </Anchor>
        </Grid.Col>
      </Grid>
    </>
  );
}

export default Settings;
