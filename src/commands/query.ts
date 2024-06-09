import { useAsync } from "@/utils/use-async";
import { invoke } from "@tauri-apps/api";

export async function query<T>(poolId: string, querystr: string) {
  console.log(poolId, querystr);
  const res = await invoke<T>("query", {
    poolId: poolId,
    query: querystr,
  });
  console.log(res);
  return res;
}

export function useQuery<T>(
  poolId: string,
  querystr: string,
  deps: unknown[] = [],
  options?: { enabled?: boolean }
) {
  const fullDeps = [poolId, querystr, ...deps];
  if (options?.enabled === false) return useAsync(async () => {}, fullDeps);
  return useAsync(async () => await query<T>(poolId, querystr), fullDeps);
}
