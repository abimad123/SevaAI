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

export const renameSession = createAsyncThunk('chat/renameSession', async ({ sessionId, title }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/chat/sessions/${sessionId}`, { title });
    return { sessionId, title };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to rename session');
  }
});

export const deleteSession = createAsyncThunk('chat/deleteSession', async (sessionId, { rejectWithValue }) => {
  try {
    await api.delete(`/chat/sessions/${sessionId}`);
    return sessionId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete session');
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

export const fetchProposalHistory = createAsyncThunk('chat/fetchProposalHistory', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/chat/proposals/history');
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch proposal history');
  }
});

export const fetchProposalById = createAsyncThunk('chat/fetchProposalById', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/chat/proposals/${id}`);
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch proposal details');
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
    proposalHistory: [],
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
    truncateMessages: (state, action) => {
      state.messages = state.messages.slice(0, action.payload);
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
      .addCase(fetchSession.fulfilled, (s, a) => {
        s.currentSession = a.payload;
        s.currentSessionId = a.payload.sessionId;
        s.messages = a.payload.messages;
      })
      .addCase(renameSession.fulfilled, (s, a) => {
        const sess = s.sessions.find(x => x.sessionId === a.payload.sessionId);
        if (sess) sess.title = a.payload.title;
        if (s.currentSession && s.currentSession.sessionId === a.payload.sessionId) {
          s.currentSession.title = a.payload.title;
        }
      })
      .addCase(deleteSession.fulfilled, (s, a) => {
        s.sessions = s.sessions.filter(x => x.sessionId !== a.payload);
        if (s.currentSessionId === a.payload) {
          s.currentSessionId = null;
          s.currentSession = null;
          s.messages = [];
        }
      })
      .addCase(generateProposal.pending, (s) => { s.proposalLoading = true; s.proposal = null; })
      .addCase(generateProposal.fulfilled, (s, a) => {
        s.proposalLoading = false;
        s.proposal = a.payload;
        s.proposalHistory.unshift({
          _id: a.payload._id,
          title: a.payload.title,
          projectName: a.payload.projectName,
          focusArea: a.payload.focusArea,
          location: a.payload.location,
          generatedAt: a.payload.generatedAt
        });
      })
      .addCase(generateProposal.rejected, (s) => { s.proposalLoading = false; })
      .addCase(fetchProposalHistory.fulfilled, (s, a) => {
        s.proposalHistory = a.payload || [];
      })
      .addCase(fetchProposalById.pending, (s) => {
        s.proposalLoading = true;
        s.proposal = null;
      })
      .addCase(fetchProposalById.fulfilled, (s, a) => {
        s.proposalLoading = false;
        s.proposal = a.payload;
      })
      .addCase(fetchProposalById.rejected, (s) => {
        s.proposalLoading = false;
      });
  },
});

export const { startNewSession, setLanguage, addOptimisticMessage, truncateMessages, clearProposal } = chatSlice.actions;
export default chatSlice.reducer;
