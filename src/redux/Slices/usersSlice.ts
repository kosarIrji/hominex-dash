import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface IState {
  users: [
    {
      id: number;
      full_name: string;
      phone: string;
      email: string;
      user_type: string;
      is_active: boolean;
      phone_verified_at: string;
      properties_count: number;
      consultant: string | null;
    }
  ];
}

// Define the initial state using that type
const initialState: IState = {
  users: [
    {
      id: 0,
      full_name: "",
      user_type: "regular",
      email: "",
      phone: "",
      is_active: false,
      phone_verified_at: "",
      properties_count: 0,
      consultant: "",
    },
  ],
};

export const authSlice = createSlice({
  name: "Users",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateCLientData: (state, action) => {
      state.users = [{ ...action.payload }];
    },
  },
});

export const { updateCLientData } = authSlice.actions;
export default authSlice.reducer;
