import { useEffect } from "react";
import { useForm } from "@mantine/form";
import { TextInput, Button, PasswordInput, Group } from "@mantine/core";
import { useQueryClient } from "react-query";
import { fetchMikrusAPI } from "@/utils";
import useStore from "./store";

function Settings() {
const queryClient = useQueryClient();
const { isValidKey, setIsValidKey, setActiveTab, reset } = useStore();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: { apiKey: "", serverId: "" },
    validate: {
      apiKey: (value) =>
        value.length !== 40 ? "API key must have 40 letters" : null,
      serverId: (value) =>
        value.length < 2 ? "ServerId must have at least 2 letters" : null,
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
    console.log("submit", values);
    await browser.storage.sync.set(values);
    console.log("fetching data");
    const data = await queryClient.fetchQuery({
      queryKey: "serwery",
      queryFn: () => fetchMikrusAPI(values.apiKey, values.serverId, "serwery"),
    });

    await browser.storage.sync.set({ isValidKey: data ? true : false });
setIsValidKey(data ? true : false);
    setActiveTab("info");
await queryClient.invalidateQueries("info");
    console.log(data);
  };

  const onLogout = async () => {
    form.reset();
await     browser.storage.sync.set({
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
<Group justify="center" mt="xl">
        <Button type="submit" disabled={isValidKey}>
Validate
</Button>
{/* TODO disable if logged out */}
<Button onClick={onLogout} disabled={!isValidKey}>
Logout
</Button>
      </Group>
      </form>
{/* WAITING FOR VERIFICATION */}
      {/* <a href="https://buycoffee.to/iskrzycki" target="_blank">
        <img
          src="https://buycoffee.to/img/share-button-primary.png"
          style={{ width: "156", height: "40" }}
          alt="Postaw mi kawę na buycoffee.to"
        />
      </a> */}
    </>
        );
}

export default Settings;
