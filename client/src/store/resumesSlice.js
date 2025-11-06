import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../services/api"

export const fetchResumes = createAsyncThunk(
  "resumes/fetchResumes", 
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/resumes")
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch resumes")
    }
  }
)

export const uploadResume = createAsyncThunk(
  "resumes/uploadResume", 
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/resumes/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to upload resume")
    }
  }
)

export const deleteResume = createAsyncThunk(
  "resumes/deleteResume",
  async (resumeId, { rejectWithValue }) => {
    try {
      await api.delete(`/resumes/${resumeId}`)
      return resumeId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete resume")
    }
  }
)

const initialState = {
  resumes: [],
  loading: false,
  uploading: false,
  error: null,
  currentResume: null,
  suggestions: [],
  atsScore: null,
}

const resumesSlice = createSlice({
  name: "resumes",
  initialState,
  reducers: {
    clearResumeError: (state) => {
      state.error = null
    },
    setCurrentResume: (state, action) => {
      state.currentResume = action.payload
    },
    clearCurrentResume: (state) => {
      state.currentResume = null
    },
  },
  extraReducers: (builder) => {
    // Fetch Resumes
    builder
      .addCase(fetchResumes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.loading = false
        state.resumes = action.payload
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Upload Resume
    builder
      .addCase(uploadResume.pending, (state) => {
        state.uploading = true
        state.error = null
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.uploading = false
        state.resumes.unshift(action.payload)
        state.currentResume = action.payload
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.uploading = false
        state.error = action.payload
      })

    // Delete Resume
    builder
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.resumes = state.resumes.filter(resume => resume._id !== action.payload)
        if (state.currentResume?._id === action.payload) {
          state.currentResume = null
        }
      })
  },
})

export const { clearResumeError, setCurrentResume, clearCurrentResume } = resumesSlice.actions

export default resumesSlice.reducer
