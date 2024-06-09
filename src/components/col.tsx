import * as React from "react";
import { Row, RowProps } from "./row";

export type ColProps = RowProps & {};

const Col = React.forwardRef<HTMLDivElement, ColProps>(
  ({ style, ...props }, ref) => {
    return (
      <Row
        style={{
          flexDirection: "column",
          ...style,
        }}
        ref={ref}
        {...props}
      />
    );
  }
);
Col.displayName = "Col";

export { Col };
