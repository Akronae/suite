import React from "react";

export function useAddEventListener<K extends keyof DocumentEventMap>(
  type: K,
  listener: (this: Document, ev: DocumentEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void {
  const lastListener = React.useRef(listener);
  React.useEffect(() => {
    document.removeEventListener(type, lastListener.current, options);
    document.addEventListener(type, listener, options);
    return () => document.removeEventListener(type, listener, options);
  }, [type, listener, options]);
}
