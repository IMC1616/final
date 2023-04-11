import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showModal: false,
  type: null, // Puede ser "create", "edit" o "delete"
  data: null, // Puede ser un objeto con los datos del usuario o null
};

const userModalSlice = createSlice({
  name: "userModal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.showModal = true;
      state.type = action.payload.type;
      state.data = action.payload.data || null;
    },
    closeModal: (state, action) => {
      state.showModal = false;
      state.type = null;
      state.data = null;
    },
  },
});

export const { openModal, closeModal } = userModalSlice.actions;

export const selectShowModal = (state) => state.userModal.showModal;
export const selectModalType = (state) => state.userModal.type;
export const selectModalData = (state) => state.userModal.data;

export default userModalSlice.reducer;
