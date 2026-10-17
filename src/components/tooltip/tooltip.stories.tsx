import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import Tooltip from "./Tooltip";

const meta = {
  title: "Tooltip/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Details",
    children: <p>Hi</p>,
    content: <p>Im a tooltip</p>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByRole("button", { name: "Details" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    trigger.focus();
    await userEvent.keyboard("{Enter}");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await waitFor(() => expect(canvas.getByText("Im a tooltip")).toBeVisible());
    await userEvent.click(canvasElement);
    await waitFor(() => expect(canvas.queryByText("Im a tooltip")).not.toBeInTheDocument());
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  },
};
