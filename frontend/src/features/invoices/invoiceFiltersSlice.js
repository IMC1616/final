import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  meterCode: "",
  startDate: null,
  endDate: null,
  pendingOnly: false,
  group: true,
};

const invoiceFiltersSlice = createSlice({
  name: "invoiceFilters",
  initialState,
  reducers: {
    setMeterCode: (state, action) => {
      state.meterCode = action.payload;
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    setStatus: (state, action) => {
      state.pendingOnly = action.payload;
    },
    setGroup: (state, action) => {
      state.group = action.payload;
    },
  },
});

export const {
  setMeterCode,
  setStartDate,
  setEndDate,
  setStatus,
  setGroup,
} = invoiceFiltersSlice.actions;

export const selectInvoiceFilters = (state) => state.invoiceFilters;

export const selectMeterCode = (state) => state.invoiceFilters.meterCode;
export const selectStartDate = (state) => state.invoiceFilters.startDate;
export const selectEndDate = (state) => state.invoiceFilters.endDate;
export const selectStatus = (state) => state.invoiceFilters.pendingOnly;
export const selectGroup = (state) => state.invoiceFilters.group;

export default invoiceFiltersSlice.reducer;
