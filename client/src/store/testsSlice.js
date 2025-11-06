import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../services/api"

export const fetchTests = createAsyncThunk("tests/fetchTests", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/tests")
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to fetch tests")
  }
})

export const createTest = createAsyncThunk("tests/createTest", async (testData, { rejectWithValue }) => {
  try {
    const response = await api.post("/tests", testData)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to create test")
  }
})

export const updateTest = createAsyncThunk("tests/updateTest", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/tests/${id}`, data)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Failed to update test")
  }
})

const testsSlice = createSlice({
  name: "tests",
  initialState: {
    tests: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTests.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchTests.fulfilled, (state, action) => {
        state.loading = false
        state.tests = action.payload
      })
      .addCase(fetchTests.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createTest.fulfilled, (state, action) => {
        state.tests.push(action.payload)
      })
      .addCase(updateTest.fulfilled, (state, action) => {
        const index = state.tests.findIndex((t) => t._id === action.payload._id)
        if (index !== -1) {
          state.tests[index] = action.payload
        }
      })
  },
})

export default testsSlice.reducer
