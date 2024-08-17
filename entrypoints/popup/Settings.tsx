import { useEffect } from "react";
import { useForm } from "@mantine/form";
import { TextInput, Button, PasswordInput } from "@mantine/core";

function Settings() {
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
    // TODO make api call to verify the api key and server id
    // TODO set store value to control tabs
    browser.storage.sync.set(values);
  };

  const onLogout = () => {
    form.reset();
    browser.storage.sync.set({ apiKey: undefined, serverId: undefined });
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
        <Button type="submit">Submit</Button>
      </form>
      <Button onClick={onLogout}>Logout</Button>
    </>
  );
}

export default Settings;
