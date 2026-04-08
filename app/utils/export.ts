import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document as DocxDocument, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, TabStopType, Table, TableRow, TableCell, WidthType } from 'docx';
import { ResumeData, SectionType } from '../types/resume';

/**
 * Converts a modern CSS color (lab, oklch, etc.) to hex using Canvas 2D.
 * Canvas 2D normalizes any valid CSS color to hex/rgb format.
 */
const createColorConverter = () => {
  const cache = new Map<string, string>();
  const cvs = document.createElement('canvas');
  cvs.width = cvs.height = 1;
  const ctx = cvs.getContext('2d');

  return (match: string): string => {
    if (cache.has(match)) return cache.get(match)!;
    let hex = '#000000';
    if (ctx) {
      try {
        ctx.fillStyle = '#010101';
        ctx.fillStyle = match;
        hex = ctx.fillStyle;
      } catch {
        // fallback to black
      }
    }
    cache.set(match, hex);
    return hex;
  };
};

/**
 * Replace modern CSS color functions in a string with hex equivalents.
 * Handles: oklch(), oklab(), lab(), lch(), hwb(), color(), color-mix()
 */
const replaceModernColors = (text: string, convertColor: (m: string) => string): string => {
  // Match modern color functions with up to one level of nesting (for color-mix)
  return text.replace(
    /(?:oklch|oklab|lab|lch|hwb|color-mix|color)\([^()]*(?:\([^()]*\)[^()]*)*\)/gi,
    convertColor
  );
};

/** Quick check if text contains modern color functions */
const hasModernColor = (text: string): boolean => {
  return /(?:oklch|oklab|lab|lch|hwb|color-mix|color)\(/i.test(text);
};

export const exportToPDF = async (element: HTMLElement, filename: string) => {
  if (!element) {
    throw new Error('No element provided for PDF export.');
  }

  // Collect items to restore after export
  const restoreActions: Array<() => void> = [];

  try {
    const convertColor = createColorConverter();

    const colorProperties = [
      'color', 'backgroundColor', 'borderColor',
      'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
      'outlineColor', 'textDecorationColor', 'columnRuleColor',
      'caretColor', 'fill', 'stroke', 'boxShadow',
    ];

    // ── STEP 1: Disable external stylesheets and sanitize <style> elements in the live document ──
    // Disable all external <link rel="stylesheet"> temporarily so html2canvas doesn't parse modern color functions
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];
    links.forEach(link => {
      try {
        const prev = (link as any).disabled;
        (link as any).disabled = true;
        restoreActions.push(() => { try { (link as any).disabled = prev; } catch {} });
      } catch {
        // ignore
      }
    });

    // Sanitize all inline <style> elements (replace modern color functions with hex)
    document.querySelectorAll('style').forEach((styleEl: HTMLStyleElement) => {
      if (styleEl.textContent && hasModernColor(styleEl.textContent)) {
        const original = styleEl.textContent;
        styleEl.textContent = replaceModernColors(original, convertColor);
        restoreActions.push(() => { styleEl.textContent = original; });
      }
    });

    // ── STEP 2: Try to modify CSSOM rules directly (handles adoptedStyleSheets / insertRule styles) ──
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        const rules = sheet.cssRules;
        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i];
          if (rule.cssText && hasModernColor(rule.cssText)) {
            const original = rule.cssText;
            try {
              sheet.deleteRule(i);
              sheet.insertRule(replaceModernColors(original, convertColor), i);
              restoreActions.push(() => {
                try { sheet.deleteRule(i); sheet.insertRule(original, i); } catch { /* skip */ }
              });
            } catch { /* some rules can't be modified, skip */ }
          }
        }
      } catch {
        // Cross-origin stylesheet — can't access rules, skip
      }
    }

    // ── STEP 3: Inline computed color styles on every element inside the export target ──
    // This is the decisive fix: inline styles with !important override everything,
    // and we write safe hex/rgb values that html2canvas can parse.
    const allElements = [element, ...Array.from(element.querySelectorAll('*'))];
    for (const el of allElements) {
      const htmlEl = el as HTMLElement;
      try {
        const cs = window.getComputedStyle(htmlEl);
        const originalStyle = htmlEl.getAttribute('style');

        for (const prop of colorProperties) {
          const val = cs[prop as keyof CSSStyleDeclaration] as string;
          if (val && typeof val === 'string' && hasModernColor(val)) {
            htmlEl.style.setProperty(
              prop.replace(/[A-Z]/g, m => '-' + m.toLowerCase()),
              replaceModernColors(val, convertColor),
              'important'
            );
          }
        }

        restoreActions.push(() => {
          if (originalStyle === null) {
            htmlEl.removeAttribute('style');
          } else {
            htmlEl.setAttribute('style', originalStyle);
          }
        });
      } catch {
        // Skip problematic elements
      }
    }

    // ── STEP 4: Save and remove transform on element ──
    const originalTransform = element.style.transform;
    const originalTransition = element.style.transition;
    element.style.transform = 'none';
    element.style.transition = 'none';
    restoreActions.push(() => {
      element.style.transform = originalTransform;
      element.style.transition = originalTransition;
    });

    // Small delay to let the browser repaint with the inlined styles
    await new Promise(resolve => setTimeout(resolve, 100));

    // ── STEP 5: Render with html2canvas inside a same-origin iframe for higher fidelity ──
    const mmToPx = (mm: number) => Math.round(mm * (96 / 25.4));
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = mmToPx(210) + 'px';
    iframe.style.height = mmToPx(297) + 'px';
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');
    document.body.appendChild(iframe);

    const idoc = iframe.contentDocument!;
    idoc.open();
    idoc.write(`<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:#fff}</style></head><body></body></html>`);
    idoc.close();

    // Copy styles into iframe (links + sanitized style tags)
    Array.from(document.querySelectorAll('link[rel="stylesheet"]')).forEach((ln: Element) => {
      try {
        const link = ln as HTMLLinkElement;
        const copied = idoc.createElement('link');
        copied.rel = 'stylesheet';
        copied.href = link.href;
        idoc.head.appendChild(copied);
      } catch {}
    });
    Array.from(document.querySelectorAll('style')).forEach((st: Element) => {
      try {
        const s = idoc.createElement('style');
        const txt = (st as HTMLStyleElement).textContent || '';
        s.textContent = hasModernColor(txt) ? replaceModernColors(txt, createColorConverter()) : txt;
        idoc.head.appendChild(s);
      } catch {}
    });

    // Clone the element into iframe and size for A4
    const cloned = element.cloneNode(true) as HTMLElement;
    cloned.style.width = '210mm';
    cloned.style.minHeight = '297mm';
    cloned.style.boxSizing = 'border-box';
    idoc.body.appendChild(cloned);

    // Wait for styles to load
    await new Promise(resolve => setTimeout(resolve, 500));

    // Inline computed colors in iframe to avoid modern functions
    try {
      const win = idoc.defaultView!;
      const convertColor = createColorConverter();
      const els = Array.from(idoc.body.querySelectorAll('*')) as HTMLElement[];
      for (const el of els) {
        try {
          const cs = win.getComputedStyle(el);
          ['color','background-color','border-color','box-shadow'].forEach(prop => {
            const val = cs.getPropertyValue(prop as any);
            if (val && hasModernColor(val)) {
              el.style.setProperty(prop, replaceModernColors(val, convertColor), 'important');
            }
          });
        } catch {}
      }
    } catch {}

    // Render canvas from the cloned content
    const canvas = await html2canvas(cloned, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: idoc.documentElement.scrollWidth,
      windowHeight: idoc.documentElement.scrollHeight,
      imageTimeout: 0,
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save(filename);
  } catch (error) {
    console.error('PDF export error:', error);
    throw new Error(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    // ── Always restore the live document to its original state ──
    for (const restore of restoreActions) {
      try { restore(); } catch { /* skip */ }
    }
  }
};

export const exportToDOCX = async (data: ResumeData, enabledSections: SectionType[], filename: string) => {
  const template = data.template || 'software';
  const children: (Paragraph | Table)[] = [];

  // A4 text area width in twips (210mm page - 2*~12.7mm margins)
  const RIGHT_TAB = 10466;

  // ── Normalize skills (same logic all templates use) ──
  const normalizedSkills = (data.skills || []).map((skill, i) =>
    typeof skill === 'string' ? { id: `skill-${i}`, name: skill, category: 'technical' as const, priority: i } : skill
  );
  const groupedSkills = normalizedSkills.reduce((acc, skill) => {
    const category = skill.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof normalizedSkills>);
  const categoryLabels: Record<string, string> = {
    technical: 'Technical Skills',
    tools: 'Tools & Technologies',
    soft: 'Soft Skills',
    other: 'Other Skills',
  };

  // --- ATS normalization helpers ---
  const abbreviationMap: Record<string, string> = {
    "dept": "department",
    "mgr": "manager",
    "sr": "senior",
    "jr": "junior",
    "eng": "engineer",
    "dev": "developer",
    "svc": "service",
    "acct": "account",
  };

  const templateKeywords: Record<string, string[]> = {
    software: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes'],
    management: ['Leadership', 'Project Management', 'Strategic Planning', 'Stakeholder Management', 'Budgeting'],
    creative: ['Adobe Photoshop', 'Illustrator', 'UX', 'UI', 'Figma'],
    academic: ['Research', 'Publications', 'Peer-reviewed', 'Grants', 'Data Analysis'],
    sales: ['Salesforce', 'CRM', 'Quota', 'Pipeline', 'Negotiation'],
    healthcare: ['HIPAA', 'Clinical', 'Patient Care', 'EHR', 'Clinical Trials'],
  };

  const normalizeText = (input?: string) => {
    if (!input) return '';
    let t = input;
    // expand simple abbreviations (word boundaries)
    Object.keys(abbreviationMap).forEach(ab => {
      const re = new RegExp(`\\b${ab}\\b`, 'gi');
      t = t.replace(re, abbreviationMap[ab]);
    });
    return t.replace(/\s+/g, ' ').trim();
  };

  const mergeTemplateKeywords = (skillsArr: string[], tpl: string) => {
    const kws = templateKeywords[tpl] || [];
    const normalized = new Set(skillsArr.map(s => s.trim()));
    kws.forEach(k => {
      // add if not already present (case-insensitive)
      const exists = Array.from(normalized).some(s => s.toLowerCase() === k.toLowerCase());
      if (!exists) normalized.add(k);
    });
    return Array.from(normalized);
  };

  const skillsToText = (skillsArr: { name: string }[], tpl: string, sep = ', ') => {
    const names = skillsArr.map(s => normalizeText(s.name)).filter(Boolean);
    const merged = mergeTemplateKeywords(names, tpl);
    return merged.join(sep);
  };

  // Normalize section headers to ATS-preferred labels
  const headerMap: Record<string, string> = {
    'professional summary': 'Summary',
    'professional experience': 'Experience',
    'competencies': 'Skills',
    'core skills': 'Skills',
    'skills': 'Skills',
    'projects': 'Projects',
    'education': 'Education',
    'certifications': 'Certifications',
    'achievements': 'Achievements',
    'awards & honors': 'Achievements',
    'research & projects': 'Projects',
    'notable achievements': 'Achievements',
    'licenses & certifications': 'Certifications',
    'clinical & professional skills': 'Skills',
  };

  const formatHeader = (title: string) => {
    if (!title) return title;
    const key = title.toLowerCase().trim();
    return headerMap[key] || title;
  };

  // Enforce ATS-preferred section ordering regardless of UI ordering.
  // This ensures exported files present information in the sequence most ATS systems expect.
  const atsPreferredOrder: SectionType[] = [
    'personalInfo',
    'professionalSummary',
    'skills',
    'experience',
    'projects',
    'education',
    'certifications',
    'achievements',
    'custom',
  ];
  const finalSections = atsPreferredOrder.filter(s => enabledSections.includes(s));
  // overwrite enabledSections locally so template branches use the ATS-ordered list
  enabledSections = finalSections as SectionType[];

  // ── Spacer helper ──
  const sp = (after = 100) => children.push(new Paragraph({ children: [new TextRun({ text: '', size: 2 })], spacing: { after } }));

  // ============================================================
  //  SOFTWARE TEMPLATE
  // ============================================================
  if (template === 'software') {
    const blue700 = '1D4ED8';
    const blue400 = '60A5FA';
    const blue600 = '2563EB';
    const gray500 = '6B7280';
    const gray600 = '4B5563';
    const gray800 = '1F2937';
    const font = 'Arial';

    const sectionHeader = (title: string) => {
      title = formatHeader(title);
      title = formatHeader(title);
      title = formatHeader(title);
      title = formatHeader(title);
      title = formatHeader(title);
      title = formatHeader(title);
      children.push(new Paragraph({
        children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 22, font, characterSpacing: 40 })],
        spacing: { before: 160, after: 60 },
        border: { bottom: { color: blue400, space: 1, style: BorderStyle.SINGLE, size: 4 } },
      }));
    };

    // ── Header ──
    if (enabledSections.includes('personalInfo') && data.personalInfo) {
      children.push(new Paragraph({
        children: [new TextRun({ text: (data.personalInfo.name || 'Your Name').toUpperCase(), bold: true, size: 48, color: blue700, font, characterSpacing: 60 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
      }));
      // Contact line with | separators
      const contact = [data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean);
      if (contact.length) {
        const runs: TextRun[] = [];
        contact.forEach((c, i) => {
          runs.push(new TextRun({ text: c!, size: 20, color: gray800, font }));
          if (i < contact.length - 1) runs.push(new TextRun({ text: '  |  ', size: 20, color: gray500, font }));
        });
        children.push(new Paragraph({ children: runs, alignment: AlignmentType.CENTER, spacing: { after: 30 } }));
      }
      // Links line
      const links: string[] = [];
      if (data.personalInfo.linkedin) links.push(`LinkedIn: ${data.personalInfo.linkedin}`);
      if (data.personalInfo.github) links.push(`GitHub: ${data.personalInfo.github}`);
      if (data.personalInfo.portfolio) links.push(`Portfolio: ${data.personalInfo.portfolio}`);
      if (links.length) {
        const lRuns: TextRun[] = [];
        links.forEach((l, i) => {
          lRuns.push(new TextRun({ text: l, size: 18, color: gray600, font }));
          if (i < links.length - 1) lRuns.push(new TextRun({ text: '  |  ', size: 18, color: gray500, font }));
        });
        children.push(new Paragraph({ children: lRuns, alignment: AlignmentType.CENTER, spacing: { after: 40 } }));
      }
      // Blue divider matching border-b-2 border-blue-700
      children.push(new Paragraph({
        children: [new TextRun({ text: '', size: 2 })],
        border: { bottom: { color: blue700, space: 1, style: BorderStyle.SINGLE, size: 8 } },
        spacing: { after: 120 },
      }));
    }

    // ── Professional Summary ──
    if (enabledSections.includes('professionalSummary') && data.professionalSummary) {
      const txt = typeof data.professionalSummary === 'string' ? data.professionalSummary : data.professionalSummary.summary;
      if (txt) {
        sectionHeader('Professional Summary');
        children.push(new Paragraph({ children: [new TextRun({ text: txt, size: 20, color: gray800, font })], spacing: { after: 100 } }));
      }
    }

    // ── Skills (grouped bullet list) ──
    if (enabledSections.includes('skills') && normalizedSkills.length > 0) {
      sectionHeader('Skills');
      Object.entries(groupedSkills).forEach(([cat, skills]) => {
        children.push(new Paragraph({
          children: [new TextRun({ text: categoryLabels[cat] || cat, bold: true, size: 18, color: blue600, font })],
          spacing: { before: 40, after: 20 },
        }));
        skills.forEach(skill => {
          children.push(new Paragraph({
            children: [new TextRun({ text: `•  ${skill.name}`, size: 20, font })],
            indent: { left: 360 },
            spacing: { after: 10 },
          }));
        });
      });
      sp();
    }

    // ── Professional Experience ──
    if (enabledSections.includes('experience') && data.experience?.length) {
      sectionHeader('Professional Experience');
      data.experience.forEach(exp => {
        // Position @ Company (left) ---- Date (right)
        children.push(new Paragraph({
          children: [
            new TextRun({ text: `${exp.position} @ ${exp.company}`, bold: true, size: 22, font }),
            new TextRun({ text: '\t', font }),
            new TextRun({ text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, size: 18, color: gray500, font }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
          spacing: { before: 80, after: 10 },
        }));
        children.push(new Paragraph({
          children: [new TextRun({ text: exp.location, size: 18, color: gray500, font })],
          spacing: { after: 20 },
        }));
        if (exp.description) {
          children.push(new Paragraph({
            children: [new TextRun({ text: exp.description, size: 20, font })],
            spacing: { after: 20 },
          }));
        }
        if (exp.achievements?.length) {
          exp.achievements.forEach(ach => {
            children.push(new Paragraph({
              children: [new TextRun({ text: `•  ${ach}`, size: 20, font })],
              indent: { left: 480 },
              spacing: { after: 10 },
            }));
          });
        }
        sp(60);
      });
    }

    // ── Projects ──
    if (enabledSections.includes('projects') && data.projects?.length) {
      sectionHeader('Projects');
      data.projects.forEach(proj => {
        const pRuns: TextRun[] = [new TextRun({ text: proj.name, bold: true, size: 22, font })];
        if (proj.link) {
          pRuns.push(new TextRun({ text: '\t', font }));
          pRuns.push(new TextRun({ text: proj.link, size: 18, color: blue600, font }));
        }
        children.push(new Paragraph({
          children: pRuns,
          tabStops: proj.link ? [{ type: TabStopType.RIGHT, position: RIGHT_TAB }] : undefined,
          spacing: { before: 80, after: 10 },
        }));
        if (proj.role) children.push(new Paragraph({ children: [new TextRun({ text: proj.role, size: 18, color: gray500, font })], spacing: { after: 10 } }));
        if (proj.description) children.push(new Paragraph({ children: [new TextRun({ text: proj.description, size: 20, font })], spacing: { after: 10 } }));
        if (proj.technologies?.length) {
          children.push(new Paragraph({ children: [new TextRun({ text: `Tech: ${proj.technologies.join(', ')}`, size: 18, font })], spacing: { after: 20 } }));
        }
      });
      sp();
    }

    // ── Education ──
    if (enabledSections.includes('education') && data.education?.length) {
      sectionHeader('Education');
      data.education.forEach(edu => {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`, bold: true, size: 22, font }),
            new TextRun({ text: '\t', font }),
            new TextRun({ text: `${edu.startDate} - ${edu.endDate}`, size: 18, color: gray500, font }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
          spacing: { before: 60, after: 10 },
        }));
        children.push(new Paragraph({
          children: [new TextRun({ text: `${edu.institution}${edu.location ? `, ${edu.location}` : ''}`, size: 18, color: gray500, font })],
          spacing: { after: 10 },
        }));
        if (edu.gpa && edu.showGpa) children.push(new Paragraph({ children: [new TextRun({ text: `GPA: ${edu.gpa}`, size: 18, font })], spacing: { after: 10 } }));
      });
      sp();
    }

    // ── Certifications ──
    if (enabledSections.includes('certifications') && data.certifications?.length) {
      sectionHeader('Certifications');
      data.certifications.forEach(cert => {
        const cRuns: TextRun[] = [
          new TextRun({ text: cert.name, bold: true, size: 20, font }),
          new TextRun({ text: ` - ${cert.issuer} (${cert.date})`, size: 20, font }),
        ];
        if (cert.link) cRuns.push(new TextRun({ text: `  ${cert.link}`, size: 18, color: blue600, font }));
        children.push(new Paragraph({ children: cRuns, spacing: { after: 30 } }));
      });
      sp();
    }

    // ── Achievements & Awards ──
    if (enabledSections.includes('achievements') && data.achievements?.length) {
      sectionHeader('Achievements & Awards');
      data.achievements.forEach(ach => {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: ach.title, bold: true, size: 20, font }),
            new TextRun({ text: ` - ${ach.date}`, size: 20, font }),
          ],
          spacing: { before: 40, after: 10 },
        }));
        if (ach.description) children.push(new Paragraph({ children: [new TextRun({ text: ach.description, size: 18, font })], spacing: { after: 10 } }));
        if (ach.impact) children.push(new Paragraph({ children: [new TextRun({ text: `Impact: ${ach.impact}`, italics: true, size: 18, color: blue600, font })], spacing: { after: 20 } }));
      });
    }

  // ============================================================
  //  MANAGEMENT TEMPLATE
  // ============================================================
  } else if (template === 'management') {
    const slate900 = '0F172A';
    const slate700 = '334155';
    const slate600 = '475569';
    const slate500 = '64748B';
    const slate400 = '94A3B8';
    const slate300 = 'CBD5E1';
    const font = 'Segoe UI';

    const sectionHeader = (title: string) => {
      children.push(new Paragraph({
        children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 20, font, characterSpacing: 80, color: slate900 })],
        spacing: { before: 180, after: 80 },
        border: { bottom: { color: slate300, space: 1, style: BorderStyle.SINGLE, size: 6 } },
      }));
    };

    // ── Header ──
    if (enabledSections.includes('personalInfo') && data.personalInfo) {
      // Name with left accent bar (simulated as left border)
      children.push(new Paragraph({
        children: [new TextRun({ text: data.personalInfo.name || 'Your Name', bold: true, size: 60, color: slate900, font })],
        spacing: { after: 10 },
        border: { left: { color: slate700, space: 4, style: BorderStyle.SINGLE, size: 12 } },
        indent: { left: 240 },
      }));
      children.push(new Paragraph({
        children: [new TextRun({ text: 'EXECUTIVE PROFESSIONAL', bold: true, size: 16, color: slate600, font, characterSpacing: 120 })],
        spacing: { after: 60 },
        border: { left: { color: slate900, space: 4, style: BorderStyle.SINGLE, size: 12 } },
        indent: { left: 240 },
      }));
      // Contact in pill-style (rendered as inline text)
      const cParts = [data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean);
      if (cParts.length) {
        const cRuns: TextRun[] = [];
        cParts.forEach((c, i) => {
          cRuns.push(new TextRun({ text: c!, size: 18, font }));
          if (i < cParts.length - 1) cRuns.push(new TextRun({ text: '    ', size: 18 }));
        });
        children.push(new Paragraph({
          children: cRuns,
          spacing: { after: 100 },
          border: { left: { color: slate700, space: 4, style: BorderStyle.SINGLE, size: 12 } },
          indent: { left: 240 },
        }));
      }
      sp(80);
    }

    // ── Professional Summary (no section title — just a box) ──
    if (enabledSections.includes('professionalSummary') && data.professionalSummary) {
      const txt = typeof data.professionalSummary === 'string' ? data.professionalSummary : data.professionalSummary.summary;
      if (txt) {
        children.push(new Paragraph({
          children: [new TextRun({ text: txt, size: 22, font, bold: true })],
          spacing: { after: 80 },
          border: { left: { color: slate700, space: 4, style: BorderStyle.SINGLE, size: 12 } },
          indent: { left: 240 },
        }));
        sp();
      }
    }

    // ── Experience (left border accent) ──
    if (enabledSections.includes('experience') && data.experience?.length) {
      sectionHeader('Professional Experience');
      data.experience.forEach(exp => {
        children.push(new Paragraph({
          children: [new TextRun({ text: exp.position, bold: true, size: 22, font })],
          spacing: { before: 80, after: 6 },
          border: { left: { color: slate400, space: 4, style: BorderStyle.SINGLE, size: 8 } },
          indent: { left: 240 },
        }));
        children.push(new Paragraph({
          children: [
            new TextRun({ text: `${exp.company} • ${exp.location}`, size: 18, color: slate600, font }),
            new TextRun({ text: '\t', font }),
            new TextRun({ text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, size: 18, color: slate500, bold: true, font }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
          spacing: { after: 20 },
          indent: { left: 240 },
        }));
        if (exp.description) children.push(new Paragraph({
          children: [new TextRun({ text: exp.description, size: 20, color: '374151', font })],
          spacing: { after: 20 },
          indent: { left: 240 },
        }));
        if (exp.achievements?.length) {
          exp.achievements.forEach(ach => {
            children.push(new Paragraph({
              children: [new TextRun({ text: `▸  ${ach}`, size: 20, color: '374151', font })],
              indent: { left: 600 },
              spacing: { after: 10 },
            }));
          });
        }
        sp(60);
      });
    }

    // ── Key Projects (card-style) ──
    if (enabledSections.includes('projects') && data.projects?.length) {
      sectionHeader('Key Projects');
      data.projects.forEach(proj => {
        const pRuns: TextRun[] = [new TextRun({ text: proj.name, bold: true, size: 20, font })];
        if (proj.link) pRuns.push(new TextRun({ text: `   ${proj.link}`, size: 16, color: slate700, font }));
        children.push(new Paragraph({ children: pRuns, spacing: { before: 60, after: 6 } }));
        if (proj.role) children.push(new Paragraph({ children: [new TextRun({ text: proj.role, size: 18, color: slate600, font })], spacing: { after: 6 } }));
        if (proj.description) children.push(new Paragraph({ children: [new TextRun({ text: proj.description, size: 20, color: '374151', font })], spacing: { after: 20 } }));
      });
      sp();
    }

    // ── Core Skills (pill-style — rendered as inline groups) ──
    if (enabledSections.includes('skills') && normalizedSkills.length > 0) {
      sectionHeader('Core Skills');
      Object.entries(groupedSkills).forEach(([cat, skills]) => {
        children.push(new Paragraph({
          children: [new TextRun({ text: (categoryLabels[cat] || cat), bold: true, size: 18, color: slate700, font })],
          spacing: { before: 40, after: 20 },
        }));
        children.push(new Paragraph({
          children: [new TextRun({ text: skillsToText(skills, template, ', '), size: 20, color: slate900, font })],
          spacing: { after: 20 },
          indent: { left: 240 },
        }));
      });
      sp();
    }

    // ── Education ──
    if (enabledSections.includes('education') && data.education?.length) {
      sectionHeader('Education');
      data.education.forEach(edu => {
        children.push(new Paragraph({ children: [new TextRun({ text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`, bold: true, size: 20, font })], spacing: { before: 40, after: 6 } }));
        children.push(new Paragraph({ children: [new TextRun({ text: edu.institution, size: 18, color: slate600, font })], spacing: { after: 6 } }));
        children.push(new Paragraph({ children: [new TextRun({ text: `${edu.startDate} - ${edu.endDate}`, size: 16, color: slate500, font })], spacing: { after: 6 } }));
        if (edu.gpa && edu.showGpa) children.push(new Paragraph({ children: [new TextRun({ text: `GPA: ${edu.gpa}`, size: 16, color: slate600, font })], spacing: { after: 10 } }));
      });
      sp();
    }

    // ── Certifications ──
    if (enabledSections.includes('certifications') && data.certifications?.length) {
      sectionHeader('Certifications');
      data.certifications.forEach(cert => {
        children.push(new Paragraph({ children: [new TextRun({ text: cert.name, bold: true, size: 20, font })], spacing: { before: 30, after: 6 } }));
        children.push(new Paragraph({ children: [new TextRun({ text: cert.issuer, size: 18, color: slate600, font })], spacing: { after: 6 } }));
        children.push(new Paragraph({ children: [new TextRun({ text: cert.date, size: 16, color: slate500, font })], spacing: { after: 16 } }));
      });
    }

  // ============================================================
  //  CREATIVE TEMPLATE
  // ============================================================
  } else if (template === 'creative') {
    const orange600 = 'EA580C';
    const orange400 = 'FB923C';
    const gray600 = '4B5563';
    const gray500 = '6B7280';
    const gray900 = '111827';
    const blue900 = '1E3A8A';
    const font = 'Calibri';

    const sectionHeader = (title: string) => {
      children.push(new Paragraph({
        children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 28, font, characterSpacing: 60, color: gray900 })],
        spacing: { before: 180, after: 80 },
      }));
    };

    // ── Header ──
    if (enabledSections.includes('personalInfo') && data.personalInfo) {
      children.push(new Paragraph({
        children: [new TextRun({ text: data.personalInfo.name || 'Your Name', bold: true, size: 60, color: gray900, font })],
        spacing: { after: 20 },
      }));
      // Tags
      children.push(new Paragraph({
        children: [new TextRun({ text: 'CREATIVE  •  PROFESSIONAL', bold: true, size: 16, color: orange600, font, characterSpacing: 80 })],
        spacing: { after: 40 },
      }));
      // Contact
      const cParts = [data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean);
      if (cParts.length) {
        const cRuns: TextRun[] = [];
        cParts.forEach((c, i) => {
          cRuns.push(new TextRun({ text: c!, size: 20, font }));
          if (i < cParts.length - 1) cRuns.push(new TextRun({ text: '  •  ', size: 20, color: gray600 }));
        });
        children.push(new Paragraph({ children: cRuns, spacing: { after: 80 } }));
      }
      sp();
    }

    // ── Summary (no title, left-border orange accent) ──
    if (enabledSections.includes('professionalSummary') && data.professionalSummary) {
      const txt = typeof data.professionalSummary === 'string' ? data.professionalSummary : data.professionalSummary.summary;
      if (txt) {
        children.push(new Paragraph({
          children: [new TextRun({ text: txt, size: 22, font, bold: true })],
          border: { left: { color: orange400, space: 4, style: BorderStyle.SINGLE, size: 12 } },
          indent: { left: 240 },
          spacing: { after: 80 },
        }));
        sp();
      }
    }

    // ── Experience (timeline style with ◆ bullets) ──
    if (enabledSections.includes('experience') && data.experience?.length) {
      sectionHeader('Experience');
      data.experience.forEach(exp => {
        children.push(new Paragraph({
          children: [new TextRun({ text: exp.position, bold: true, size: 22, font })],
          spacing: { before: 80, after: 6 },
          border: { left: { color: orange400, space: 4, style: BorderStyle.SINGLE, size: 6 } },
          indent: { left: 240 },
        }));
        children.push(new Paragraph({
          children: [new TextRun({ text: `${exp.company} • ${exp.location}`, size: 18, color: gray600, font })],
          spacing: { after: 6 },
          indent: { left: 240 },
        }));
        children.push(new Paragraph({
          children: [new TextRun({ text: `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`, size: 18, color: gray500, bold: true, font })],
          spacing: { after: 20 },
          indent: { left: 240 },
        }));
        if (exp.description) children.push(new Paragraph({ children: [new TextRun({ text: exp.description, size: 20, font })], indent: { left: 240 }, spacing: { after: 20 } }));
        if (exp.achievements?.length) {
          exp.achievements.forEach(ach => {
            children.push(new Paragraph({
              children: [new TextRun({ text: `◆  ${ach}`, size: 20, color: '374151', font })],
              indent: { left: 600 },
              spacing: { after: 10 },
            }));
          });
        }
        sp(60);
      });
    }

    // ── Skills (pill-style labels) ──
    if (enabledSections.includes('skills') && normalizedSkills.length > 0) {
      sectionHeader('Skills');
      Object.entries(groupedSkills).forEach(([cat, skills]) => {
        children.push(new Paragraph({
          children: [new TextRun({ text: (categoryLabels[cat] || cat).toUpperCase(), bold: true, size: 16, color: orange600, font })],
          spacing: { before: 40, after: 20 },
        }));
        children.push(new Paragraph({
          children: [new TextRun({ text: skillsToText(skills, template, ', '), size: 20, color: blue900, bold: true, font })],
          spacing: { after: 30 },
          indent: { left: 240 },
        }));
      });
      sp();
    }

    // ── Projects (card-style with bordered cards) ──
    if (enabledSections.includes('projects') && data.projects?.length) {
      sectionHeader('Projects');
      data.projects.forEach(proj => {
        const projParagraphs: Paragraph[] = [];
        const pRuns: TextRun[] = [new TextRun({ text: proj.name, bold: true, size: 22, font })];
        if (proj.link) {
          pRuns.push(new TextRun({ text: '\t', font }));
          pRuns.push(new TextRun({ text: 'View', size: 18, color: orange600, font }));
        }
        projParagraphs.push(new Paragraph({
          children: pRuns,
          tabStops: proj.link ? [{ type: TabStopType.RIGHT, position: RIGHT_TAB - 480 }] : undefined,
          spacing: { before: 40, after: 6 },
        }));
        if (proj.role) projParagraphs.push(new Paragraph({ children: [new TextRun({ text: proj.role, size: 18, color: gray600, font })], spacing: { after: 6 } }));
        if (proj.description) projParagraphs.push(new Paragraph({ children: [new TextRun({ text: proj.description, size: 20, font })], spacing: { after: 20 } }));

        const cardBorder = { style: BorderStyle.SINGLE, size: 4, color: 'E5E7EB' };
        children.push(new Table({
          rows: [new TableRow({
            children: [new TableCell({
              children: projParagraphs,
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: { top: cardBorder, bottom: cardBorder, left: cardBorder, right: cardBorder },
            })],
          })],
          width: { size: 100, type: WidthType.PERCENTAGE },
        }));
        sp(60);
      });
      sp();
    }

    // ── Education & Certifications (side by side like the template) ──
    {
      const hasEdu = enabledSections.includes('education') && (data.education?.length ?? 0) > 0;
      const hasCert = enabledSections.includes('certifications') && (data.certifications?.length ?? 0) > 0;

      if (hasEdu && hasCert) {
        // 2-column table layout matching grid-cols-2
        const eduParagraphs: Paragraph[] = [
          new Paragraph({
            children: [new TextRun({ text: 'EDUCATION', bold: true, size: 20, font, characterSpacing: 60, color: gray900 })],
            spacing: { after: 40 },
          }),
        ];
        data.education!.forEach(edu => {
          eduParagraphs.push(new Paragraph({ children: [new TextRun({ text: edu.degree, bold: true, size: 18, font })], spacing: { before: 20, after: 4 } }));
          eduParagraphs.push(new Paragraph({ children: [new TextRun({ text: edu.institution, size: 16, color: gray600, font })], spacing: { after: 4 } }));
          eduParagraphs.push(new Paragraph({ children: [new TextRun({ text: `${edu.startDate} - ${edu.endDate}`, size: 14, color: gray500, font })], spacing: { after: 12 } }));
        });

        const certParagraphs: Paragraph[] = [
          new Paragraph({
            children: [new TextRun({ text: 'CERTIFICATIONS', bold: true, size: 20, font, characterSpacing: 60, color: gray900 })],
            spacing: { after: 40 },
          }),
        ];
        data.certifications!.forEach(cert => {
          certParagraphs.push(new Paragraph({ children: [new TextRun({ text: cert.name, bold: true, size: 18, font })], spacing: { before: 20, after: 4 } }));
          certParagraphs.push(new Paragraph({ children: [new TextRun({ text: cert.issuer, size: 16, color: gray600, font })], spacing: { after: 12 } }));
        });

        const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
        const cellBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

        children.push(new Table({
          rows: [new TableRow({
            children: [
              new TableCell({
                children: eduParagraphs,
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: cellBorders,
              }),
              new TableCell({
                children: certParagraphs,
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: cellBorders,
              }),
            ],
          })],
          width: { size: 100, type: WidthType.PERCENTAGE },
        }));
      } else {
        // Only one present — render normally stacked
        if (hasEdu) {
          sectionHeader('Education');
          data.education!.forEach(edu => {
            children.push(new Paragraph({ children: [new TextRun({ text: edu.degree, bold: true, size: 20, font })], spacing: { before: 30, after: 6 } }));
            children.push(new Paragraph({ children: [new TextRun({ text: edu.institution, size: 18, color: gray600, font })], spacing: { after: 6 } }));
            children.push(new Paragraph({ children: [new TextRun({ text: `${edu.startDate} - ${edu.endDate}`, size: 16, color: gray500, font })], spacing: { after: 16 } }));
          });
        }
        if (hasCert) {
          sectionHeader('Certifications');
          data.certifications!.forEach(cert => {
            children.push(new Paragraph({ children: [new TextRun({ text: cert.name, bold: true, size: 20, font })], spacing: { before: 30, after: 6 } }));
            children.push(new Paragraph({ children: [new TextRun({ text: cert.issuer, size: 18, color: gray600, font })], spacing: { after: 16 } }));
          });
        }
      }
    }

  // ============================================================
  //  ACADEMIC TEMPLATE
  // ============================================================
  } else if (template === 'academic') {
    const green700 = '15803D';
    const green600 = '16A34A';
    const green300 = '86EFAC';
    const darkGreen = '065F46';
    const accentGreen = '059669';
    const gray600 = '4B5563';
    const gray500 = '6B7280';
    const font = 'Georgia';

    const sectionHeader = (title: string) => {
      children.push(new Paragraph({
        children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 28, color: darkGreen, font, characterSpacing: 60 })],
        spacing: { before: 180, after: 80 },
        border: { bottom: { color: green600, space: 1, style: BorderStyle.SINGLE, size: 6 } },
      }));
    };

    // ── Header (centered, green accent) ──
    if (enabledSections.includes('personalInfo') && data.personalInfo) {
      children.push(new Paragraph({
        children: [new TextRun({ text: data.personalInfo.name || 'Your Name', bold: true, size: 56, color: darkGreen, font })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 20 },
      }));
      children.push(new Paragraph({
        children: [new TextRun({ text: 'ACADEMIC & RESEARCH PROFESSIONAL', bold: true, size: 16, color: accentGreen, font, characterSpacing: 100 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
      }));
      const cParts = [data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean);
      if (cParts.length) {
        const cRuns: TextRun[] = [];
        cParts.forEach((c, i) => {
          cRuns.push(new TextRun({ text: c!, size: 18, font }));
          if (i < cParts.length - 1) cRuns.push(new TextRun({ text: '  •  ', size: 18, color: gray500 }));
        });
        children.push(new Paragraph({ children: cRuns, alignment: AlignmentType.CENTER, spacing: { after: 40 } }));
      }
      // Thick green divider (border-b-4 border-green-700)
      children.push(new Paragraph({
        children: [new TextRun({ text: '', size: 2 })],
        border: { bottom: { color: green700, space: 1, style: BorderStyle.SINGLE, size: 12 } },
        spacing: { after: 140 },
      }));
    }

    // ── Summary (no title, italic in green box) ──
    if (enabledSections.includes('professionalSummary') && data.professionalSummary) {
      const txt = typeof data.professionalSummary === 'string' ? data.professionalSummary : data.professionalSummary.summary;
      if (txt) {
        children.push(new Paragraph({
          children: [new TextRun({ text: txt, size: 22, font, italics: true })],
          border: { left: { color: green700, space: 4, style: BorderStyle.SINGLE, size: 12 } },
          indent: { left: 240 },
          spacing: { after: 80 },
        }));
        sp();
      }
    }

    // ── Education (first & prominent) ──
    if (enabledSections.includes('education') && data.education?.length) {
      sectionHeader('Education');
      data.education.forEach(edu => {
        children.push(new Paragraph({
          children: [new TextRun({ text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`, bold: true, size: 22, font })],
          spacing: { before: 60, after: 6 },
          border: { left: { color: green300, space: 4, style: BorderStyle.SINGLE, size: 8 } },
          indent: { left: 240 },
        }));
        children.push(new Paragraph({
          children: [new TextRun({ text: edu.institution, bold: true, size: 20, color: accentGreen, font })],
          spacing: { after: 6 },
          indent: { left: 240 },
        }));
        children.push(new Paragraph({
          children: [new TextRun({ text: `${edu.startDate} - ${edu.endDate}`, size: 16, color: gray600, font })],
          spacing: { after: 6 },
          indent: { left: 240 },
        }));
        if (edu.gpa && edu.showGpa) children.push(new Paragraph({ children: [new TextRun({ text: `GPA: ${edu.gpa}`, size: 16, color: '374151', font })], indent: { left: 240 }, spacing: { after: 10 } }));
        sp(40);
      });
    }

    // ── Experience ──
    if (enabledSections.includes('experience') && data.experience?.length) {
      sectionHeader('Professional Experience');
      data.experience.forEach(exp => {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: exp.position, bold: true, size: 22, font }),
            new TextRun({ text: '\t', font }),
            new TextRun({ text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, size: 16, color: '166534', font }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
          spacing: { before: 80, after: 10 },
        }));
        children.push(new Paragraph({
          children: [new TextRun({ text: `${exp.company}, ${exp.location}`, bold: true, size: 20, color: '374151', font })],
          spacing: { after: 20 },
        }));
        if (exp.description) children.push(new Paragraph({ children: [new TextRun({ text: exp.description, size: 20, color: '374151', font })], spacing: { after: 20 } }));
        if (exp.achievements?.length) {
          exp.achievements.forEach(ach => {
            children.push(new Paragraph({
              children: [
                new TextRun({ text: '›  ', size: 20, color: accentGreen, font }),
                new TextRun({ text: ach, size: 20, color: '374151', font }),
              ],
              indent: { left: 480 },
              spacing: { after: 10 },
            }));
          });
        }
        sp(60);
      });
    }

    // ── Research & Projects ──
    if (enabledSections.includes('projects') && data.projects?.length) {
      sectionHeader('Research & Projects');
      data.projects.forEach(proj => {
        const pRuns: TextRun[] = [new TextRun({ text: proj.name, bold: true, size: 22, font })];
        if (proj.link) {
          pRuns.push(new TextRun({ text: '\t', font }));
          pRuns.push(new TextRun({ text: 'Link', size: 16, color: green700, font }));
        }
        children.push(new Paragraph({
          children: pRuns,
          tabStops: proj.link ? [{ type: TabStopType.RIGHT, position: RIGHT_TAB }] : undefined,
          spacing: { before: 60, after: 6 },
        }));
        if (proj.role) children.push(new Paragraph({ children: [new TextRun({ text: proj.role, bold: true, size: 18, color: gray600, font })], spacing: { after: 6 } }));
        if (proj.description) children.push(new Paragraph({ children: [new TextRun({ text: proj.description, size: 20, color: '374151', font })], spacing: { after: 20 } }));
      });
      sp();
    }

    // ── Competencies ──
    if (enabledSections.includes('skills') && normalizedSkills.length > 0) {
      sectionHeader('Competencies');
      Object.entries(groupedSkills).forEach(([cat, skills]) => {
        children.push(new Paragraph({
          children: [new TextRun({ text: (categoryLabels[cat] || cat).toUpperCase(), bold: true, size: 16, color: accentGreen, font })],
          spacing: { before: 40, after: 20 },
        }));
        children.push(new Paragraph({
          children: [new TextRun({ text: skillsToText(skills, template, ', '), size: 20, font })],
          indent: { left: 240 },
          spacing: { after: 20 },
        }));
      });
      sp();
    }

    // ── Certifications & Credentials ──
    if (enabledSections.includes('certifications') && data.certifications?.length) {
      sectionHeader('Certifications & Credentials');
      data.certifications.forEach(cert => {
        children.push(new Paragraph({ children: [new TextRun({ text: cert.name, bold: true, size: 20, font })], spacing: { before: 30, after: 6 } }));
        children.push(new Paragraph({ children: [new TextRun({ text: `${cert.issuer} • ${cert.date}`, size: 18, color: gray600, font })], spacing: { after: 16 } }));
      });
      sp();
    }

    // ── Awards & Honors ──
    if (enabledSections.includes('achievements') && data.achievements?.length) {
      sectionHeader('Awards & Honors');
      data.achievements.forEach(ach => {
        children.push(new Paragraph({ children: [new TextRun({ text: ach.title, bold: true, size: 20, font })], spacing: { before: 30, after: 6 } }));
        children.push(new Paragraph({ children: [new TextRun({ text: ach.date, size: 16, color: gray600, font })], spacing: { after: 6 } }));
        if (ach.description) children.push(new Paragraph({ children: [new TextRun({ text: ach.description, size: 18, color: '374151', font })], spacing: { after: 16 } }));
      });
    }

  // ============================================================
  //  SALES TEMPLATE
  // ============================================================
  } else if (template === 'sales') {
    const orange700 = 'C2410C';
    const orange600 = 'EA580C';
    const orange300 = 'FDBA74';
    const amber900 = '78350F';
    const amber500 = 'F59E0B';
    const gray600 = '4B5563';
    const gray900 = '111827';
    const font = 'Segoe UI';

    const sectionHeader = (title: string) => {
      children.push(new Paragraph({
        children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 28, color: orange700, font, characterSpacing: 60 })],
        spacing: { before: 180, after: 80 },
        border: { bottom: { color: orange300, space: 1, style: BorderStyle.SINGLE, size: 6 } },
      }));
    };

    // ── Header (bold banner look) ──
    if (enabledSections.includes('personalInfo') && data.personalInfo) {
      children.push(new Paragraph({
        children: [new TextRun({ text: data.personalInfo.name || 'Your Name', bold: true, size: 60, color: orange600, font })],
        spacing: { after: 10 },
      }));
      children.push(new Paragraph({
        children: [new TextRun({ text: 'TOP PERFORMER  |  RESULTS DRIVEN', bold: true, size: 18, color: orange700, font })],
        spacing: { after: 40 },
      }));
      const cParts = [data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean);
      if (cParts.length) {
        const cRuns: TextRun[] = [];
        cParts.forEach((c, i) => {
          cRuns.push(new TextRun({ text: `✓ ${c}`, size: 20, font }));
          if (i < cParts.length - 1) cRuns.push(new TextRun({ text: '    ', size: 20 }));
        });
        children.push(new Paragraph({ children: cRuns, spacing: { after: 60 } }));
      }
      children.push(new Paragraph({
        children: [new TextRun({ text: '', size: 2 })],
        border: { bottom: { color: orange600, space: 1, style: BorderStyle.SINGLE, size: 8 } },
        spacing: { after: 120 },
      }));
    }

    // ── Summary (no title, bold amber box) ──
    if (enabledSections.includes('professionalSummary') && data.professionalSummary) {
      const txt = typeof data.professionalSummary === 'string' ? data.professionalSummary : data.professionalSummary.summary;
      if (txt) {
        children.push(new Paragraph({
          children: [new TextRun({ text: txt, size: 22, bold: true, color: amber900, font })],
          border: {
            top: { color: orange300, space: 2, style: BorderStyle.SINGLE, size: 4 },
            bottom: { color: orange300, space: 2, style: BorderStyle.SINGLE, size: 4 },
            left: { color: orange300, space: 4, style: BorderStyle.SINGLE, size: 4 },
            right: { color: orange300, space: 4, style: BorderStyle.SINGLE, size: 4 },
          },
          indent: { left: 120, right: 120 },
          spacing: { after: 80 },
        }));
        sp();
      }
    }

    // ── Experience (border-left accent, → bullets) ──
    if (enabledSections.includes('experience') && data.experience?.length) {
      sectionHeader('Sales & Business Experience');
      data.experience.forEach(exp => {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: exp.position, bold: true, size: 22, color: gray900, font }),
            new TextRun({ text: '\t', font }),
            new TextRun({ text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, size: 16, bold: true, color: orange600, font }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
          spacing: { before: 80, after: 6 },
          border: { left: { color: amber500, space: 4, style: BorderStyle.SINGLE, size: 8 } },
          indent: { left: 240 },
        }));
        children.push(new Paragraph({
          children: [new TextRun({ text: exp.company, bold: true, size: 20, color: orange700, font })],
          indent: { left: 240 },
          spacing: { after: 6 },
        }));
        children.push(new Paragraph({
          children: [new TextRun({ text: exp.location, size: 16, color: gray600, font })],
          indent: { left: 240 },
          spacing: { after: 20 },
        }));
        if (exp.description) children.push(new Paragraph({
          children: [new TextRun({ text: exp.description, size: 20, font })],
          indent: { left: 240 },
          spacing: { after: 20 },
        }));
        if (exp.achievements?.length) {
          exp.achievements.forEach(ach => {
            children.push(new Paragraph({
              children: [
                new TextRun({ text: '→  ', size: 20, color: orange600, bold: true, font }),
                new TextRun({ text: ach, size: 20, font }),
              ],
              indent: { left: 600 },
              spacing: { after: 10 },
            }));
          });
        }
        sp(60);
      });
    }

    // ── Competitive Strengths (star ★ rating style) ──
    if (enabledSections.includes('skills') && normalizedSkills.length > 0) {
      sectionHeader('Competitive Strengths');
      Object.entries(groupedSkills).forEach(([cat, skills]) => {
        children.push(new Paragraph({
          children: [new TextRun({ text: (categoryLabels[cat] || cat).toUpperCase(), bold: true, size: 16, color: orange600, font })],
          spacing: { before: 40, after: 20 },
        }));
        skills.forEach(skill => {
          children.push(new Paragraph({
            children: [
              new TextRun({ text: '★  ', size: 20, color: 'D97706', font }),
              new TextRun({ text: skill.name, bold: true, size: 20, font }),
            ],
            indent: { left: 240 },
            spacing: { after: 10 },
          }));
        });
      });
      sp();
    }

    // ── Notable Achievements (Projects) ──
    if (enabledSections.includes('projects') && data.projects?.length) {
      sectionHeader('Notable Achievements');
      data.projects.forEach(proj => {
        const pRuns: TextRun[] = [new TextRun({ text: proj.name, bold: true, size: 22, color: gray900, font })];
        if (proj.link) {
          pRuns.push(new TextRun({ text: '\t', font }));
          pRuns.push(new TextRun({ text: 'View', bold: true, size: 16, color: orange600, font }));
        }
        children.push(new Paragraph({
          children: pRuns,
          tabStops: proj.link ? [{ type: TabStopType.RIGHT, position: RIGHT_TAB }] : undefined,
          spacing: { before: 60, after: 6 },
        }));
        if (proj.role) children.push(new Paragraph({ children: [new TextRun({ text: proj.role, bold: true, size: 18, color: orange700, font })], spacing: { after: 6 } }));
        if (proj.description) children.push(new Paragraph({ children: [new TextRun({ text: proj.description, size: 20, font })], spacing: { after: 20 } }));
      });
      sp();
    }

    // ── Education ──
    if (enabledSections.includes('education') && data.education?.length) {
      sectionHeader('Education');
      data.education.forEach(edu => {
        children.push(new Paragraph({ children: [new TextRun({ text: edu.degree, bold: true, size: 20, color: gray900, font })], spacing: { before: 30, after: 6 } }));
        children.push(new Paragraph({ children: [new TextRun({ text: edu.institution, bold: true, size: 18, color: orange700, font })], spacing: { after: 6 } }));
        children.push(new Paragraph({ children: [new TextRun({ text: `${edu.startDate} - ${edu.endDate}`, size: 16, color: gray600, font })], spacing: { after: 16 } }));
      });
      sp();
    }

    // ── Certifications ──
    if (enabledSections.includes('certifications') && data.certifications?.length) {
      sectionHeader('Certifications');
      data.certifications.forEach(cert => {
        children.push(new Paragraph({ children: [new TextRun({ text: cert.name, bold: true, size: 20, color: gray900, font })], spacing: { before: 30, after: 6 } }));
        children.push(new Paragraph({ children: [new TextRun({ text: cert.issuer, size: 18, color: orange700, font })], spacing: { after: 6 } }));
        children.push(new Paragraph({ children: [new TextRun({ text: cert.date, size: 16, color: gray600, font })], spacing: { after: 16 } }));
      });
    }

  // ============================================================
  //  HEALTHCARE TEMPLATE
  // ============================================================
  } else if (template === 'healthcare') {
    const blue700 = '1D4ED8';
    const blue300 = '93C5FD';
    const teal700 = '0F766E';
    const teal600 = '0D9488';
    const teal500 = '14B8A6';
    const teal300 = '5EEAD4';
    const gray600 = '4B5563';
    const gray900 = '111827';
    const headerBlue = '1E40AF';
    const font = 'Calibri';

    const sectionHeader = (title: string) => {
      children.push(new Paragraph({
        children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 28, color: headerBlue, font, characterSpacing: 60 })],
        spacing: { before: 180, after: 80 },
        border: { bottom: { color: blue700, space: 1, style: BorderStyle.SINGLE, size: 6 } },
      }));
    };

    // ── Header (professional banner) ──
    if (enabledSections.includes('personalInfo') && data.personalInfo) {
      children.push(new Paragraph({
        children: [new TextRun({ text: data.personalInfo.name || 'Your Name', bold: true, size: 60, color: headerBlue, font })],
        spacing: { after: 10 },
      }));
      children.push(new Paragraph({
        children: [new TextRun({ text: 'HEALTHCARE PROFESSIONAL', bold: true, size: 18, color: teal600, font })],
        spacing: { after: 40 },
      }));
      const cParts = [
        data.personalInfo.email ? `📧 ${data.personalInfo.email}` : '',
        data.personalInfo.phone ? `📞 ${data.personalInfo.phone}` : '',
        data.personalInfo.location ? `📍 ${data.personalInfo.location}` : '',
      ].filter(Boolean);
      if (cParts.length) {
        const cRuns: TextRun[] = [];
        cParts.forEach((c, i) => {
          cRuns.push(new TextRun({ text: c, size: 18, font }));
          if (i < cParts.length - 1) cRuns.push(new TextRun({ text: '    ', size: 18 }));
        });
        children.push(new Paragraph({ children: cRuns, spacing: { after: 60 } }));
      }
      children.push(new Paragraph({
        children: [new TextRun({ text: '', size: 2 })],
        border: { bottom: { color: teal600, space: 1, style: BorderStyle.SINGLE, size: 8 } },
        spacing: { after: 120 },
      }));
    }

    // ── Summary (no title, blue left-border box) ──
    if (enabledSections.includes('professionalSummary') && data.professionalSummary) {
      const txt = typeof data.professionalSummary === 'string' ? data.professionalSummary : data.professionalSummary.summary;
      if (txt) {
        children.push(new Paragraph({
          children: [new TextRun({ text: txt, size: 22, font })],
          border: { left: { color: blue700, space: 4, style: BorderStyle.SINGLE, size: 12 } },
          indent: { left: 240 },
          spacing: { after: 80 },
        }));
        sp();
      }
    }

    // ── Licenses & Certifications (prominent, card-style) ──
    if (enabledSections.includes('certifications') && data.certifications?.length) {
      sectionHeader('Licenses & Certifications');
      data.certifications.forEach(cert => {
        children.push(new Paragraph({
          children: [new TextRun({ text: cert.name, bold: true, size: 22, color: '1E3A8A', font })],
          spacing: { before: 60, after: 6 },
          border: { left: { color: blue300, space: 4, style: BorderStyle.SINGLE, size: 8 } },
          indent: { left: 240 },
        }));
        children.push(new Paragraph({
          children: [new TextRun({ text: cert.issuer, bold: true, size: 18, color: blue700, font })],
          indent: { left: 240 },
          spacing: { after: 6 },
        }));
        children.push(new Paragraph({
          children: [new TextRun({ text: `Issued: ${cert.date}`, size: 16, color: gray600, font })],
          indent: { left: 240 },
          spacing: { after: 30 },
        }));
      });
      sp();
    }

    // ── Experience (teal left-border, ✓ bullets) ──
    if (enabledSections.includes('experience') && data.experience?.length) {
      sectionHeader('Professional Experience');
      data.experience.forEach(exp => {
        children.push(new Paragraph({
          children: [new TextRun({ text: exp.position, bold: true, size: 22, color: gray900, font })],
          spacing: { before: 80, after: 6 },
          border: { left: { color: teal500, space: 4, style: BorderStyle.SINGLE, size: 8 } },
          indent: { left: 240 },
        }));
        children.push(new Paragraph({
          children: [
            new TextRun({ text: exp.company, bold: true, size: 20, color: teal700, font }),
            new TextRun({ text: '\t', font }),
            new TextRun({ text: `${exp.startDate}-${exp.current ? 'Present' : exp.endDate}`, bold: true, size: 16, color: teal600, font }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
          indent: { left: 240 },
          spacing: { after: 6 },
        }));
        children.push(new Paragraph({
          children: [new TextRun({ text: exp.location, size: 16, color: gray600, font })],
          indent: { left: 240 },
          spacing: { after: 20 },
        }));
        if (exp.description) children.push(new Paragraph({
          children: [new TextRun({ text: exp.description, size: 20, font })],
          indent: { left: 240 },
          spacing: { after: 20 },
        }));
        if (exp.achievements?.length) {
          exp.achievements.forEach(ach => {
            children.push(new Paragraph({
              children: [
                new TextRun({ text: '✓  ', size: 20, color: teal600, bold: true, font }),
                new TextRun({ text: ach, size: 20, color: '374151', font }),
              ],
              indent: { left: 600 },
              spacing: { after: 10 },
            }));
          });
        }
        sp(60);
      });
    }

    // ── Education (card-style) ──
    if (enabledSections.includes('education') && data.education?.length) {
      sectionHeader('Education');
      data.education.forEach(edu => {
        children.push(new Paragraph({
          children: [new TextRun({ text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`, bold: true, size: 22, color: gray900, font })],
          spacing: { before: 60, after: 6 },
        }));
        children.push(new Paragraph({
          children: [new TextRun({ text: edu.institution, bold: true, size: 20, color: teal700, font })],
          spacing: { after: 6 },
        }));
        children.push(new Paragraph({
          children: [new TextRun({ text: `${edu.startDate} - ${edu.endDate}`, size: 16, color: gray600, font })],
          spacing: { after: 6 },
        }));
        if (edu.gpa && edu.showGpa) children.push(new Paragraph({ children: [new TextRun({ text: `GPA: ${edu.gpa}`, size: 16, color: '374151', font })], spacing: { after: 10 } }));
        sp(40);
      });
    }

    // ── Clinical & Professional Skills (teal pills) ──
    if (enabledSections.includes('skills') && normalizedSkills.length > 0) {
      sectionHeader('Clinical & Professional Skills');
      Object.entries(groupedSkills).forEach(([cat, skills]) => {
        children.push(new Paragraph({
          children: [new TextRun({ text: (categoryLabels[cat] || cat).toUpperCase(), bold: true, size: 18, color: teal700, font })],
          spacing: { before: 40, after: 20 },
        }));
        children.push(new Paragraph({
          children: [new TextRun({ text: skillsToText(skills, template, ', '), bold: true, size: 20, color: '134E4A', font })],
          indent: { left: 240 },
          spacing: { after: 20 },
        }));
      });
      sp();
    }

    // ── Healthcare Initiatives (Projects) ──
    if (enabledSections.includes('projects') && data.projects?.length) {
      sectionHeader('Healthcare Initiatives');
      data.projects.forEach(proj => {
        children.push(new Paragraph({
          children: [new TextRun({ text: proj.name, bold: true, size: 22, color: gray900, font })],
          spacing: { before: 60, after: 6 },
          border: { left: { color: blue300, space: 4, style: BorderStyle.SINGLE, size: 8 } },
          indent: { left: 240 },
        }));
        if (proj.role) children.push(new Paragraph({ children: [new TextRun({ text: proj.role, bold: true, size: 18, color: teal700, font })], indent: { left: 240 }, spacing: { after: 6 } }));
        if (proj.description) children.push(new Paragraph({ children: [new TextRun({ text: proj.description, size: 20, font })], indent: { left: 240 }, spacing: { after: 10 } }));
        if (proj.link) children.push(new Paragraph({ children: [new TextRun({ text: `Learn More: ${proj.link}`, size: 16, color: teal600, font })], indent: { left: 240 }, spacing: { after: 20 } }));
      });
    }

  // ============================================================
  //  FALLBACK (BaseTemplate / unknown)
  // ============================================================
  } else {
    const font = 'Arial';
    const gray500 = '6B7280';

    const sectionHeader = (title: string) => {
      children.push(new Paragraph({
        children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 24, font })],
        spacing: { before: 160, after: 80 },
        border: { bottom: { color: '333333', space: 1, style: BorderStyle.SINGLE, size: 4 } },
      }));
    };

    if (enabledSections.includes('personalInfo') && data.personalInfo) {
      children.push(new Paragraph({ children: [new TextRun({ text: data.personalInfo.name || 'Your Name', bold: true, size: 48, font })], alignment: AlignmentType.CENTER, spacing: { after: 40 } }));
      const contact = [data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean).join('  |  ');
      if (contact) children.push(new Paragraph({ children: [new TextRun({ text: contact, size: 20, font })], alignment: AlignmentType.CENTER, spacing: { after: 80 } }));
      children.push(new Paragraph({ children: [new TextRun({ text: '', size: 2 })], border: { bottom: { color: '333333', space: 1, style: BorderStyle.SINGLE, size: 8 } }, spacing: { after: 120 } }));
    }

    if (enabledSections.includes('professionalSummary') && data.professionalSummary) {
      const txt = typeof data.professionalSummary === 'string' ? data.professionalSummary : data.professionalSummary.summary;
      if (txt) { sectionHeader('Professional Summary'); children.push(new Paragraph({ children: [new TextRun({ text: txt, size: 22, font })], spacing: { after: 80 } })); }
    }
    if (enabledSections.includes('experience') && data.experience?.length) {
      sectionHeader('Experience');
      data.experience.forEach(exp => {
        children.push(new Paragraph({ children: [new TextRun({ text: `${exp.position} @ ${exp.company}`, bold: true, size: 22, font }), new TextRun({ text: `  (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})`, size: 18, color: gray500, font })], spacing: { before: 60, after: 10 } }));
        if (exp.description) children.push(new Paragraph({ children: [new TextRun({ text: exp.description, size: 20, font })], spacing: { after: 10 } }));
        if (exp.achievements?.length) exp.achievements.forEach(a => children.push(new Paragraph({ children: [new TextRun({ text: `•  ${a}`, size: 20, font })], indent: { left: 480 }, spacing: { after: 6 } })));
        sp(40);
      });
    }
    if (enabledSections.includes('skills') && normalizedSkills.length > 0) {
      sectionHeader('Skills');
      children.push(new Paragraph({ children: [new TextRun({ text: skillsToText(normalizedSkills, template, ', '), size: 20, font })], spacing: { after: 80 } }));
    }
    if (enabledSections.includes('education') && data.education?.length) {
      sectionHeader('Education');
      data.education.forEach(edu => {
        children.push(new Paragraph({ children: [new TextRun({ text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`, bold: true, size: 22, font }), new TextRun({ text: ` — ${edu.institution}`, size: 20, font })], spacing: { before: 40, after: 6 } }));
        children.push(new Paragraph({ children: [new TextRun({ text: `${edu.startDate} - ${edu.endDate}`, size: 16, color: gray500, font })], spacing: { after: 16 } }));
      });
    }
    if (enabledSections.includes('projects') && data.projects?.length) {
      sectionHeader('Projects');
      data.projects.forEach(proj => {
        children.push(new Paragraph({ children: [new TextRun({ text: proj.name, bold: true, size: 22, font })], spacing: { before: 40, after: 6 } }));
        if (proj.description) children.push(new Paragraph({ children: [new TextRun({ text: proj.description, size: 20, font })], spacing: { after: 16 } }));
      });
    }
    if (enabledSections.includes('certifications') && data.certifications?.length) {
      sectionHeader('Certifications');
      data.certifications.forEach(cert => children.push(new Paragraph({ children: [new TextRun({ text: `${cert.name} — ${cert.issuer} (${cert.date})`, size: 20, font })], spacing: { after: 16 } })));
    }
    if (enabledSections.includes('achievements') && data.achievements?.length) {
      sectionHeader('Achievements');
      data.achievements.forEach(ach => {
        children.push(new Paragraph({ children: [new TextRun({ text: ach.title, bold: true, size: 20, font }), new TextRun({ text: ` — ${ach.date}`, size: 18, color: gray500, font })], spacing: { before: 30, after: 6 } }));
        if (ach.description) children.push(new Paragraph({ children: [new TextRun({ text: ach.description, size: 18, font })], spacing: { after: 16 } }));
      });
    }
  }

  // ── Generate and download ──
  const doc = new DocxDocument({
    sections: [{
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
          size: { width: 11906, height: 16838 }, // A4
        },
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};