import { Alert } from "@mantine/core";
import { i18n } from "#i18n";
import { IconInfoCircle } from "@tabler/icons-react";

function CMD() {
  const icon = <IconInfoCircle />;
  return (
    <Alert variant="light" color="blue" title="CMD" icon={icon}>
      {i18n.t("cmd.not_supported")}
    </Alert>
  );
}

export default CMD;
