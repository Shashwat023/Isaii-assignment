import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Tabs, Tab, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaFilePdf, FaTrash, FaEdit, FaSearch, FaChartLine } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Components
import Navbar from '../components/Navbar';
import ResumeUploader from '../components/ResumeUploader';
import ResumeSuggestions from '../components/ResumeSuggestions';

// Redux
import { fetchResumes, deleteResume, setCurrentResume } from '../store/resumesSlice';

const ResumeManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resumes, loading, error, currentResume } = useSelector((state) => state.resumes);
  const [activeTab, setActiveTab] = useState('upload');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch resumes on component mount
  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  // Handle resume selection
  const handleResumeSelect = (resume) => {
    dispatch(setCurrentResume(resume));
    setActiveTab('suggestions');
  };

  // Handle resume deletion
  const handleDeleteResume = async (resumeId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await dispatch(deleteResume(resumeId)).unwrap();
        toast.success('Resume deleted successfully');
        if (currentResume?._id === resumeId) {
          dispatch(setCurrentResume(null));
        }
      } catch (error) {
        toast.error(error.message || 'Failed to delete resume');
      }
    }
  };

  // Handle successful upload
  const handleUploadSuccess = (resume) => {
    toast.success('Resume uploaded successfully!');
    dispatch(setCurrentResume(resume));
    setActiveTab('suggestions');
  };

  // Filter resumes based on search term
  const filteredResumes = resumes.filter((resume) =>
    resume.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resume.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get file icon based on file extension
  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFilePdf className="text-primary" />;
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="text-danger" />;
      case 'doc':
      case 'docx':
        return <FaFilePdf className="text-primary" />;
      default:
        return <FaFilePdf className="text-secondary" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Show loading state
  if (loading && resumes.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="resume-management">
      <Navbar />
      
      <Container fluid className="py-4">
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">My Resumes</h5>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => setActiveTab('upload')}
                >
                  <FaUpload className="me-1" /> Upload New
                </Button>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search resumes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="resume-list" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
                  {filteredResumes.length > 0 ? (
                    filteredResumes.map((resume) => (
                      <div 
                        key={resume._id}
                        className={`resume-item p-3 mb-2 border rounded ${currentResume?._id === resume._id ? 'bg-light' : 'bg-white'}`}
                        onClick={() => handleResumeSelect(resume)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              {getFileIcon(resume.filename)}
                            </div>
                            <div>
                              <h6 className="mb-0 text-truncate" style={{ maxWidth: '200px' }}>
                                {resume.filename || 'Untitled Resume'}
                              </h6>
                              <small className="text-muted">
                                {new Date(resume.uploadedAt || new Date()).toLocaleDateString()} • {formatFileSize(resume.size || 0)}
                              </small>
                            </div>
                          </div>
                          <div className="d-flex">
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="text-danger"
                              onClick={(e) => handleDeleteResume(resume._id, e)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">No resumes found</p>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => setActiveTab('upload')}
                      >
                        <FaUpload className="me-1" /> Upload Your First Resume
                      </Button>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={8}>
            <Card className="h-100">
              <Card.Header>
                <Tabs
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="mb-0"
                >
                  <Tab eventKey="upload" title="Upload Resume" />
                  <Tab 
                    eventKey="suggestions" 
                    title="Resume Analysis" 
                    disabled={!currentResume}
                  />
                </Tabs>
              </Card.Header>
              <Card.Body className="p-4">
                {activeTab === 'upload' && (
                  <div className="upload-container">
                    <div className="text-center mb-4">
                      <h4>Upload Your Resume</h4>
                      <p className="text-muted">Upload a PDF, DOC, DOCX, or TXT file to get started</p>
                    </div>
                    <ResumeUploader onUploadSuccess={handleUploadSuccess} />
                  </div>
                )}

                {activeTab === 'suggestions' && currentResume && (
                  <div className="suggestions-container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h4 className="mb-0">Resume Analysis</h4>
                        <small className="text-muted">{currentResume.filename}</small>
                      </div>
                      <div>
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          className="me-2"
                          onClick={() => setActiveTab('upload')}
                        >
                          <FaEdit className="me-1" /> Edit Resume
                        </Button>
                        <Button variant="primary" size="sm">
                          <FaChartLine className="me-1" /> View Full Report
                        </Button>
                      </div>
                    </div>
                    
                    <ResumeSuggestions resumeId={currentResume._id} />
                  </div>
                )}

                {activeTab === 'suggestions' && !currentResume && (
                  <div className="text-center py-5">
                    <div className="mb-3">
                      <FaSearch size={48} className="text-muted mb-3" />
                      <h4>No Resume Selected</h4>
                      <p className="text-muted">Select a resume from the list or upload a new one to view analysis</p>
                      <Button 
                        variant="primary" 
                        onClick={() => setActiveTab('upload')}
                      >
                        <FaUpload className="me-2" /> Upload Resume
                      </Button>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .resume-item {
          transition: all 0.2s ease;
        }
        .resume-item:hover {
          background-color: #f8f9fa !important;
          transform: translateX(2px);
        }
        .resume-list::-webkit-scrollbar {
          width: 6px;
        }
        .resume-list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .resume-list::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .resume-list::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        .nav-tabs .nav-link:not(.active) {
          color: #6c757d;
        }
        .nav-tabs .nav-link:not(.active):hover {
          border-color: transparent;
          color: #0d6efd;
        }
      `}</style>
    </div>
  );
      setIsUploading(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const file = e.dataTransfer.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB')
        return
      }
      setSelectedFile(file)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setResumeContent(e.target.result)
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="bg-[var(--color-bg-primary)] min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Resume Management</h1>
          <button 
            onClick={() => navigate('/resume/new')}
            className="btn-primary flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Resume
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Upload or Create Resume</h2>
              
              <div 
                className="border-2 border-dashed border-[var(--color-border)] rounded-lg p-8 text-center mb-6 cursor-pointer hover:border-[var(--color-accent-pink)] transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                />
                <div className="space-y-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    <span className="font-medium text-[var(--color-accent-pink)]">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">PDF, DOCX, or TXT (max. 5MB)</p>
                  {selectedFile && (
                    <p className="mt-2 text-sm text-green-400">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--color-border)]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]">
                    Or type your resume
                  </span>
                </div>
              </div>
              
              <form onSubmit={handleUpload} className="mt-6">
                <textarea
                  value={resumeContent}
                  onChange={(e) => setResumeContent(e.target.value)}
                  placeholder="Or paste your resume content here..."
                  className="w-full bg-[var(--color-bg-tertiary)] border border-white/10 rounded-lg px-4 py-4 text-white placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-pink)] focus:border-transparent resize-none transition-all"
                  rows="10"
                />
                <button 
                  type="submit" 
                  className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
                  disabled={isUploading || (!resumeContent.trim() && !selectedFile)}
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    'Upload Resume'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* AI Suggestions */}
          <div>
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">AI Suggestions</h2>
              <div className="space-y-4">
                <div className="bg-[var(--color-bg-tertiary)] p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Improve phrasing</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">Use stronger action verbs</p>
                </div>
                <div className="bg-[var(--color-bg-tertiary)] p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Add technical keywords</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">CI/CD, Docker, Kubernetes</p>
                </div>
                <div className="bg-[var(--color-bg-tertiary)] p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Quantify achievements</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">Add percentages and numbers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Resumes */}
        {resumes.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Your Resumes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resumes.map((resume) => (
                <div
                  key={resume._id}
                  className="card hover:border-[var(--color-accent-pink)] transition cursor-pointer"
                  onClick={() => navigate(`/resume/${resume._id}`)}
                >
                  <h3 className="font-bold mb-2">{resume.fileName}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                    ATS Score: <strong className="text-gradient">{resume.atsScore || 85}%</strong>
                  </p>
                  <button className="btn-primary w-full text-sm">View Details</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default ResumeManagement
