// src/redux/slices/propertiesSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { url_v1 } from "@/config/urls"; // adjust import path

// --------------------------------------
// Types
// --------------------------------------
interface Property {
  id: number;
  title: string;
  property_type: string;
  property_status: string;
  property_status_label: string;
  formatted_price: string;
  total_price: number;
  monthly_rent: number | null;
  land_area: number;
  building_area: number;
  rooms_count: number;
  city: string;
  province: string;
  status: string;
  status_label: string;
  creator_name: string;
  consultant_company: string;
  views_count: number;
  is_featured: boolean;
  primary_image_url: string;
  created_at: string;
}

interface Meta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  has_more_pages: boolean;
  from: number;
  to: number;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  featured: number;
}

interface PropertiesResponse {
  success: boolean;
  message: string;
  data: {
    properties: {
      properties: Property[];
      meta: Meta;
    };
    stats: Stats;
  };
  timestamp: string;
}

interface PropertiesState {
  loading: boolean;
  error: string | null;
  properties: Property[];
  meta: Meta | null;
  stats: Stats | null;
}

// --------------------------------------
// Initial State
// --------------------------------------
const initialState: PropertiesState = {
  loading: false,
  error: null,
  properties: [],
  meta: null,
  stats: null,
};

// --------------------------------------
// Thunk (API call)
// --------------------------------------
export const fetchProperties = createAsyncThunk<
  PropertiesResponse,
  void,
  { rejectValue: string }
>("properties/fetchProperties", async (_, thunkAPI) => {
  try {
    const response = await axios.get(url_v1("/admin/properties/"));
    return response.data as PropertiesResponse;
    // eslint-disable-next-line
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to fetch properties"
    );
  }
});

// --------------------------------------
// Slice
// --------------------------------------
const propertiesSlice = createSlice({
  name: "properties",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Loading
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Success
      .addCase(
        fetchProperties.fulfilled,
        (state, action: PayloadAction<PropertiesResponse>) => {
          state.loading = false;
          state.properties = action.payload.data.properties.properties;
          state.meta = action.payload.data.properties.meta;
          state.stats = action.payload.data.stats;
        }
      )
      // Failure
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error";
      });
  },
});

export default propertiesSlice.reducer;
