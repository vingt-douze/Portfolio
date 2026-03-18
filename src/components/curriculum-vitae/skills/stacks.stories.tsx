import type { Meta, StoryObj } from "@storybook/react";
import Stacks from "./Skills";

const meta = {
  title: "CurriculumVitae/Skills",
  component: Stacks,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Stacks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
