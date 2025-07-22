import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface IState {
  client: {
    fullname: string;
    email: string;
    password: string;
    phone: string;
    OTP: number;
  };
  toggleAuthPanel: boolean;
}

// Define the initial state using that type
const initialState: IState = {
  client: {
    fullname: "Reza Kamali",
    email: "rezakamali008@gmail.com",
    password: "@Root404",
    phone: "09931939362",
    OTP: 435856,
  },
  toggleAuthPanel: false,
};

export const authSlice = createSlice({
  name: "Auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateCLientData: (state, action) => {
      state.client = {
        ...state.client,
        ...action.payload,
      };
    },
    toggleAuth: (state) => {
      state.toggleAuthPanel = !state.toggleAuthPanel;
    },
  },
});

export const { updateCLientData, toggleAuth } = authSlice.actions;
export default authSlice.reducer;
