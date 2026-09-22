import React from 'react';
import { CVData } from '../../types/cv';
import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import ProfessionalTemplate from './ProfessionalTemplate';
import ElegantTemplate from './ElegantTemplate';
import CreativeTemplate from './CreativeTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import DesignerTemplate from './DesignerTemplate';
import MinimalTemplate from './MinimalTemplate';
import MedicalTemplate from './MedicalTemplate';
import CorporateTemplate from './CorporateTemplate';

interface TemplateRendererProps {
  data: CVData;
  scale?: number;
}

const TemplateRenderer: React.FC<TemplateRendererProps> = ({ data, scale = 1 }) => {
  switch (data.selectedTemplate) {
    case 'classic':
      return <ClassicTemplate data={data} scale={scale} />;
    case 'modern':
      return <ModernTemplate data={data} scale={scale} />;
    case 'professional':
      return <ProfessionalTemplate data={data} scale={scale} />;
    case 'elegant':
      return <ElegantTemplate data={data} scale={scale} />;
    case 'creative':
      return <CreativeTemplate data={data} scale={scale} />;
    case 'executive':
      return <ExecutiveTemplate data={data} scale={scale} />;
    case 'designer':
      return <DesignerTemplate data={data} scale={scale} />;
    case 'minimal':
      return <MinimalTemplate data={data} scale={scale} />;
    case 'medical':
      return <MedicalTemplate data={data} scale={scale} />;
    case 'corporate':
      return <CorporateTemplate data={data} scale={scale} />;
    default:
      return <ClassicTemplate data={data} scale={scale} />;
  }
};

export default TemplateRenderer;
