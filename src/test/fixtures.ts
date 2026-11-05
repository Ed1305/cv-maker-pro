import { CVData, createEmptyCv, newBullet } from '../cv/schema';

export const sampleCv = (): CVData => {
  const cv = createEmptyCv();
  return {
    ...cv,
    personalInfo: {
      fullName: 'Ada Lovelace',
      professionalTitle: 'Software Engineer',
      email: 'ada@example.com',
      phone: '+44 20 7946 0958',
      city: 'London',
      country: 'UK',
      linkedinUrl: 'linkedin.com/in/ada',
    },
    professionalSummary: { ...cv.professionalSummary, summary: 'Engineer who ships reliable software.' },
    workExperience: [
      {
        id: 'job1',
        companyName: 'Analytical Engines Ltd',
        jobTitle: 'Lead Engineer',
        location: 'London',
        employmentType: 'full-time',
        startDate: '2021-03',
        endDate: '',
        currentlyWorking: true,
        responsibilities: [newBullet('Designed the payment platform'), newBullet('Mentored four engineers')],
        achievements: [newBullet('Cut report generation from 2 days to 30 minutes')],
      },
    ],
    education: [
      {
        id: 'edu1',
        institution: 'University of London',
        qualification: 'BSc',
        fieldOfStudy: 'Mathematics',
        startYear: '2015',
        graduationYear: '2018',
        currentlyStudying: false,
        grade: 'First',
        coursework: '',
        academicAchievements: '',
      },
    ],
    skills: [
      { id: 's1', name: 'TypeScript', category: 'technical', proficiency: 'advanced' },
      { id: 's2', name: 'React', category: 'technical', proficiency: 'advanced' },
    ],
    enabledSections: ['experience', 'education', 'skills'],
  };
};
