import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { uploadResume } from '../store/resumesSlice';
import { toast } from 'react-toastify';
import { FaCloudUploadAlt, FaFilePdf, FaFileWord, FaFileAlt, FaTimes } from 'react-icons/fa';
import { ProgressBar } from 'react-bootstrap';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
};

const ResumeUploader = ({ onUploadSuccess }) => {
  const dispatch = useDispatch();
  const { uploading, error } = useSelector((state) => state.resumes);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        
        // Validate file type
        if (!Object.keys(ACCEPTED_FILE_TYPES).includes(selectedFile.type)) {
          toast.error('Invalid file type. Please upload a PDF, DOC, DOCX, or TXT file.');
          return;
        }

        // Validate file size
        if (selectedFile.size > MAX_FILE_SIZE) {
          toast.error('File size exceeds the maximum limit of 5MB');
          return;
        }

        setFile(selectedFile);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const resultAction = await dispatch(
        uploadResume({
          file: formData,
          onUploadProgress: (progress) => {
            setUploadProgress(progress);
          },
        })
      );

      if (uploadResume.fulfilled.match(resultAction)) {
        toast.success('Resume uploaded successfully!');
        setFile(null);
        setUploadProgress(0);
        if (onUploadSuccess) {
          onUploadSuccess(resultAction.payload);
        }
      } else if (uploadResume.rejected.match(resultAction)) {
        throw new Error(resultAction.payload || 'Failed to upload resume');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload resume');
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="text-danger" size={24} />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="text-primary" size={24} />;
      default:
        return <FaFileAlt className="text-secondary" size={24} />;
    }
  };

  return (
    <div className="resume-uploader">
      {!file ? (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''} ${isDragReject ? 'reject' : ''} ${
            dragActive ? 'drag-active' : ''
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-center p-4">
            <FaCloudUploadAlt size={48} className="mb-3 text-primary" />
            <h5>Drag & drop your resume here</h5>
            <p className="text-muted">or click to browse files</p>
            <p className="small text-muted">
              Supported formats: PDF, DOC, DOCX, TXT (Max 5MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="file-preview">
          <div className="d-flex justify-content-between align-items-center p-3 border rounded">
            <div className="d-flex align-items-center">
              {getFileIcon(file.name)}
              <div className="ms-3">
                <h6 className="mb-0">{file.name}</h6>
                <small className="text-muted">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </small>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={removeFile}
              disabled={uploading}
            >
              <FaTimes />
            </button>
          </div>

          {uploading && (
            <div className="mt-3">
              <div className="d-flex justify-content-between mb-2">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <ProgressBar now={uploadProgress} animated />
            </div>
          )}

          <div className="d-grid gap-2 mt-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Resume'}
            </button>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <style jsx>{`
        .dropzone {
          border: 2px dashed #dee2e6;
          border-radius: 8px;
          background-color: #f8f9fa;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .dropzone:hover,
        .dropzone.active {
          border-color: #0d6efd;
          background-color: rgba(13, 110, 253, 0.05);
        }
        .dropzone.reject {
          border-color: #dc3545;
          background-color: rgba(220, 53, 69, 0.05);
        }
        .file-preview {
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 1rem;
          background-color: #fff;
        }
      `}</style>
    </div>
  );
};

export default ResumeUploader;
