import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../services/api"

export const fetchReport = createAsyncThunk("reports/fetchReport", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/reports")
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch report")
  }
})

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    report: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReport.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.loading = false
        state.report = action.payload
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default reportsSlice.reducer
