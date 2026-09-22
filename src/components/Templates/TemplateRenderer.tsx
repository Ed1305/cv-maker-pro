import React from 'react';
import { CVData } from '../../types/cv';
import SimpleTemplate from './SimpleTemplate';

interface TemplateRendererProps {
  data: CVData;
  scale?: number;
}

const TemplateRenderer: React.FC<TemplateRendererProps> = ({ data, scale = 1 }) => {
  return <SimpleTemplate data={data} scale={scale} />;
};

export default TemplateRenderer;
