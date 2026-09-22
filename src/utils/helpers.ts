export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};

export const generateSummary = (
  jobType: string,
  years: string,
  skills: string,
  industries: string,
  uniqueValue: string,
  proudOf: string
): string => {
  const parts: string[] = [];

  if (jobType && years) {
    parts.push(`Results-driven ${jobType} with ${years}+ years of experience`);
  } else if (jobType) {
    parts.push(`Dedicated ${jobType}`);
  }

  if (industries) {
    parts.push(`in the ${industries} industry`);
  }

  if (skills) {
    parts.push(`specializing in ${skills}`);
  }

  let summary = parts.length ? `${parts.join(' ')}. ` : '';

  if (uniqueValue) {
    summary += `${uniqueValue}. `;
  }

  if (proudOf) {
    summary += `Notable accomplishment: ${proudOf}. `;
  }

  summary += 'Committed to delivering high-quality results and driving continuous improvement.';

  return summary.trim();
};

export const improveText = (text: string): string => {
  let improved = text.trim();
  if (!improved) return '';

  improved = improved.replace(/^(i |we |my )/i, '');
  improved = improved.charAt(0).toUpperCase() + improved.slice(1);

  const replacements: Array<[RegExp, string]> = [
    [/\bgood\b/gi, 'excellent'],
    [/\bnice\b/gi, 'outstanding'],
    [/\bworked on\b/gi, 'spearheaded'],
    [/\bhelped\b/gi, 'facilitated'],
    [/\bmade\b/gi, 'developed'],
    [/\bdid\b/gi, 'executed'],
    [/\bused\b/gi, 'utilized'],
    [/\bfixed\b/gi, 'resolved'],
  ];

  replacements.forEach(([pattern, value]) => {
    improved = improved.replace(pattern, value);
  });

  if (!improved.endsWith('.') && !improved.endsWith('!')) {
    improved += '.';
  }

  return improved;
};

export const generateAchievementBullet = (impactType: string, change: string): string => {
  const verbs: Record<string, string> = {
    'Saved time': 'Reduced turnaround time by streamlining',
    'Reduced costs': 'Lowered operational costs through',
    'Increased productivity': 'Increased team productivity by implementing',
    'Built something new': 'Designed and delivered',
    'Automated a process': 'Automated',
    'Managed people': 'Led and mentored teams while delivering',
    'Improved customer experience': 'Improved customer experience by',
    Other: 'Delivered measurable impact through',
  };

  const prefix = verbs[impactType] || 'Delivered';
  const cleaned = change.trim().replace(/\.$/, '');
  return `${prefix} ${cleaned}.`;
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const formatDateYear = (dateStr: string): string => {
  if (!dateStr) return '';
  if (dateStr.length === 4) return dateStr;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.getFullYear().toString();
};

export const suggestedSkills: Record<string, string[]> = {
  'Programming Languages': ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin'],
  Frameworks: ['React', 'Angular', 'Vue.js', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', '.NET', 'FastAPI', 'Laravel'],
  Databases: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'Firebase', 'DynamoDB', 'Cassandra'],
  Cloud: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Jenkins', 'GitHub Actions'],
  'Operating Systems': ['Windows', 'Linux', 'macOS', 'Ubuntu', 'Windows Server'],
  Networking: ['TCP/IP', 'DNS', 'VPN', 'Firewalls', 'Routing', 'Switching'],
  DevOps: ['Git', 'Linux', 'Nginx', 'Apache', 'Ansible', 'Prometheus', 'Grafana', 'ELK Stack'],
  'Microsoft 365': ['Microsoft Word', 'Microsoft Excel', 'Microsoft PowerPoint', 'Microsoft Teams', 'SharePoint', 'Outlook'],
  'CRM / Support Systems': ['Salesforce', 'Zendesk', 'HubSpot', 'Jira', 'ServiceNow', 'Freshdesk'],
  'Other Tools': ['Figma', 'Adobe Photoshop', 'Postman', 'VS Code', 'Notion', 'Slack'],
  'Soft Skills': ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management', 'Adaptability', 'Critical Thinking', 'Creativity', 'Project Management', 'Attention to Detail'],
};

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'you', 'your', 'our', 'are', 'was', 'were', 'this', 'that',
  'from', 'have', 'has', 'will', 'can', 'into', 'able', 'using', 'use', 'used', 'work',
  'role', 'team', 'job', 'experience', 'required', 'requirements', 'skills', 'looking',
]);

export const extractKeywords = (text: string): string[] => {
  const knownSkills = Object.values(suggestedSkills).flat();
  const lower = text.toLowerCase();
  const matched = knownSkills.filter((skill) => lower.includes(skill.toLowerCase()));

  const extras = text
    .split(/[^a-zA-Z0-9.+#]+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word.toLowerCase()));

  return Array.from(new Set([...matched, ...extras.slice(0, 12)]));
};

export const findMissingSkills = (jobDescription: string, currentSkills: string[]): string[] => {
  const keywords = extractKeywords(jobDescription);
  const existing = new Set(currentSkills.map((skill) => skill.toLowerCase()));
  const knownSkills = Object.values(suggestedSkills).flat();

  return keywords.filter((keyword) => {
    const isKnown = knownSkills.some((skill) => skill.toLowerCase() === keyword.toLowerCase());
    return isKnown && !existing.has(keyword.toLowerCase());
  });
};

export const makeSummaryMoreProfessional = (summary: string): string => {
  if (!summary) return '';
  return improveText(
    summary
      .replace(/i am/gi, 'A motivated professional who is')
      .replace(/i have/gi, 'Brings')
      .replace(/i'm/gi, 'A')
  );
};

export const shortenText = (text: string): string => {
  if (!text) return '';
  const sentences = text.split('. ').filter(Boolean);
  if (sentences.length <= 2) return text;
  return `${sentences.slice(0, Math.max(2, Math.ceil(sentences.length / 2))).join('. ').replace(/\.$/, '')}.`;
};

export const tailorSummary = (
  currentSummary: string,
  jobTitle: string,
  industry: string,
  jobDescription: string
): string => {
  const keywords = extractKeywords(jobDescription).slice(0, 6);
  const focus = keywords.length ? ` Strong alignment with ${keywords.join(', ')}.` : '';
  const target = jobTitle ? ` Targeting ${jobTitle}${industry ? ` roles in ${industry}` : ''}.` : '';

  if (currentSummary) {
    return `${currentSummary.replace(/\.$/, '')}.${target}${focus}`.replace(/\s+/g, ' ').trim();
  }

  return generateSummary(jobTitle, '', keywords.join(', '), industry, '', '');
};

export const makeATSFriendlySummary = (summary: string, jobTitle: string, skills: string[]): string => {
  const skillLine = skills.slice(0, 8).join(', ');
  const title = jobTitle || 'professional';
  const base = summary || `Experienced ${title} with a proven record of delivering results.`;
  return `${base.replace(/\.$/, '')}. Core competencies: ${skillLine || title}.`.replace(/\s+/g, ' ').trim();
};
