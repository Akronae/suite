import "handsontable/dist/handsontable.full.min.css";

import { registerAllModules } from "handsontable/registry";
import { HotTable, HotTableClass } from "@handsontable/react";
import {
  checkboxRenderer,
  dateRenderer,
  numericRenderer,
  registerRenderer,
  textRenderer,
} from "handsontable/renderers";
import "./sheet.css";
import { useRef } from "react";
import { TextEditor } from "handsontable/editors";
import Core from "node_modules/handsontable/core";
import { CellProperties } from "node_modules/handsontable/settings";

class JSONEditor extends TextEditor {
  constructor(instance: Core) {
    super(instance);
  }

  prepare(
    row: number,
    column: number,
    prop: string | number,
    TD: HTMLTableCellElement,
    originalValue: any,
    cellProperties: CellProperties,
  ): void {
    super.prepare(
      row,
      column,
      prop,
      TD,
      JSON.stringify(originalValue),
      cellProperties,
    );
  }

  getValue() {
    if (typeof this.originalValue === "object") {
      return JSON.stringify(this.originalValue);
    }
    return super.getValue();
  }

  setValue(newValue: string) {
    super.setValue(newValue);
  }
}

registerAllModules();

export type SheetProps = {
  data: string[][];
  search?: string;
};
export function Sheet(props: SheetProps) {
  const { data, search } = props;
  const hot = useRef<HotTableClass>(null);

  const headers = data[0];
  let rows = data.slice(1);
  if (rows.length == 0) {
    rows = [headers.map(() => "")];
  }

  const ellipsis = (value: string) => {
    if (value.length > 100) {
      return value.slice(0, 100) + "...";
    }
    return value;
  };

  registerRenderer(
    "customRenderer",
    (instance, td, row, col, prop, value, cellProperties) => {
      switch (typeof value) {
        case "number":
          value = value.toFixed(6);
          numericRenderer(instance, td, row, col, prop, value, cellProperties);
          break;
        case "string":
          textRenderer(
            instance,
            td,
            row,
            col,
            prop,
            ellipsis(value),
            cellProperties,
          );
          break;
        case "boolean":
          checkboxRenderer(instance, td, row, col, prop, value, cellProperties);
          break;
        case "object":
          textRenderer(
            instance,
            td,
            row,
            col,
            prop,
            ellipsis(JSON.stringify(value)),
            cellProperties,
          );
          break;
        default:
          textRenderer(instance, td, row, col, prop, value, cellProperties);
          break;
      }
    },
  );

  const elem = (
    <HotTable
      renderer={"customRenderer"}
      editor={JSONEditor}
      colHeaders={headers}
      data={rows}
      rowHeaders={true}
      height={"100%"}
      stretchH="all"
      multiColumnSorting={true}
      fillHandle={false}
      style={{ height: "100%", width: "100%" }}
      ref={hot}
      licenseKey="non-commercial-and-evaluation"
    />
  );

  return elem;
}
