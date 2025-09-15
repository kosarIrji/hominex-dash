// authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { url_v1 } from "@/config/urls";

// Define a type for the slice state
interface IClient {
  id: number;
  phone: string;
  email: string;
  password: string;
  full_name: string;
  user_type: string;
  profile_picture: string;
  is_active: boolean;
  phone_verified_at: string;
  created_at: string;
  age: number;
  marital_status: string;
  job_title: string;
  residence_province: string;
  residence_city: string;
  education_level?:
    | "under_diploma"
    | "diploma"
    | "associate"
    | "bachelor"
    | "master"
    | "phd";
  national_code?: string;
  address?: string;
  monthly_income?:
    | "under_5m"
    | "5m_to_10m"
    | "10m_to_20m"
    | "20m_to_50m"
    | "over_50m";
  consultant: null;
  stats: {
    created_properties_count: number;
    approved_properties_count: number;
    pending_properties_count: number;
    favorites_count: number;
    unread_notifications_count: number;
  };
}

interface IState {
  client: IClient;
  toggleAuthPanel: boolean;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: IState = {
  client: {
    id: 0,
    phone: "",
    email: "",
    password: "",
    full_name: "",
    user_type: "",
    profile_picture: "https://avatar.iran.liara.run/username?username=",
    is_active: false,
    phone_verified_at: "",
    created_at: "",
    age: 0,
    marital_status: "",
    job_title: "",
    residence_province: "",
    residence_city: "",
    consultant: null,
    stats: {
      created_properties_count: 0,
      approved_properties_count: 0,
      pending_properties_count: 0,
      favorites_count: 0,
      unread_notifications_count: 0,
    },
  },
  toggleAuthPanel: true,
  loading: false,
  error: null,
};

// ✅ Thunk to fetch profile data
export const fetchClientProfile = createAsyncThunk(
  "auth/fetchClientProfile",
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await fetch(url_v1("/user/profile"), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        return rejectWithValue("خطا دریافت اطلاعات");
      }

      const { data } = await res.json();
      return data; // This will go into fulfilled payload
    } catch (error) {
      return rejectWithValue(error || "Request failed");
    }
  }
);

export const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    updateCLientData: (state, action: PayloadAction<Partial<IClient>>) => {
      state.client = {
        ...state.client,
        ...action.payload,
      };
    },
    toggleAuth: (state) => {
      state.toggleAuthPanel = !state.toggleAuthPanel;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.client = { ...state.client, ...action.payload };
      })
      .addCase(fetchClientProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateCLientData, toggleAuth } = authSlice.actions;
export default authSlice.reducer;
