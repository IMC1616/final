import authReducer from "../features/auth/authSlice";
import settingsReducer from "../features/settings/settingsSlice";
import modalReducer from "../features/modal/modalSlice";

const rootReducer = {
  auth: authReducer,
  settings: settingsReducer,
  settings: settingsReducer,
  modal: modalReducer,
};

export default rootReducer;
