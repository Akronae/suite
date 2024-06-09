import { State } from "@/utils/state";
import { atom, useAtom } from "jotai";
import { ComponentType } from "react";

export type Command = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  shortcut?: string;
  onSelect?: () => void;
};
export type CommandGroup = {
  label: string;
  commands: Command[];
};

export const commandAtom = atom<CommandGroup[]>([]);

export const useCommands = () => new State(useAtom(commandAtom));
