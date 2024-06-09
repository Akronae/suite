import * as React from "react";
import { State } from "./state";

export function useState<T>(value: T): State<T> {
  return new State(React.useState(value));
}
