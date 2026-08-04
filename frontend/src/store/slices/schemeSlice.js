import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchSchemes = createAsyncThunk('schemes/fetchSchemes', async (params = {}, { rejectWithValue }) => {
  try {
    const response = await api.get('/schemes', { params });
    return response.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchScheme = createAsyncThunk('schemes/fetchScheme', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/schemes/${id}`);
    return response.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchCategories = createAsyncThunk('schemes/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/schemes/categories');
    return response.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const schemeSlice = createSlice({
  name: 'schemes',
  initialState: { schemes: [], selectedScheme: null, categories: [], loading: false, error: null, pagination: null, filters: {} },
  reducers: {
    setFilters: (s, a) => { s.filters = { ...s.filters, ...a.payload }; },
    clearFilters: (s) => { s.filters = {}; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchemes.pending, (s) => { s.loading = true; })
      .addCase(fetchSchemes.fulfilled, (s, a) => { s.loading = false; s.schemes = a.payload.data; s.pagination = a.payload.pagination; })
      .addCase(fetchSchemes.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchScheme.fulfilled, (s, a) => { s.selectedScheme = a.payload; })
      .addCase(fetchCategories.fulfilled, (s, a) => { s.categories = a.payload; });
  },
});

export const { setFilters, clearFilters } = schemeSlice.actions;
export default schemeSlice.reducer;
