import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { v4 as uuidv4 } from 'uuid';

export const sendMessage = createAsyncThunk('chat/sendMessage', async ({ message, sessionId, language, context }, { rejectWithValue }) => {
  try {
    const response = await api.post('/chat/message', { message, sessionId, language, context });
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to send message');
  }
});

export const fetchSessions = createAsyncThunk('chat/fetchSessions', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/chat/sessions');
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch sessions');
  }
});

export const fetchSession = createAsyncThunk('chat/fetchSession', async (sessionId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/chat/sessions/${sessionId}`);
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const generateProposal = createAsyncThunk('chat/generateProposal', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post('/chat/generate-proposal', data);
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to generate proposal');
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    sessions: [],
    currentSession: null,
    currentSessionId: null,
    messages: [],
    loading: false,
    sendingMessage: false,
    error: null,
    proposal: null,
    proposalLoading: false,
    language: 'en',
  },
  reducers: {
    startNewSession: (state) => {
      state.currentSessionId = uuidv4();
      state.currentSession = null;
      state.messages = [];
      state.error = null;
    },
    setLanguage: (state, action) => { state.language = action.payload; },
    addOptimisticMessage: (state, action) => {
      state.messages.push({ role: 'user', content: action.payload, timestamp: new Date().toISOString() });
    },
    clearProposal: (state) => { state.proposal = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (s) => { s.sendingMessage = true; s.error = null; })
      .addCase(sendMessage.fulfilled, (s, a) => {
        s.sendingMessage = false;
        s.currentSessionId = a.payload.sessionId;
        s.messages.push(a.payload.message);
      })
      .addCase(sendMessage.rejected, (s, a) => { s.sendingMessage = false; s.error = a.payload; })
      .addCase(fetchSessions.fulfilled, (s, a) => { s.sessions = a.payload; })
      .addCase(fetchSession.fulfilled, (s, a) => { s.currentSession = a.payload; s.messages = a.payload.messages; })
      .addCase(generateProposal.pending, (s) => { s.proposalLoading = true; s.proposal = null; })
      .addCase(generateProposal.fulfilled, (s, a) => { s.proposalLoading = false; s.proposal = a.payload; })
      .addCase(generateProposal.rejected, (s) => { s.proposalLoading = false; });
  },
});

export const { startNewSession, setLanguage, addOptimisticMessage, clearProposal } = chatSlice.actions;
export default chatSlice.reducer;
