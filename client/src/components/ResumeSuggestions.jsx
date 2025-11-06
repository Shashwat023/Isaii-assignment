import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Spinner, Alert, Tab, Tabs } from 'react-bootstrap';
import { FaLightbulb, FaStar, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getResumeSuggestions, getAtsScore, getKeywordAnalysis, getActionVerbs } from '../services/resumeService';
import { toast } from 'react-toastify';

const SuggestionCard = ({ title, description, type = 'info' }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-success me-2" />;
      case 'warning':
        return <FaLightbulb className="text-warning me-2" />;
      case 'danger':
        return <FaStar className="text-danger me-2" />;
      default:
        return <FaLightbulb className="text-info me-2" />;
    }
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-grow-1 ms-3">
            <h6 className="mb-1">{title}</h6>
            <p className="mb-0 text-muted small">{description}</p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const AtsScoreMeter = ({ score }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'danger';
  };

  const getScoreFeedback = (score) => {
    if (score >= 80) return 'Excellent! Your resume is well-optimized for ATS.';
    if (score >= 50) return 'Good, but could use some improvements.';
    return 'Needs significant improvements to pass ATS screening.';
  };

  return (
    <div className="text-center mb-4">
      <div className="position-relative d-inline-block mb-3">
        <svg width="120" height="120" viewBox="0 0 120 120" className="circular-progress">
          <circle
            className="bg-secondary"
            cx="60"
            cy="60"
            r="54"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle
            className={`text-${getScoreColor(score)}`}
            cx="60"
            cy="60"
            r="54"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="339.292"
            strokeDashoffset={339.292 * (1 - score / 100)}
            transform="rotate(-90 60 60)"
          />
          <text
            x="60"
            y="65"
            textAnchor="middle"
            fontSize="24"
            fontWeight="bold"
            className={`text-${getScoreColor(score)}`}
          >
            {score}
          </text>
        </svg>
      </div>
      <h5 className="mb-2">ATS Score</h5>
      <p className="text-muted">{getScoreFeedback(score)}</p>
    </div>
  );
};

const KeywordAnalysis = ({ keywords }) => {
  if (!keywords || keywords.length === 0) {
    return <p className="text-muted">No keyword analysis available.</p>;
  }

  return (
    <div>
      <h6 className="mb-3">Keywords Analysis</h6>
      <div className="d-flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <Badge
            key={index}
            bg={keyword.matched ? 'success' : 'secondary'}
            className="mb-2"
            style={{ fontSize: '0.9rem' }}
          >
            {keyword.term}
            {!keyword.matched && (
              <span className="ms-2">
                <FaArrowRight size={10} className="me-1" />
                <strong>{keyword.suggestion || 'Add'}</strong>
              </span>
            )}
          </Badge>
        ))}
      </div>
    </div>
  );
};

const ActionVerbs = ({ verbs }) => {
  if (!verbs || verbs.length === 0) {
    return <p className="text-muted">No action verb suggestions available.</p>;
  }

  return (
    <div>
      <h6 className="mb-3">Suggested Action Verbs</h6>
      <div className="d-flex flex-wrap gap-2">
        {verbs.map((verb, index) => (
          <Badge
            key={index}
            bg="info"
            className="mb-2"
            style={{ fontSize: '0.9rem' }}
          >
            {verb}
          </Badge>
        ))}
      </div>
    </div>
  );
};

const ResumeSuggestions = ({ resumeId }) => {
  const [activeTab, setActiveTab] = useState('suggestions');
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [atsScore, setAtsScore] = useState(0);
  const [keywords, setKeywords] = useState([]);
  const [actionVerbs, setActionVerbs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [suggestionsRes, atsRes, keywordsRes, verbsRes] = await Promise.all([
          getResumeSuggestions(resumeId),
          getAtsScore(resumeId),
          getKeywordAnalysis(resumeId),
          getActionVerbs(resumeId)
        ]);

        setSuggestions(suggestionsRes);
        setAtsScore(atsRes.score);
        setKeywords(keywordsRes.keywords || []);
        setActionVerbs(verbsRes.verbs || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setError('Failed to load suggestions. Please try again later.');
        toast.error('Failed to load suggestions');
      } finally {
        setLoading(false);
      }
    };

    if (resumeId) {
      fetchSuggestions();
    }
  }, [resumeId]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Analyzing your resume...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <div className="resume-suggestions">
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="suggestions" title="Suggestions">
          <div className="mt-4">
            <AtsScoreMeter score={atsScore} />
            
            <h5 className="mb-4">
              <FaLightbulb className="text-warning me-2" />
              Personalized Suggestions
            </h5>
            
            {suggestions.length > 0 ? (
              <div className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <SuggestionCard
                    key={index}
                    title={suggestion.title}
                    description={suggestion.description}
                    type={suggestion.type || 'info'}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted">No suggestions available at the moment.</p>
            )}
          </div>
        </Tab>
        
        <Tab eventKey="keywords" title="Keywords">
          <div className="mt-4">
            <KeywordAnalysis keywords={keywords} />
          </div>
        </Tab>
        
        <Tab eventKey="action-verbs" title="Action Verbs">
          <div className="mt-4">
            <ActionVerbs verbs={actionVerbs} />
          </div>
        </Tab>
      </Tabs>

      <style jsx>{`
        .circular-progress {
          transform: rotate(-90deg);
        }
        .circular-progress circle {
          transition: stroke-dashoffset 0.8s ease-in-out;
        }
        .suggestions-list {
          max-height: 500px;
          overflow-y: auto;
          padding-right: 10px;
        }
        .suggestions-list::-webkit-scrollbar {
          width: 6px;
        }
        .suggestions-list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .suggestions-list::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .suggestions-list::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default ResumeSuggestions;
