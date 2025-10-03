import { createSlice, type PayloadAction } from "@reduxjs/toolkit";// PayloadAction is a typescript type that defines the type of action payload

interface UserState {
  isLoggedIn: boolean,
  token: string | null;
  name: string | null;
  email: string | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  token: null,
  name: null,
  email: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: { //functions that handle state updates for actions
    login(state, action: PayloadAction<{token: string; name: string; email: string}>) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.name = null;
      state.email = null;
    }
  }
})

export const {login, logout} = userSlice.actions; //exporting actions created by createSlice
export default userSlice.reducer;