import { State } from "@/utils/state";
import { Row } from "./row";
import { ChipColor } from "./chip-color";

export type ChipColorPickerProps = {
  colors: string[];
  model: State<string>;
};
export function ChipColorPicker(props: ChipColorPickerProps) {
  const { colors, model } = props;
  return (
    <Row justifyContent="space-between">
      {colors.map((color) => (
        <ChipColor
          key={color}
          color={color}
          selected={model.value == color}
          onClick={() => (model.value = color)}
        />
      ))}
    </Row>
  );
}
