import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchCustomerCI: "",
  selectedCategory: "",
  searchMeterCode: "",
  selectedMeterStatus: "",
};

const customerFiltersSlice = createSlice({
  name: "customerFilters",
  initialState,
  reducers: {
    setSearchCustomerCI: (state, action) => {
      state.searchCustomerCI = action.payload;
    },
    setSearchMeterCode: (state, action) => {
      state.searchMeterCode = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedMeterStatus: (state, action) => {
      state.selectedMeterStatus = action.payload;
    },
  },
});

export const {
  setSearchCustomerCI,
  setSelectedCategory,
  setSearchMeterCode,
  setSelectedMeterStatus,
} = customerFiltersSlice.actions;

export default customerFiltersSlice.reducer;
