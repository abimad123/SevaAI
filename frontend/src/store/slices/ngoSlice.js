import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchNGOs = createAsyncThunk('ngo/fetchNGOs', async (params = {}, { rejectWithValue }) => {
  try {
    const response = await api.get('/ngo', { params });
    return response.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchMyNGO = createAsyncThunk('ngo/fetchMyNGO', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/ngo/my');
    return response.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchNGO = createAsyncThunk('ngo/fetchNGO', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/ngo/${id}`);
    return response.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createNGO = createAsyncThunk('ngo/createNGO', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/ngo', data);
    return response.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateNGO = createAsyncThunk('ngo/updateNGO', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/ngo/${id}`, data);
    return response.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const ngoSlice = createSlice({
  name: 'ngo',
  initialState: { ngos: [], myNGO: null, selectedNGO: null, loading: false, error: null, pagination: null },
  reducers: { clearNGOError: (s) => { s.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNGOs.pending, (s) => { s.loading = true; })
      .addCase(fetchNGOs.fulfilled, (s, a) => { s.loading = false; s.ngos = a.payload.data; s.pagination = a.payload.pagination; })
      .addCase(fetchNGOs.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchMyNGO.fulfilled, (s, a) => { s.myNGO = a.payload; })
      .addCase(fetchNGO.fulfilled, (s, a) => { s.selectedNGO = a.payload; })
      .addCase(createNGO.fulfilled, (s, a) => { s.myNGO = a.payload; })
      .addCase(updateNGO.fulfilled, (s, a) => { s.myNGO = a.payload; });
  },
});

export const { clearNGOError } = ngoSlice.actions;
export default ngoSlice.reducer;
