import authReducer from "../features/auth/authSlice";
import customerReducer from "../features/customers/customerSlice";
import settingsReducer from "../features/settings/settingsSlice";
import modalReducer from "../features/modal/modalSlice";

const rootReducer = {
  auth: authReducer,
  customer: customerReducer,
  modal: modalReducer,
  settings: settingsReducer,
};

export default rootReducer;
