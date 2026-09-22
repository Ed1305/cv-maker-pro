export interface PersonalInfo {
  fullName: string;
  firstName: string;
  lastName: string;
  professionalTitle: string;
  phone: string;
  email: string;
  city: string;
  country: string;
  address: string;
  linkedinUrl: string;
  portfolioUrl: string;
  githubUrl: string;
  photoUrl: string;
  dateOfBirth: string;
  nationality: string;
  twitterUrl: string;
}

export interface ProfessionalSummary {
  summary: string;
  jobType: string;
  yearsExperience: string;
  strongestSkills: string;
  industries: string;
  uniqueValue: string;
  proudOf: string;
}

export interface WorkExperience {
  id: string;
  companyName: string;
  jobTitle: string;
  location: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  responsibilities: string[];
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  qualification: string;
  fieldOfStudy: string;
  startYear: string;
  graduationYear: string;
  currentlyStudying: boolean;
  grade: string;
  coursework: string;
  academicAchievements: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'language' | 'tool';
  proficiency: 'beginner' | 'intermediate' | 'advanced';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  role: string;
  technologies: string;
  problem: string;
  contribution: string;
  projectUrl: string;
  githubUrl: string;
  date: string;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  dateObtained: string;
  expirationDate: string;
  credentialId: string;
  credentialUrl: string;
}

export interface Language {
  id: string;
  language: string;
  level: 'native' | 'fluent' | 'professional' | 'intermediate' | 'basic';
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
}

export interface VolunteerExperience {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
  achievements: string[];
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface JobTarget {
  jobTitle: string;
  industry: string;
  roleType: string;
  jobDescription: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  professionalSummary: ProfessionalSummary;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  achievements: Achievement[];
  volunteerExperience: VolunteerExperience[];
  references: Reference[];
  includeReferences: boolean;
  jobTarget: JobTarget;
  selectedTemplate: string;
}

export const defaultCVData: CVData = {
  personalInfo: {
    fullName: '',
    firstName: '',
    lastName: '',
    professionalTitle: '',
    phone: '',
    email: '',
    city: '',
    country: '',
    address: '',
    linkedinUrl: '',
    portfolioUrl: '',
    githubUrl: '',
    photoUrl: '',
    dateOfBirth: '',
    nationality: '',
    twitterUrl: '',
  },
  professionalSummary: {
    summary: '',
    jobType: '',
    yearsExperience: '',
    strongestSkills: '',
    industries: '',
    uniqueValue: '',
    proudOf: '',
  },
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  achievements: [],
  volunteerExperience: [],
  references: [],
  includeReferences: false,
  jobTarget: {
    jobTitle: '',
    industry: '',
    roleType: '',
    jobDescription: '',
  },
  selectedTemplate: 'classic',
};
