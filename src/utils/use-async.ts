import { useEffect } from "react";
import { useState } from "./use-state";

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const state = useState<T | null>(null);
  const error = useState<unknown>(null);
  const loading = useState(false);

  async function execute() {
    loading.value = true;
    try {
      state.value = await fn();
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  useEffect(() => {
    execute();
  }, deps);

  return { value: state.value, error: error.value, loading: loading.value };
}
