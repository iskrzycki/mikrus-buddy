import type { Meta, StoryObj } from "@storybook/react";

import StatsCircle from "../entrypoints/popup/StatsCircle";

const meta = {
  title: "Example/StatsCircle",
  component: StatsCircle,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  args: {
    sections: [],
    title: "RAM (hover for details)",
  },
} satisfies Meta<typeof StatsCircle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
  args: {
    sections: [
      {
        value: 20,
        color: "cyan",
        tooltip: "Used (50 mb)",
      },
      {
        value: 40,
        color: "orange",
        tooltip: "Free (50 mb)",
      },
      {
        value: 30,
        color: "grape",
        tooltip: "Buff/cache (50 mb)",
      },
    ],
  },
};

export const LoggedOut: Story = {};
