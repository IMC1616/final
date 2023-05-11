import authReducer from "../features/auth/authSlice";
import customerReducer from "../features/customers/customerSlice";
import customerFiltersReducer from "../features/customers/customerFiltersSlice";
import settingsReducer from "../features/settings/settingsSlice";
import modalReducer from "../features/modal/modalSlice";
import invoiceFiltersReducer from "../features/invoices/invoiceFiltersSlice";

const rootReducer = {
  auth: authReducer,
  customer: customerReducer,
  customerFilters: customerFiltersReducer,
  modal: modalReducer,
  settings: settingsReducer,
  invoiceFilters: invoiceFiltersReducer,
};

export default rootReducer;
