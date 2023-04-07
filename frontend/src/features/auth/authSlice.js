import { createSlice } from "@reduxjs/toolkit";

const storeAuth = (user, token) => {
  window.localStorage.setItem("user", JSON.stringify(user));
  window.localStorage.setItem("token", token);
};

const restoreAuth = () => {
  const user = JSON.parse(window.localStorage.getItem("user"));
  const token = window.localStorage.getItem("token");
  return { user, token };
};

const clearAuth = () => {
  window.localStorage.removeItem("user");
  window.localStorage.removeItem("token");
};

const authSlice = createSlice({
  name: "auth",
  initialState: restoreAuth(),
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      storeAuth(user, token);
    },
    logOut: (state, action) => {
      state.user = null;
      state.token = null;
      clearAuth();
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;

export default authSlice.reducer;
