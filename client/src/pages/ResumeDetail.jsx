"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getResumeSuggestions, resetResumeState } from "../store/resumeSlice"
import Navbar from "../components/Navbar"
import { toast } from 'react-toastify'

function ResumeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { resumes } = useSelector((state) => state.resumes)
  const { suggestions, loading, error } = useSelector((state) => state.resume)
  const resume = resumes.find((r) => r._id === id)
  const [activeTab, setActiveTab] = useState("suggestions")
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    return () => {
      dispatch(resetResumeState())
    }
  }, [dispatch])

  const handleGetSuggestions = async (type) => {
    try {
      setIsAnalyzing(true)
      await dispatch(getResumeSuggestions({ resumeId: id, type })).unwrap()
      setActiveTab("suggestions")
    } catch (error) {
      toast.error(error || 'Failed to get suggestions')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleKeywordAnalysis = async () => {
    try {
      setIsAnalyzing(true)
      await dispatch(getResumeSuggestions({ 
        resumeId: id, 
        type: 'keywords',
        jobDescription 
      })).unwrap()
      setActiveTab("suggestions")
    } catch (error) {
      toast.error(error || 'Failed to analyze keywords')
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (!resume) {
    return (
      <div className="bg-[var(--color-bg-primary)] min-h-screen flex items-center justify-center">
        <p>Resume not found</p>
      </div>
    )
  }

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button 
          onClick={() => navigate("/resume")} 
          className="text-[var(--color-accent-pink)] hover:text-[var(--color-accent-purple)] mb-6 transition-colors"
        >
          ← Back to Resumes
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resume Preview & Analysis */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{resume.fileName}</h2>
                <div className="flex gap-2">
                  <button 
                    className="btn-secondary text-sm"
                    onClick={() => document.getElementById('resume-upload').click()}
                  >
                    Update Resume
                  </button>
                  <input id="resume-upload" type="file" className="hidden" accept=".pdf,.doc,.docx" />
                </div>
              </div>
              
              <div className="bg-white text-black p-8 rounded-lg min-h-[500px] max-h-[600px] overflow-y-auto">
                {resume.content ? (
                  <pre className="whitespace-pre-wrap font-sans">{resume.content}</pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <p>No content available. Please upload a new version.</p>
                  </div>
                )}
              </div>
            </div>

            {/* ATS Score & Analysis */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Resume Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-[var(--color-accent-purple)] to-[var(--color-accent-pink)] p-4 rounded-lg text-white">
                  <p className="text-sm opacity-80">ATS Score</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold">87</span>
                    <span className="text-sm opacity-80 mb-1">/ 100</span>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-white h-full rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
                <div className="bg-[var(--color-bg-tertiary)] p-4 rounded-lg">
                  <p className="text-sm text-[var(--color-text-secondary)]">Keywords Match</p>
                  <p className="text-2xl font-bold">24/30</p>
                  <p className="text-sm text-green-400 mt-1">Good match for Software Engineer role</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Tools & Suggestions */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-bold mb-4">Resume Tools</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1 text-[var(--color-text-secondary)]">
                    Job Description (Optional)
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste job description to compare with your resume"
                    className="w-full p-3 bg-[var(--color-bg-secondary)] rounded-lg text-sm min-h-[100px]"
                  />
                </div>

                <button
                  onClick={() => handleKeywordAnalysis()}
                  disabled={isAnalyzing}
                  className="w-full btn-primary text-sm flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Keywords'
                  )}
                </button>
              </div>

              <div className="border-t border-white/10 my-4"></div>
              
              <div className="space-y-2">
                <button
                  onClick={() => handleGetSuggestions('ats')}
                  disabled={isAnalyzing}
                  className="w-full text-left p-3 bg-[var(--color-bg-tertiary)] rounded-lg hover:bg-[var(--color-bg-tertiary)]/80 transition text-sm flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--color-accent-purple)]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h.01a1 1 0 100-2H10V9z" clipRule="evenodd" />
                  </svg>
                  Check ATS Compatibility
                </button>
                
                <button
                  onClick={() => handleGetSuggestions('verbs')}
                  disabled={isAnalyzing}
                  className="w-full text-left p-3 bg-[var(--color-bg-tertiary)] rounded-lg hover:bg-[var(--color-bg-tertiary)]/80 transition text-sm flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--color-accent-pink)]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Improve Action Verbs
                </button>
                
                <button
                  onClick={() => handleGetSuggestions('star')}
                  disabled={isAnalyzing}
                  className="w-full text-left p-3 bg-[var(--color-bg-tertiary)] rounded-lg hover:bg-[var(--color-bg-tertiary)]/80 transition text-sm flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Add STAR Method Examples
                </button>
              </div>
            </div>

            {/* Suggestions Panel */}
            <div className={`card transition-all duration-300 ${suggestions?.length > 0 ? 'opacity-100' : 'opacity-50'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Suggestions</h3>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-[var(--color-accent-purple)]/20 text-[var(--color-accent-purple)] text-xs rounded-full">
                    {suggestions?.length || 0} items
                  </span>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-accent-pink)]"></div>
                </div>
              ) : suggestions?.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {suggestions.map((suggestion, idx) => (
                    <div 
                      key={idx} 
                      className="bg-[var(--color-bg-tertiary)] p-3 rounded-lg border-l-4 border-[var(--color-accent-pink)]"
                    >
                      <p className="text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[var(--color-text-secondary)]">
                  <p>Run an analysis to get suggestions for improving your resume</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ResumeDetail
