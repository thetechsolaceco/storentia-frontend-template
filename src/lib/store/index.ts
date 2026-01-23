import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import storeReducer from "./storeSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    store: storeReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
