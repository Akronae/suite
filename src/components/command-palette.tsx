"use client";

import * as React from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useAddEventListener } from "@/utils/use-add-event-listener";
import { useState } from "@/utils/use-state";
import { useCommands } from "@/state/commands";

export function CommandPalette() {
  const open = useState(false);
  const commands = useCommands();

  useAddEventListener("keydown", (e) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      open.value = !open.value;
    }
  });

  return (
    <CommandDialog open={open.value} onOpenChange={open.set}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList style={{ zIndex: 300 }}>
        <CommandEmpty>No results found.</CommandEmpty>
        {commands.value.map((group) => (
          <>
            <CommandGroup key={group.label} heading={group.label}>
              {group.commands.map((command) => (
                <CommandItem
                  key={command.label}
                  onSelect={() => {
                    command.onSelect?.();
                    open.value = false;
                  }}
                >
                  {<command.icon className="mr-2 h-4 w-4" />}
                  <span>{command.label}</span>
                  {command.shortcut && (
                    <CommandShortcut>{command.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
