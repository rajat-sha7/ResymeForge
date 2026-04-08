const { Document, Packer, Paragraph, TextRun } = require('docx');
const fs = require('fs');

// Minimal normalize helpers (mirrors exporter logic)
const abbreviationMap = {
  dept: 'department',
  mgr: 'manager',
  sr: 'senior',
  jr: 'junior',
  eng: 'engineer',
  dev: 'developer',
};
const templateKeywords = {
  software: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes']
};
function normalizeText(input) {
  if (!input) return '';
  let t = input;
  Object.keys(abbreviationMap).forEach(ab => {
    const re = new RegExp(`\\b${ab}\\b`, 'gi');
    t = t.replace(re, abbreviationMap[ab]);
  });
  return t.replace(/\s+/g, ' ').trim();
}
function mergeTemplateKeywords(skillsArr, tpl) {
  const kws = templateKeywords[tpl] || [];
  const normalized = new Set(skillsArr.map(s => s.trim()));
  kws.forEach(k => {
    const exists = Array.from(normalized).some(s => s.toLowerCase() === k.toLowerCase());
    if (!exists) normalized.add(k);
  });
  return Array.from(normalized);
}
function skillsToText(skillsArr, tpl) {
  const names = skillsArr.map(s => normalizeText(s)).filter(Boolean);
  return mergeTemplateKeywords(names, tpl).join(', ');
}

(async () => {
  const sample = {
    personalInfo: { name: 'Jane Doe', email: 'jane@example.com', phone: '+1 555 1234', location: 'New York, USA', title: 'Software Engineer' },
    professionalSummary: 'Results-driven software engineer with 6+ years building web applications.',
    skills: ['JavaScript', 'React', 'Node.js', 'Docker'],
    experience: [{ id: 'e1', position: 'Senior Software Engineer', company: 'Acme Inc', startDate: 'Jan 2020', endDate: 'Present', location: 'Remote', description: 'Worked on platform.', achievements: ['Led migration to microservices'] }],
    education: [{ id: 'ed1', degree: 'B.Sc. Computer Science', institution: 'State University', startDate: '2012', endDate: '2016' }],
    certifications: [{ id: 'c1', name: 'Certified Web Developer', issuer: 'Coursera', date: '2022' }]
  };

  const children = [];
  const font = 'Arial';
  const sectHeader = (t) => children.push(new Paragraph({ children: [new TextRun({ text: t.toUpperCase(), bold: true, size: 28, font })], spacing: { before: 180, after: 60 } }));

  // Contact
  children.push(new Paragraph({ children: [new TextRun({ text: sample.personalInfo.name, bold: true, size: 56, font })], spacing: { after: 20 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: `${sample.personalInfo.email}  |  ${sample.personalInfo.phone}  |  ${sample.personalInfo.location}`, size: 20, font })], spacing: { after: 40 } }));

  // Summary
  if (sample.professionalSummary) {
    sectHeader('Summary');
    children.push(new Paragraph({ children: [new TextRun({ text: sample.professionalSummary, size: 20, font })], spacing: { after: 80 } }));
  }

  // Skills
  if (sample.skills && sample.skills.length) {
    sectHeader('Skills');
    children.push(new Paragraph({ children: [new TextRun({ text: skillsToText(sample.skills, 'software'), size: 20, font })], spacing: { after: 80 } }));
  }

  // Experience
  if (sample.experience && sample.experience.length) {
    sectHeader('Experience');
    sample.experience.forEach(exp => {
      children.push(new Paragraph({ children: [new TextRun({ text: exp.position + ' @ ' + exp.company, bold: true, size: 22, font })], spacing: { before: 40, after: 6 } }));
      children.push(new Paragraph({ children: [new TextRun({ text: `${exp.startDate} - ${exp.endDate}`, size: 16, font })], spacing: { after: 6 } }));
      if (exp.description) children.push(new Paragraph({ children: [new TextRun({ text: exp.description, size: 20, font })], spacing: { after: 16 } }));
      if (exp.achievements) exp.achievements.forEach(a => children.push(new Paragraph({ children: [new TextRun({ text: '• ' + a, size: 18, font })], spacing: { after: 6 } })));
    });
  }

  // Education
  if (sample.education && sample.education.length) {
    sectHeader('Education');
    sample.education.forEach(edu => {
      children.push(new Paragraph({ children: [new TextRun({ text: `${edu.degree} — ${edu.institution}`, bold: true, size: 20, font })], spacing: { before: 40, after: 6 } }));
      children.push(new Paragraph({ children: [new TextRun({ text: `${edu.startDate} - ${edu.endDate}`, size: 16, font })], spacing: { after: 16 } }));
    });
  }

  // Certifications
  if (sample.certifications && sample.certifications.length) {
    sectHeader('Certifications');
    sample.certifications.forEach(cert => children.push(new Paragraph({ children: [new TextRun({ text: `${cert.name} — ${cert.issuer} (${cert.date})`, size: 18, font })], spacing: { after: 8 } })));
  }

  const doc = new Document({ sections: [{ properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 }, size: { width: 11906, height: 16838 } } }, children }] });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('sample_resume.docx', buffer);
  console.log('Wrote sample_resume.docx');
})();
