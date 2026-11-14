import { createSlice, nanoid } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { toast: null },
  reducers: {
    showToast: {
      reducer(state, action) {
        state.toast = action.payload;
      },

      prepare(message, type = 'success') {
        return { payload: { id: nanoid(), message, type } };
      },
    },
    hideToast(state) {
      state.toast = null;
    },
  },
});

export const { showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer;
