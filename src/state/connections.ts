import { State } from "@/utils/state";
import { atom, useAtom } from "jotai";

export type Connection = {
  id: string;
};

export const connectionsAtom = atom<Connection[]>([]);

export const useConnections = () => new State(useAtom(connectionsAtom));
