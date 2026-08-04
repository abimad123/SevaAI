import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { sidebarOpen: true, theme: 'dark', notifications: [], activeModal: null },
  reducers: {
    toggleSidebar: (s) => { s.sidebarOpen = !s.sidebarOpen; },
    setSidebarOpen: (s, a) => { s.sidebarOpen = a.payload; },
    addNotification: (s, a) => { s.notifications.unshift({ id: Date.now(), ...a.payload }); },
    removeNotification: (s, a) => { s.notifications = s.notifications.filter(n => n.id !== a.payload); },
    setModal: (s, a) => { s.activeModal = a.payload; },
  },
});

export const { toggleSidebar, setSidebarOpen, addNotification, removeNotification, setModal } = uiSlice.actions;
export default uiSlice.reducer;
