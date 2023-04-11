import authReducer from "../features/auth/authSlice";
import settingsReducer from "../features/settings/settingsSlice";
import userModalReducer from "../features/users/userModalSlice";

const rootReducer = {
  auth: authReducer,
  settings: settingsReducer,
  settings: settingsReducer,
  userModal: userModalReducer,
};

export default rootReducer;
