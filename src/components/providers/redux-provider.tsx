"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { fetchStoreInfo } from "@/lib/store/storeSlice";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(fetchStoreInfo());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
