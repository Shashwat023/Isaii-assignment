import api, { uploadFile } from './api';

const RESUME_API = '/resumes';

/**
 * Upload a resume file
 * @param {FormData} formData - FormData containing the file and optional metadata
 * @param {Function} onUploadProgress - Optional progress callback
 * @returns {Promise<Object>} - Uploaded resume data
 */
export const uploadResume = async (formData, onUploadProgress) => {
  try {
    const response = await uploadFile(
      `${RESUME_API}/upload`,
      formData,
      onUploadProgress
    );
    return response;
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw error;
  }
};

/**
 * Get all resumes for the current user
 * @returns {Promise<Array>} - Array of resume objects
 */
export const getResumes = async () => {
  try {
    const response = await api.get(RESUME_API);
    return response.data;
  } catch (error) {
    console.error('Error fetching resumes:', error);
    throw error;
  }
};

/**
 * Get a specific resume by ID
 * @param {string} resumeId - ID of the resume to fetch
 * @returns {Promise<Object>} - Resume data
 */
export const getResumeById = async (resumeId) => {
  try {
    const response = await api.get(`${RESUME_API}/${resumeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching resume ${resumeId}:`, error);
    throw error;
  }
};

/**
 * Get resume suggestions
 * @param {string} resumeId - ID of the resume
 * @param {string} type - Type of suggestions to get (e.g., 'general', 'ats', 'keywords')
 * @returns {Promise<Object>} - Suggestions data
 */
export const getResumeSuggestions = async (resumeId, type = 'general') => {
  try {
    const response = await api.get(
      `${RESUME_API}/${resumeId}/suggestions?type=${type}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error getting suggestions for resume ${resumeId}:`, error);
    throw error;
  }
};

/**
 * Get ATS score for a resume
 * @param {string} resumeId - ID of the resume
 * @param {string} jobDescription - Optional job description for targeted scoring
 * @returns {Promise<Object>} - ATS score and feedback
 */
export const getAtsScore = async (resumeId, jobDescription = '') => {
  try {
    const response = await api.post(`${RESUME_API}/${resumeId}/ats-score`, {
      jobDescription,
    });
    return response.data;
  } catch (error) {
    console.error(`Error getting ATS score for resume ${resumeId}:`, error);
    throw error;
  }
};

/**
 * Get keyword analysis for a resume
 * @param {string} resumeId - ID of the resume
 * @param {string} jobDescription - Job description to compare against
 * @returns {Promise<Object>} - Keyword analysis results
 */
export const getKeywordAnalysis = async (resumeId, jobDescription = '') => {
  try {
    const response = await api.post(`${RESUME_API}/${resumeId}/keywords`, {
      jobDescription,
    });
    return response.data;
  } catch (error) {
    console.error(`Error getting keyword analysis for resume ${resumeId}:`, error);
    throw error;
  }
};

/**
 * Get action verbs suggestions for a resume
 * @param {string} resumeId - ID of the resume
 * @returns {Promise<Object>} - Action verbs suggestions
 */
export const getActionVerbs = async (resumeId) => {
  try {
    const response = await api.get(`${RESUME_API}/${resumeId}/action-verbs`);
    return response.data;
  } catch (error) {
    console.error(`Error getting action verbs for resume ${resumeId}:`, error);
    throw error;
  }
};

/**
 * Delete a resume
 * @param {string} resumeId - ID of the resume to delete
 * @returns {Promise<Object>} - Deletion status
 */
export const deleteResume = async (resumeId) => {
  try {
    const response = await api.delete(`${RESUME_API}/${resumeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting resume ${resumeId}:`, error);
    throw error;
  }
};

/**
 * Update resume metadata
 * @param {string} resumeId - ID of the resume to update
 * @param {Object} updates - Object containing fields to update
 * @returns {Promise<Object>} - Updated resume data
 */
export const updateResume = async (resumeId, updates) => {
  try {
    const response = await api.patch(`${RESUME_API}/${resumeId}`, updates);
    return response.data;
  } catch (error) {
    console.error(`Error updating resume ${resumeId}:`, error);
    throw error;
  }
};

const resumeService = {
  uploadResume,
  getResumes,
  getResumeById,
  getResumeSuggestions,
  getAtsScore,
  getKeywordAnalysis,
  getActionVerbs,
  deleteResume,
  updateResume,
};

export default resumeService;
