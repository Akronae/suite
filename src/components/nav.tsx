import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ScrollArea } from "./ui/scroll-area";
import { Col } from "./col";
import { State } from "@/utils/state";
import { useStateOr } from "@/utils/use-state-or";

export type NavLink = {
  title: string;
  label?: string;
  icon: LucideIcon;
  variant: "default" | "ghost";
};
export type NavProps = {
  isCollapsed: boolean;
  links: NavLink[];
  selected?: State<string | undefined>;
};

export function Nav({ links, selected: selectedProps }: NavProps) {
  const selected = useStateOr(selectedProps, undefined);

  return (
    <div className="group flex flex-col gap-4">
      <nav className="grid gap-1">
        <ScrollArea style={{ maxHeight: "89vh" }}>
          <Col>
            {links.map((link, index) => (
              <Link
                key={index}
                className={cn(
                  buttonVariants({ variant: link.variant, size: "sm" }),
                  "text-zinc-300",
                  selected.value === link.title && "bg-primary/20",
                  "justify-start",
                )}
                onClick={() => (selected.value = link.title)}
              >
                {link.title}
                {link.label && (
                  <span
                    className={cn(
                      "ml-auto",
                      link.variant === "default" &&
                        "text-background dark:text-white",
                    )}
                  >
                    {link.label}
                  </span>
                )}
              </Link>
            ))}
          </Col>
        </ScrollArea>
      </nav>
    </div>
  );
}
