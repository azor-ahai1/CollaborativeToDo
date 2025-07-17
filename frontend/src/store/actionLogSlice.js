import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  actions: [],
  loading: false,
  error: null,
};

const actionLogSlice = createSlice({
  name: 'actionLog',
  initialState,
  reducers: {
    setActions(state, action) {
      state.actions = action.payload;
      state.loading = false;
      state.error = null;
    },
    addAction(state, action) {
      state.actions.unshift(action.payload);
      if (state.actions.length > 20) state.actions.pop();
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setActions, addAction, setLoading, setError } = actionLogSlice.actions;
export const selectActions = (state) => state.actionLog.actions;
export const selectActionLogLoading = (state) => state.actionLog.loading;
export const selectActionLogError = (state) => state.actionLog.error;
export default actionLogSlice.reducer; 