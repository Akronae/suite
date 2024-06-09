import * as React from "react";

import { cn } from "@/lib/utils";
import { State } from "@/utils/state";
import { Row } from "../row";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  model?: State<string>;
  left?: React.ComponentType<any>;
  size?: "sm" | "md" | "lg";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, model, left: Left, size = "md", ...props }, ref) => {
    return (
      <Row
        className={cn(
          "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        style={{
          height: size === "sm" ? 30 : size === "md" ? 50 : 70,
        }}
        alignItems="center"
        gap={10}
      >
        {Left && (
          <Left
            className="text-muted-foreground"
            style={{
              height: size === "sm" ? 15 : size === "md" ? 30 : 40,
              aspectRatio: "1",
            }}
          />
        )}
        <input
          type={type}
          className={cn(
            "appearance-none bg-background shadow-none placeholder:text-muted-foreground outline-none border-none"
          )}
          style={{ outline: "none" }}
          ref={ref}
          value={model?.value}
          onChange={(e) => {
            if (model) {
              model.value = e.target.value;
            }
          }}
          {...props}
        />
      </Row>
    );
  }
);
Input.displayName = "Input";

export { Input };
