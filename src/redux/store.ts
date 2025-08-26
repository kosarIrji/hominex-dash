import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Slices/authSlice";
import sidebarSlice from "./Slices/sidebar";
import routeSwitch from "./Slices/routeSwitch";
import Notification from "./Slices/notificationSlice";
import favoritesSlice from "./Slices/favPropertiesSlice"; // Import the reducer

export const store = configureStore({
  reducer: {
    authSlice,
    sidebarSlice,
    routeSwitch,
    Notification,
    favorites: favoritesSlice, // Use the favorites reducer
  },
  // No need for RTK Query middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
