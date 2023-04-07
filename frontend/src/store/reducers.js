import authReducer from "../features/auth/authSlice";
import settingsReducer from "../features/settings/settingsSlice";

const rootReducer = {
  auth: authReducer,
  settings: settingsReducer,
};

export default rootReducer;
