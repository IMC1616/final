// src/features/customer/customerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedProperty: null,
  selectedMeter: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    selectProperty: (state, action) => {
      state.selectedProperty = action.payload;
    },
    selectMeter: (state, action) => {
      state.selectedMeter = action.payload;
    },
  },
});

export const { selectProperty, selectMeter } = customerSlice.actions;

export const selectSelectedProperty = (state) => state.customer.selectedProperty;
export const selectSelectedMeter = (state) => state.customer.selectedMeter;

export default customerSlice.reducer;
