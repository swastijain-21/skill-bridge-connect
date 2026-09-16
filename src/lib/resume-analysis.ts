/**
 * Deterministic resume analysis.
 * No AI, no randomness: the same resume text always produces the same result.
 */

export type ResumeFileKind = "pdf" | "docx" | "txt";

export type DetectedSkill = {
  skillId: string;
  name: string;
  occurrences: number;
  inSkillsSection: boolean;
  years: number | null;
  confidence: number;
  proficiency: number;
  evidence: string;
};

export type SkillCatalogEntry = { id: string; name: string };

export const ACCEPTED_MIME =
  "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain";

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export function kindForFile(file: File): ResumeFileKind | null {
  const name = file.name.toLowerCase();
  if (file.type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  )
    return "docx";
  if (file.type === "text/plain" || name.endsWith(".txt")) return "txt";
  return null;
}

export function extensionFor(kind: ResumeFileKind) {
  return kind;
}

/** Browser-only text extraction. Heavy parsers are imported lazily. */
export async function extractResumeText(file: File, kind: ResumeFileKind): Promise<string> {
  if (kind === "txt") return await file.text();

  if (kind === "docx") {
    const mammoth = await import("mammoth/mammoth.browser.js");
    const arrayBuffer = await file.arrayBuffer();
    const result = await (mammoth as unknown as {
      extractRawText: (input: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
    }).extractRawText({ arrayBuffer });
    return result.value ?? "";
  }

  const pdfjs = await import("pdfjs-dist");
  const workerSrc = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= doc.numPages; i += 1) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    pages.push(
      content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ")
        .replace(/\s+/g, " "),
    );
  }
  return pages.join("\n");
}

/** Extra spellings mapped onto catalogue skill names. */
const ALIASES: Record<string, string[]> = {
  python: ["python3", "py"],
  sql: ["postgresql", "postgres", "mysql", "plsql", "t-sql", "sqlite"],
  "data analysis": ["data analytics", "data analyst", "pandas", "numpy"],
  "power bi": ["powerbi", "power-bi"],
  "machine learning": ["ml", "scikit-learn", "sklearn", "tensorflow", "pytorch", "deep learning"],
  javascript: ["js", "es6", "ecmascript", "typescript"],
  react: ["reactjs", "react.js", "next.js", "nextjs"],
  "node.js": ["node", "nodejs", "express.js", "expressjs"],
  java: ["spring boot", "springboot", "jvm"],
  "cloud computing": ["aws", "azure", "gcp", "google cloud", "cloud"],
  excel: ["ms excel", "microsoft excel", "spreadsheets"],
  communication: ["presentation skills", "public speaking", "stakeholder communication"],
  teamwork: ["collaboration", "team player", "cross-functional"],
  "problem solving": ["problem-solving", "analytical thinking", "critical thinking"],
  cybersecurity: ["cyber security", "infosec", "information security", "penetration testing"],
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function termsFor(name: string) {
  const key = name.toLowerCase();
  return [key, ...(ALIASES[key] ?? [])];
}

function splitSentences(text: string) {
  return text
    .split(/(?<=[.!?•\n])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Region of the resume under a "skills"/"technical skills" heading. */
function skillsSection(text: string) {
  const match = /(^|\n)\s*(technical\s+skills|core\s+skills|key\s+skills|skills)\s*[:\n]/i.exec(text);
  if (!match) return "";
  const start = match.index + match[0].length;
  const rest = text.slice(start);
  const next = /\n\s*(experience|education|projects|certifications|achievements|summary)\b/i.exec(rest);
  return next ? rest.slice(0, next.index) : rest.slice(0, 1200);
}

export function confidenceToProficiency(confidence: number) {
  return Math.max(20, Math.min(95, Math.round(confidence * 0.9)));
}

export function analyzeResume(text: string, catalog: SkillCatalogEntry[]): DetectedSkill[] {
  const normalized = text.replace(/\r/g, "");
  const lower = normalized.toLowerCase();
  const section = skillsSection(normalized).toLowerCase();
  const sentences = splitSentences(normalized);
  const detected: DetectedSkill[] = [];

  for (const skill of catalog) {
    const terms = termsFor(skill.name);
    let occurrences = 0;
    let matchedTerm: string | null = null;
    let inSkillsSection = false;

    for (const term of terms) {
      const pattern = new RegExp(`(^|[^a-z0-9+#.])${escapeRegExp(term)}([^a-z0-9+#]|$)`, "gi");
      const count = (lower.match(pattern) ?? []).length;
      if (count > 0) {
        occurrences += count;
        if (!matchedTerm) matchedTerm = term;
        if (section && pattern.test(section)) inSkillsSection = true;
      }
    }

    if (occurrences === 0 || !matchedTerm) continue;

    const evidenceSentence =
      sentences.find((s) => s.toLowerCase().includes(matchedTerm!)) ?? "";
    const yearsMatch = /(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)/i.exec(evidenceSentence);
    const years = yearsMatch?.[1] ? Number(yearsMatch[1]) : null;

    let confidence = 35;
    confidence += Math.min(occurrences - 1, 4) * 10;
    if (inSkillsSection) confidence += 20;
    if (years) confidence += Math.min(years, 3) * 7;
    confidence = Math.max(20, Math.min(100, Math.round(confidence)));

    detected.push({
      skillId: skill.id,
      name: skill.name,
      occurrences,
      inSkillsSection,
      years,
      confidence,
      proficiency: confidenceToProficiency(confidence),
      evidence: evidenceSentence.slice(0, 240),
    });
  }

  return detected.sort((a, b) => b.confidence - a.confidence || a.name.localeCompare(b.name));
}
