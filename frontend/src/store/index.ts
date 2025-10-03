import {configureStore} from "@reduxjs/toolkit";
import userReducer from "./userSlice.ts";

export const store = configureStore({
  reducer: {
    user: userReducer // user slice reducer
  },
})

export type RootState = ReturnType<typeof store.getState>; //RootState is a typescript type that represents the entire redux state
//store.getState() returns the state object at runtime and ReturnType extracts its type
export type AppDispatch = typeof store.dispatch;//AppDispatch is a typescript type for dispatching actions
