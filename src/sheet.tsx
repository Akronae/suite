import 'handsontable/dist/handsontable.full.min.css';

import { registerAllModules } from 'handsontable/registry';
import { HotTable } from '@handsontable/react';
import {registerRenderer,textRenderer,  } from 'handsontable/renderers';
import './sheet.css'

registerAllModules();

export type SheetProps = {
  data: string[][];
};
export function Sheet(props: SheetProps) {
  const {data} = props;
  
  const headers = data[0];
  const rows = data.slice(1);

  registerRenderer('customRenderer', (instance, td, row, col, prop, value, cellProperties) => {
    textRenderer(instance, td, row, col, prop, value, cellProperties);


    td.style.color = 'red';
  });

  return <HotTable
  // renderer={'customRenderer'}
  colHeaders={headers}
  data={rows}
  rowHeaders={true}
  height={"100%"}
  stretchH='last'
  filters={true}
  multiColumnSorting={true}
  fillHandle={false}
  style={{height: "100%", width: "100%"}}
  licenseKey="non-commercial-and-evaluation"
/>
}
