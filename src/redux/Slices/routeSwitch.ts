import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface IState {
  route: string;
}

// Define the initial state using that type
const initialState: IState = {
  route: "dashboard",
};

export const routeSwitch = createSlice({
  name: "routeSwitch",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    switchRoute: (state, action) => {
      state.route = action.payload;
    },
  },
});

export const { switchRoute } = routeSwitch.actions;
export default routeSwitch.reducer;
