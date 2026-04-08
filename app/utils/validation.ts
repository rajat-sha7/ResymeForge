export const hasHTML = (text: string | undefined) => {
  if (!text) return false;
  return /<[^>]+>/.test(text);
};

export const maxLength = (text: string | undefined, len: number) => {
  if (!text) return true;
  return text.length <= len;
};

export const isRequired = (text: string | undefined) => {
  return !!(text && text.toString().trim().length > 0);
};

export const isValidURL = (url: string | undefined) => {
  if (!url) return true;
  try {
    // basic url check
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return !!u.hostname;
  } catch {
    return false;
  }
};

export const validateBullets = (bullets: (string | undefined)[] | undefined, min = 10, max = 220) => {
  if (!bullets) return true;
  for (const b of bullets) {
    if (!b) return false;
    const t = b.trim();
    if (t.length < min || t.length > max) return false;
    if (hasHTML(t)) return false;
  }
  return true;
};

export const sanitizeText = (text: string | undefined) => {
  if (!text) return '';
  return text.replace(/<[^>]+>/g, '').trim();
};
