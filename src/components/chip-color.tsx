import { HtmlHTMLAttributes } from "react";

export type ChipColorProps = HtmlHTMLAttributes<HTMLDivElement> & {
  color: string;
  selected?: boolean;
};
export function ChipColor(props: ChipColorProps) {
  const { color, selected, style, ...rest } = props;
  return (
    <div
      style={{
        width: 25,
        aspectRatio: 1,
        borderRadius: 100,
        backgroundColor: color,
        cursor: "pointer",
        ...style,
      }}
      className={selected ? "border-2 border-primary" : ""}
      {...rest}
    />
  );
}
