import { Dispatch, SetStateAction } from "react";

export class State<T> extends Array {
  0: T;
  1: Dispatch<SetStateAction<T>>;

  constructor(state: [T, Dispatch<SetStateAction<T>>]) {
    super();
    this[0] = state[0];
    this[1] = state[1];
  }

  get value() {
    return this[0];
  }
  get set() {
    return this[1];
  }

  set value(value: T) {
    this.set(value);
  }
}
