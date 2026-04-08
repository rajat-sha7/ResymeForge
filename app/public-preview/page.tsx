"use client";

import React, { useEffect, useState } from 'react';
import SoftwareTemplate from '../templates/SoftwareTemplate';
import ManagementTemplate from '../templates/ManagementTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import AcademicTemplate from '../templates/AcademicTemplate';
import SalesTemplate from '../templates/SalesTemplate';
import HealthcareTemplate from '../templates/HealthcareTemplate';
import { ResumeData } from '../types/resume';

const decodeBase64 = (s: string) => {
  try {
    // handle unicode
    return decodeURIComponent(Array.prototype.map.call(atob(s), function(c: string) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch (e) {
    try { return atob(s); } catch { return ''; }
  }
};

const PublicPreview: React.FC = () => {
  const [data, setData] = useState<ResumeData | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const b = params.get('data');
    if (!b) return;
    try {
      const json = decodeBase64(b);
      const parsed = JSON.parse(json) as ResumeData;
      setData(parsed);
    } catch (err) {
      console.error('Failed to parse resume data', err);
    }
  }, []);

  if (!data) return <div style={{ padding: 40, fontFamily: 'Arial' }}>No resume data provided.</div>;

  const tpl = (data.template || 'software').toLowerCase();
  switch (tpl) {
    case 'software': return <SoftwareTemplate data={data} />;
    case 'management': return <ManagementTemplate data={data} />;
    case 'creative': return <CreativeTemplate data={data} />;
    case 'academic': return <AcademicTemplate data={data} />;
    case 'sales': return <SalesTemplate data={data} />;
    case 'healthcare': return <HealthcareTemplate data={data} />;
    default: return <SoftwareTemplate data={data} />;
  }
};

export default PublicPreview;
