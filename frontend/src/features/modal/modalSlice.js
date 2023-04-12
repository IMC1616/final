import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showModal: false,
  component: null,
  type: null,
  data: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.showModal = true;
      state.component = action.payload.component;
      state.type = action.payload.type;
      state.data = action.payload.data || null;
    },
    closeModal: (state, action) => {
      state.showModal = false;
      state.component = null;
      state.type = null;
      state.data = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;

export const selectShowModal = (state) => state.modal.showModal;
export const selectModalComponent = (state) => state.modal.component;
export const selectModalType = (state) => state.modal.type;
export const selectModalData = (state) => state.modal.data;

export default modalSlice.reducer;
