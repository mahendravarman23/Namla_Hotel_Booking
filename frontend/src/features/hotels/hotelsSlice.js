import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hotelsApi } from '../../api.js';

export const PAGE_SIZE = 8;

export const fetchHotels = createAsyncThunk('hotels/fetchAll', async (filters = {}) => {
  const { data, total } = await hotelsApi.list(filters);
  return { data, total };
});

export const fetchHotel = createAsyncThunk('hotels/fetchOne', (id) => hotelsApi.get(id));

export const createHotel = createAsyncThunk('hotels/create', async (formData, { rejectWithValue }) => {
  try {
    return await hotelsApi.create(formData);
  } catch (err) {
    return rejectWithValue(err.data || { message: err.message });
  }
});

export const updateHotel = createAsyncThunk('hotels/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    return await hotelsApi.update(id, formData);
  } catch (err) {
    return rejectWithValue(err.data || { message: err.message });
  }
});

export const deleteHotel = createAsyncThunk('hotels/delete', async (id, { rejectWithValue }) => {
  try {
    await hotelsApi.remove(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  items: [],
  total: 0,
  listStatus: 'idle',
  listError: null,

  current: null,
  currentStatus: 'idle',
  currentError: null,

  saving: false,

  filters: { search: '', minPrice: '', maxPrice: '', page: 1 },
};

const hotelsSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    setFilter(state, action) {
      const { name, value } = action.payload;
      state.filters[name] = value;
      if (name !== 'page') state.filters.page = 1;
    },
    clearCurrent(state) {
      state.current = null;
      state.currentStatus = 'idle';
      state.currentError = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchHotels.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.items = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError = action.error.message;
      })

      .addCase(fetchHotel.pending, (state) => {
        state.currentStatus = 'loading';
        state.current = null;
        state.currentError = null;
      })
      .addCase(fetchHotel.fulfilled, (state, action) => {
        state.currentStatus = 'succeeded';
        state.current = action.payload;
        state.currentError = null;
      })
      .addCase(fetchHotel.rejected, (state, action) => {
        state.currentStatus = 'failed';
        state.currentError = action.error.message;
      })

      .addCase(createHotel.pending, (state) => {
        state.saving = true;
      })
      .addCase(createHotel.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(createHotel.rejected, (state, action) => {
        state.saving = false;
        state.listError = action.payload?.message || null;
      })
      .addCase(updateHotel.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateHotel.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(updateHotel.rejected, (state, action) => {
        state.saving = false;
        state.listError = action.payload?.message || null;
      })

      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.items = state.items.filter((hotel) => hotel.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      });
  },
});

export const { setFilter, clearCurrent } = hotelsSlice.actions;
export default hotelsSlice.reducer;
