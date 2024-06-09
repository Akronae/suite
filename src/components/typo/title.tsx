import * as React from "react";

import { cn } from "@/lib/utils";

export type TitleSize =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl";

export interface TitleProps
  extends React.HtmlHTMLAttributes<HTMLHeadingElement> {
  size?: TitleSize;
}

const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, children, size = "5xl", style, ...props }, ref) => {
    const fontSize = {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
      "7xl": "4.5rem",
      "8xl": "6rem",
      "9xl": "8rem",
    }[size];
    return (
      <h1
        className={cn(`font-extrabold tracking-tight`, className)}
        ref={ref}
        style={{
          fontSize,
          lineHeight: 1,
          ...style,
        }}
        {...props}
      >
        {children}
      </h1>
    );
  }
);
Title.displayName = "Title";

export { Title };
