import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../services/apiSlice";
import rtkQueryErrorLogger from "./middleware/rtkQueryErrorLogger";
import rootReducer from "./reducers";

const reducerList = {
  [apiSlice.reducerPath]: apiSlice.reducer,
  ...rootReducer,
};

const middlewareList = (getDefaultMiddleware) => [
  ...getDefaultMiddleware(),
  apiSlice.middleware,
  rtkQueryErrorLogger,
];

export const createStore = (preloadedState) =>
  configureStore({
    reducer: reducerList,
    middleware: middlewareList,
    devTools: process.env.NODE_ENV !== "production",
    preloadedState,
  });

export const store = createStore();
