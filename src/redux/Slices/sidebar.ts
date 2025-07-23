import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface IState {
  value: boolean;
}

// Define the initial state using that type
const initialState: IState = {
  value: false,
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    toggleSidebar: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { toggleSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;
