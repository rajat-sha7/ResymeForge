import React from 'react';
import { ResumeData } from '../types/resume';
import SoftwareTemplate from '../templates/SoftwareTemplate';
import ManagementTemplate from '../templates/ManagementTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import AcademicTemplate from '../templates/AcademicTemplate';
import SalesTemplate from '../templates/SalesTemplate';
import HealthcareTemplate from '../templates/HealthcareTemplate';

/**
 * Renders a resume with its selected template. This is the single renderer shared by the
 * on-screen preview and the server-side PDF page, so both produce the same layout.
 * Expects data already passed through `prepareResumeForRender`.
 */
const ResumeDocument: React.FC<{ data: ResumeData }> = ({ data }) => {
  switch ((data.template || 'software').toLowerCase()) {
    case 'management':
      return <ManagementTemplate data={data} />;
    case 'creative':
      return <CreativeTemplate data={data} />;
    case 'academic':
      return <AcademicTemplate data={data} />;
    case 'sales':
      return <SalesTemplate data={data} />;
    case 'healthcare':
      return <HealthcareTemplate data={data} />;
    case 'software':
    default:
      return <SoftwareTemplate data={data} />;
  }
};

export default ResumeDocument;
