import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Tabs, Tab, Badge, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaFilePdf, FaTrash, FaEdit, FaSearch, FaChartLine, FaFileWord, FaFileAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Components
import Navbar from '../components/Navbar';
import ResumeUploader from '../components/ResumeUploader';
import ResumeSuggestions from '../components/ResumeSuggestions';

// Redux
import { fetchResumes, deleteResume, setCurrentResume, uploadResume } from '../store/resumesSlice';

const ResumeManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resumes, loading, error, currentResume } = useSelector((state) => state.resumes);
  const [activeTab, setActiveTab] = useState('upload');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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
    (resume.content && resume.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get file icon based on file extension
  const getFileIcon = (fileName) => {
    if (!fileName) return <FaFileAlt className="text-primary" />;
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="text-danger" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="text-primary" />;
      default:
        return <FaFileAlt className="text-secondary" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0 || !bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle drag and drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
                    <Form.Control
                      type="text"
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
                                {new Date(resume.uploadedAt || new Date()).toLocaleDateString()} • {formatFileSize(resume.size)}
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
};

export default ResumeManagement;
