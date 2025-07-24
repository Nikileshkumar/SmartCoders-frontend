import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ApplicationState {
  id: string | null;
  appid: string | null;
  journeytype: string | null;
}

const initialState: ApplicationState = {
  id: null,
  appid: null,
  journeytype: null,
};

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setApplicationData: (
      state,
      action: PayloadAction<{ id: string; appid: string; journeytype: string }>
    ) => {
      state.id = action.payload.id;
      state.appid = action.payload.appid;
      state.journeytype = action.payload.journeytype;
    },
    resetApplicationData: (state) => {
      state.id = null;
      state.appid = null;
      state.journeytype = null;
    },
  },
});

export const { setApplicationData, resetApplicationData } = applicationSlice.actions;
export default applicationSlice.reducer; 