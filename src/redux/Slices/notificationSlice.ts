// store/notificationsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { url_v1 } from "@/config/urls";
export interface NotificationSender {
  id: number;
  name: string;
  user_type: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  priority: string;
  is_read: boolean;
  direction: string;
  sender: NotificationSender;
  action_url: string;
  action_text: string;
  created_at: string;
  read_at: string | null;
}

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface Stats {
  total_received: number;
  total_sent: number;
  unread_received: number;
}

interface NotificationsState {
  notifications: Notification[];
  pagination: Pagination | null;
  stats: Stats | null;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  pagination: null,
  stats: null,
  loading: false,
  error: null,
};

// Async thunk to fetch notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await fetch(url_v1("/user/notifications"), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const data = await res.json();
      return data.data; // we only care about `data` object from API
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    markAsRead(state, action: PayloadAction<number>) {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif) notif.is_read = true;
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.pagination = action.payload.pagination;
        state.stats = action.payload.stats;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { markAsRead, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
