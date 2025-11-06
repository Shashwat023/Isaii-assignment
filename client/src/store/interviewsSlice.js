import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../services/api"

export const fetchInterviews = createAsyncThunk("interviews/fetchInterviews", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/interviews")
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch interviews")
  }
})

export const createInterview = createAsyncThunk("interviews/createInterview", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post("/interviews", data)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to create interview")
  }
})

const interviewsSlice = createSlice({
  name: "interviews",
  initialState: {
    interviews: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterviews.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.loading = false
        state.interviews = action.payload
      })
      .addCase(fetchInterviews.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createInterview.fulfilled, (state, action) => {
        state.interviews.push(action.payload)
      })
  },
})

export default interviewsSlice.reducer
