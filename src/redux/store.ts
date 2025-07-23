import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Slices/authSlice";
import sidebarSlice from "./Slices/sidebar";
import routeSwitch from "./Slices/routeSwitch";

export const store = configureStore({
  reducer: {
    authSlice,
    sidebarSlice,
    routeSwitch,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
