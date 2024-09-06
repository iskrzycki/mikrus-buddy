import { RingProgress, RingProgressProps, Text } from "@mantine/core";
import React from "react";

interface StatsCircleProps {
  title: string;
  sections: RingProgressProps["sections"];
}

const StatsCircle: React.FC<StatsCircleProps> = ({ title, sections }) => {
  return (
    <RingProgress
      size={170}
      thickness={16}
      label={
        <Text size="xs" ta="center" px="xs" style={{ pointerEvents: "none" }}>
          {title}
        </Text>
      }
      sections={sections}
    />
  );
};

export default StatsCircle;

// [
//     {
//       value:
//         (100 * parseFloat(responseData.disk.used)) /
//         parseFloat(responseData.disk.total),
//       color: "cyan",
//       tooltip: `Used (${responseData.disk.used} Gb)`,
//     },
//     {
//       value:
//         (100 * parseFloat(responseData.disk.available)) /
//         parseFloat(responseData.disk.total),
//       color: "orange",
//       tooltip: `Available (${responseData.disk.available} Gb)`,
//     },
//     {
//       value:
//         (100 * parseFloat(responseData.disk.reserved)) /
//         parseFloat(responseData.disk.total),
//       color: "gray",
//       tooltip: `Reserved (${responseData.disk.reserved} Gb)`,
//     },
//   ]
