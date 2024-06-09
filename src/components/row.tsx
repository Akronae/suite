import * as React from "react";

export type RowProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  flex?: React.CSSProperties["flex"];
  alignContent?: React.CSSProperties["alignContent"];
  alignItems?: React.CSSProperties["alignItems"];
  alignSelf?: React.CSSProperties["alignSelf"];
  justifyContent?: React.CSSProperties["justifyContent"];
  gap?: React.CSSProperties["gap"];
  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
};

const Row = React.forwardRef<HTMLDivElement, RowProps>(
  (
    {
      style,
      children,
      flex,
      alignContent,
      alignItems,
      alignSelf,
      justifyContent,
      gap,
      width,
      height,
      ...props
    },
    ref
  ) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex,
          alignContent,
          alignItems,
          alignSelf,
          justifyContent,
          gap,
          width,
          height,
          ...style,
        }}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Row.displayName = "Row";

export { Row };
