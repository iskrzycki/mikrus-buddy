import { Alert } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";

function CMD() {
  const icon = <IconInfoCircle />;
  return (
    <Alert variant="light" color="blue" title="CMD" icon={icon}>
      CMD not supported yet
    </Alert>
  );
}

export default CMD;