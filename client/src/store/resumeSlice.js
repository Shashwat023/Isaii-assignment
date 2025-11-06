import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import resumeService from '../services/resumeService';

// Async thunks
export const uploadResume = createAsyncThunk(
  'resume/upload',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await resumeService.uploadResume(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload resume');
    }
  }
);

export const getResumeSuggestions = createAsyncThunk(
  'resume/getSuggestions',
  async ({ resumeId, type = 'general' }, { rejectWithValue }) => {
    try {
      const response = await resumeService.getResumeSuggestions(resumeId, type);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get suggestions');
    }
  }
);

const initialState = {
  resume: null,
  suggestions: [],
  atsScore: null,
  keywordAnalysis: null,
  actionVerbs: [],
  loading: false,
  error: null,
  success: false,
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    resetResumeState: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.resume = action.payload;
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getResumeSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getResumeSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload.suggestions;
      })
      .addCase(getResumeSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetResumeState } = resumeSlice.actions;
export default resumeSlice.reducer;
