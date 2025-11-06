import natural from 'natural';
import { removeStopwords } from 'stopword';
import { WordTokenizer, PorterStemmer } from 'natural';

const tokenizer = new WordTokenizer();

// Common action verbs for resume enhancement
const ACTION_VERBS = [
  'achieved', 'administered', 'analyzed', 'built', 'collaborated', 'created',
  'delivered', 'designed', 'developed', 'engineered', 'enhanced', 'established',
  'expanded', 'generated', 'implemented', 'improved', 'increased', 'initiated',
  'introduced', 'launched', 'led', 'managed', 'optimized', 'orchestrated',
  'performed', 'produced', 'reduced', 'resolved', 'spearheaded', 'streamlined',
  'transformed', 'upgraded', 'utilized'
];

// Common ATS keywords by category
const ATS_KEYWORDS = {
  technical: [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'SQL',
    'AWS', 'Docker', 'Kubernetes', 'REST API', 'GraphQL', 'MongoDB', 'PostgreSQL',
    'Git', 'CI/CD', 'Agile', 'Scrum', 'TDD', 'Microservices'
  ],
  softSkills: [
    'Leadership', 'Communication', 'Teamwork', 'Problem Solving', 'Time Management',
    'Adaptability', 'Creativity', 'Critical Thinking', 'Decision Making', 'Collaboration'
  ]
};

/**
 * Analyze resume content and extract key information
 * @param {string} content - The text content of the resume
 * @returns {Object} Analysis results
 */
export async function analyzeResume(content) {
  // Tokenize and clean the content
  const tokens = tokenizeAndClean(content);
  
  // Extract key information
  const skills = extractSkills(tokens);
  const experience = extractExperience(content);
  const education = extractEducation(content);
  const actionVerbs = extractActionVerbs(tokens);
  
  // Calculate ATS score (simplified)
  const atsScore = calculateAtsScore(tokens);
  
  return {
    skills,
    experience,
    education,
    actionVerbs,
    atsScore,
    lastAnalyzed: new Date(),
  };
}

/**
 * Generate suggestions for improving the resume
 * @param {string} content - The text content of the resume
 * @param {string} type - Type of suggestions to generate (ats, verbs, star, general)
 * @param {string} jobDescription - Optional job description for targeted suggestions
 * @returns {Array} List of suggestions
 */
export async function generateSuggestions(content, type = 'general', jobDescription = '') {
  const tokens = tokenizeAndClean(content);
  const jobDescriptionTokens = jobDescription ? tokenizeAndClean(jobDescription) : [];
  
  switch (type) {
    case 'ats':
      return generateAtsSuggestions(tokens, jobDescriptionTokens);
    case 'verbs':
      return generateVerbSuggestions(tokens);
    case 'star':
      return generateStarSuggestions(content);
    case 'keywords':
      return generateKeywordSuggestions(tokens, jobDescriptionTokens);
    default:
      return generateGeneralSuggestions(tokens);
  }
}

// Helper functions
function tokenizeAndClean(text) {
  if (!text) return [];
  
  // Convert to lowercase and tokenize
  let tokens = tokenizer.tokenize(text.toLowerCase()) || [];
  
  // Remove stopwords and non-alphabetic tokens
  tokens = removeStopwords(tokens)
    .filter(token => /^[a-z]+$/.test(token) && token.length > 2);
  
  // Stem the tokens
  return tokens.map(token => PorterStemmer.stem(token));
}

function extractSkills(tokens) {
  // This is a simplified implementation
  // In a real app, you'd use a more sophisticated approach with a skills database
  const skills = [];
  
  // Check for technical skills
  ATS_KEYWORDS.technical.forEach(skill => {
    const skillTokens = tokenizeAndClean(skill);
    if (skillTokens.some(token => tokens.includes(token))) {
      skills.push(skill);
    }
  });
  
  return skills;
}

function extractExperience(content) {
  // This is a simplified implementation
  // In a real app, you'd use more sophisticated parsing or NLP
  const experience = [];
  const experienceRegex = /(?:work|experience|employment)[\s\S]*?(?=(?:education|skills|$))/i;
  const match = content.match(experienceRegex);
  
  if (match) {
    // Extract job titles and companies (simplified)
    const titleMatches = match[0].match(/(?:\n|^)\s*([A-Z][A-Za-z\s]+)(?:\s+at\s+|,|\()([A-Z][A-Za-z\s&,.]+)/g) || [];
    
    titleMatches.forEach(match => {
      const [_, title, company] = match.match(/([A-Z][A-Za-z\s]+)(?:\s+at\s+|,|\()([A-Z][A-Za-z\s&,.]+)/i) || [];
      if (title && company) {
        experience.push({
          title: title.trim(),
          company: company.replace(/[,\s\(].*$/, '').trim(),
        });
      }
    });
  }
  
  return experience;
}

function extractEducation(content) {
  // This is a simplified implementation
  const education = [];
  const educationRegex = /(?:education|academic)[\s\S]*?(?=(?:skills|experience|$))/i;
  const match = content.match(educationRegex);
  
  if (match) {
    // Extract degrees and institutions (simplified)
    const degreeMatches = match[0].match(/(?:\n|^)\s*([A-Z][A-Za-z\s]+)(?:\s+at\s+|,|\()([A-Z][A-Za-z\s&,.]+)/g) || [];
    
    degreeMatches.forEach(match => {
      const [_, degree, institution] = match.match(/([A-Z][A-Za-z\s]+)(?:\s+at\s+|,|\()([A-Z][A-Za-z\s&,.]+)/i) || [];
      if (degree && institution) {
        education.push({
          degree: degree.trim(),
          institution: institution.replace(/[,\s\(].*$/, '').trim(),
        });
      }
    });
  }
  
  return education;
}

function extractActionVerbs(tokens) {
  const verbCounts = {};
  
  tokens.forEach(token => {
    if (ACTION_VERBS.includes(token)) {
      verbCounts[token] = (verbCounts[token] || 0) + 1;
    }
  });
  
  return Object.entries(verbCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([verb, count]) => ({ verb, count }));
}

function calculateAtsScore(tokens) {
  // This is a simplified implementation
  // In a real app, you'd use a more sophisticated scoring system
  let score = 50; // Base score
  
  // Check for important sections
  const hasExperience = tokens.some(token => ['experienc', 'work', 'job'].includes(token));
  const hasEducation = tokens.some(token => ['educat', 'degree', 'school'].includes(token));
  const hasSkills = tokens.some(token => ['skill', 'technolog', 'tool'].includes(token));
  
  if (hasExperience) score += 15;
  if (hasEducation) score += 10;
  if (hasSkills) score += 10;
  
  // Check for action verbs
  const actionVerbs = extractActionVerbs(tokens);
  score += Math.min(actionVerbs.length * 2, 15); // Up to 15 points for action verbs
  
  return Math.min(Math.round(score), 100); // Cap at 100
}

function generateAtsSuggestions(tokens, jobDescriptionTokens = []) {
  const suggestions = [];
  
  // Check for missing sections
  const hasExperience = tokens.some(token => ['experienc', 'work', 'job'].includes(token));
  const hasEducation = tokens.some(token => ['educat', 'degree', 'school'].includes(token));
  const hasSkills = tokens.some(token => ['skill', 'technolog', 'tool'].includes(token));
  
  if (!hasExperience) suggestions.push("Add a dedicated 'Experience' section");
  if (!hasEducation) suggestions.push("Include your education details");
  if (!hasSkills) suggestions.push("Add a 'Skills' section with relevant technologies");
  
  // Check for job description keywords
  if (jobDescriptionTokens.length > 0) {
    const missingKeywords = ATS_KEYWORDS.technical.filter(keyword => 
      !tokens.includes(keyword.toLowerCase()) && 
      jobDescriptionTokens.some(jobToken => 
        jobToken === keyword.toLowerCase() || 
        keyword.toLowerCase().includes(jobToken) || 
        jobToken.includes(keyword.toLowerCase())
      )
    );
    
    if (missingKeywords.length > 0) {
      suggestions.push(
        `Add these relevant keywords from the job description: ${missingKeywords.slice(0, 5).join(', ')}`
      );
    }
  }
  
  // Add general ATS suggestions
  suggestions.push(
    "Use standard section headings like 'Experience', 'Education', and 'Skills'",
    "Include quantifiable achievements (e.g., 'Increased performance by 30%')",
    "Keep formatting simple and avoid using headers/footers"
  );
  
  return suggestions.slice(0, 5); // Return top 5 suggestions
}

function generateVerbSuggestions(tokens) {
  const suggestions = [];
  const weakVerbs = ['did', 'made', 'helped', 'worked', 'got', 'got to', 'had', 'had to'];
  
  // Find weak verbs in the resume
  const foundWeakVerbs = weakVerbs.filter(verb => tokens.includes(verb));
  
  if (foundWeakVerbs.length > 0) {
    suggestions.push(
      `Replace weak verbs like '${foundWeakVerbs[0]}' with stronger action verbs`,
      `Consider using more specific and impactful verbs to describe your achievements`
    );
  }
  
  // Add general verb suggestions
  suggestions.push(
    "Start bullet points with action verbs in past tense for past roles",
    "Use present tense for current roles",
    "Vary your action verbs to make your resume more engaging"
  );
  
  return suggestions.slice(0, 5);
}

function generateStarSuggestions() {
  return [
    "Use the STAR method (Situation, Task, Action, Result) to structure your bullet points",
    "For each achievement, explain the situation, your role, the actions you took, and the results you achieved",
    "Quantify your achievements with specific numbers and metrics when possible",
    "Focus on outcomes and impact rather than just responsibilities",
    "Use action verbs to start each bullet point in your experience section"
  ];
}

function generateKeywordSuggestions(tokens, jobDescriptionTokens) {
  if (jobDescriptionTokens.length === 0) {
    return generateGeneralSuggestions(tokens);
  }
  
  // Find common technical terms in the job description
  const jobTechTerms = ATS_KEYWORDS.technical.filter(term => 
    jobDescriptionTokens.some(token => 
      term.toLowerCase().includes(token) || 
      token.includes(term.toLowerCase())
    )
  );
  
  // Find missing keywords
  const missingKeywords = jobTechTerms.filter(term => 
    !tokens.some(token => 
      term.toLowerCase().includes(token) || 
      token.includes(term.toLowerCase())
    )
  );
  
  return [
    `Add these relevant keywords from the job description: ${missingKeywords.slice(0, 5).join(', ')}`,
    "Ensure your skills section includes the required technologies",
    "Incorporate key terms naturally throughout your experience section",
    "Highlight relevant projects that demonstrate your expertise in these areas"
  ];
}

function generateGeneralSuggestions() {
  return [
    "Keep your resume concise (1-2 pages maximum)",
    "Use bullet points for better readability",
    "Include quantifiable achievements with numbers and metrics",
    "Tailor your resume for each job application",
    "Use a clean, professional format with consistent formatting"
  ];
}
