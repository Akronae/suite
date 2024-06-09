import { State } from "./state";
import { useState } from "./use-state";

export function useStateOr<T>(
  value: State<T> | undefined,
  fallback: T
): State<T> {
  const fallbackState = useState(fallback);
  return value ?? fallbackState;
}
