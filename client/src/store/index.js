import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import testsReducer from "./testsSlice"
import interviewsReducer from "./interviewsSlice"
import resumesReducer from "./resumesSlice"
import reportsReducer from "./reportsSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    tests: testsReducer,
    interviews: interviewsReducer,
    resumes: resumesReducer,
    reports: reportsReducer,
  },
})

export default store
