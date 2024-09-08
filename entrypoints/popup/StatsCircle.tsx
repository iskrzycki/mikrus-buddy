import { RingProgress, RingProgressProps, Text } from "@mantine/core";
import React from "react";

interface StatsCircleProps {
  title: string;
  total: number;
  sections: RingProgressProps["sections"];
}

const StatsCircle: React.FC<StatsCircleProps> = ({
  title,
  total,
  sections,
}) => {
  const calculatedSections = sections.map((section) => ({
    value: (100 * section.value) / total,
    color: section.color,
    tooltip: section.tooltip,
  }));

  return (
    <RingProgress
      size={170}
      thickness={16}
      label={
        <Text size="xs" ta="center" px="xs" style={{ pointerEvents: "none" }}>
          <b>{title}</b> (hover for details)
        </Text>
      }
      sections={calculatedSections}
    />
  );
};

export default StatsCircle;
