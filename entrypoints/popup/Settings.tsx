import { useEffect } from "react";
import { i18n } from "#i18n";
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
        value.trim().length !== 40 ? i18n.t("settings.validate.api_key") : null,
      serverId: (value) =>
        value.trim().length < 2 ? i18n.t("settings.validate.server_id") : null,
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
          label={i18n.t("settings.form.api_key")}
          placeholder={i18n.t("settings.form.api_key")}
          key={form.key("apiKey")}
          {...form.getInputProps("apiKey")}
        />
        <TextInput
          mt="md"
          label={i18n.t("settings.form.server_id")}
          placeholder={i18n.t("settings.form.server_id")}
          key={form.key("serverId")}
          {...form.getInputProps("serverId")}
        />
        <Text pt={10} c="red">
          {error}
        </Text>
        <Group justify="center" mt="xl">
          <Button type="submit" disabled={isValidKey}>
            {i18n.t("settings.form.validate")}
          </Button>
          <Button onClick={onLogout} disabled={!isValidKey}>
            {i18n.t("settings.form.logout")}
          </Button>
        </Group>
      </form>
      <Grid mt={230} align="center">
        <Grid.Col span={5}>
          <Text>
            {i18n.t("settings.info.author")}:{" "}
            <Anchor href="https://github.com/iskrzycki" target="_blank">
              Rafał Iskrzycki
            </Anchor>
          </Text>
          <Text>
            {i18n.t("settings.info.version")}:{" "}
            {browser.runtime.getManifest().version}
          </Text>
          {/* TODO consider linking repo here */}
        </Grid.Col>
        <Grid.Col span={4} offset={3}>
          <Anchor href="https://buycoffee.to/iskrzycki" target="_blank">
            <Image
              src="https://buycoffee.to/img/share-button-primary.png"
              alt={i18n.t("settings.info.coffee")}
              w={130}
            />
          </Anchor>
        </Grid.Col>
      </Grid>
    </>
  );
}

export default Settings;
