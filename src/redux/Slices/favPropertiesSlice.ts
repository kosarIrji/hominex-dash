/* eslint-disable */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { url_v1 } from "@/config/urls";

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
  rooms_count: number;
  city: string;
  province: string;
  views_count: number;
  is_featured: boolean;
  primary_image_url: string;
  creator_name: string;
  consultant_company: string;
  published_at: string;
}

interface Favorite {
  favorite_id: number;
  added_at: string;
  property: Property;
}

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface FavoritesResponse {
  success: boolean;
  message: string;
  data: {
    favorites: Favorite[];
    pagination: Pagination;
  };
  timestamp: string;
}

interface DeleteFavoriteResponse {
  success: boolean;
  message: string;
}

interface FavoritesState {
  favorites: Favorite[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  favorites: [],
  pagination: null,
  loading: false,
  error: null,
};

// Async thunk to fetch favorites
export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (
    { page = 1, token }: { page?: number; token: string },
    { rejectWithValue }
  ) => {
    try {
      const url = url_v1(`/user/favorites?page=${page}`);
      console.log("Request URL:", url); // Debug URL
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error ${res.status}`);
      }

      const data = await res.json();
      console.log("Fetch Favorites Response:", data); // Debug response
      return data; // Return full response for processing
    } catch (err) {
      console.error("Fetch Favorites Error:", err);
      return rejectWithValue(err);
    }
  }
);

// Async thunk to delete a favorite
export const deleteFavorite = createAsyncThunk(
  "favorites/deleteFavorite",
  async (
    { favoriteId, token }: { favoriteId: number; token: string },
    { rejectWithValue }
  ) => {
    try {
      const url = url_v1(`/user/favorites/${favoriteId}`);
      console.log("Delete Request URL:", url); // Debug URL
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error ${res.status}`);
      }

      const data = await res.json();
      console.log("Delete Favorite Response:", data); // Debug response
      return { favoriteId, message: data.message };
    } catch (err) {
      console.error("Delete Favorite Error:", err);
      return rejectWithValue(err);
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    clearFavorites(state) {
      state.favorites = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Favorites
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFavorites.fulfilled,
        (state, action: PayloadAction<FavoritesResponse>) => {
          state.loading = false;
          if (action.payload.data.pagination.current_page === 1) {
            // Replace favorites on first page
            state.favorites = action.payload.data.favorites;
          } else {
            // Append favorites for subsequent pages (infinite scroll)
            const existingIds = new Set(
              state.favorites.map((fav) => fav.favorite_id)
            );
            const newFavorites = action.payload.data.favorites.filter(
              (fav) => !existingIds.has(fav.favorite_id)
            );
            state.favorites = [...state.favorites, ...newFavorites];
          }
          state.pagination = action.payload.data.pagination;
        }
      )
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Favorite
    builder
      .addCase(deleteFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteFavorite.fulfilled,
        (
          state,
          action: PayloadAction<{ favoriteId: number; message: string }>
        ) => {
          state.loading = false;
          state.favorites = state.favorites.filter(
            (fav) => fav.favorite_id !== action.payload.favoriteId
          );
        }
      )
      .addCase(deleteFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
