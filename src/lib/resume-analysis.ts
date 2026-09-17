import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type CatalogSkill = { id: string; name: string };

export type ResumeSkillMatch = {
  skillId: string;
  evidence: string;
  confidence: number;
};

const aliases: Record<string, string[]> = {
  javascript: ["javascript", "js", "ecmascript"],
  typescript: ["typescript", "ts"],
  react: ["react", "reactjs", "react.js"],
  "node.js": ["node.js", "nodejs", "node"],
  "html/css": ["html/css", "html", "css"],
  postgresql: ["postgresql", "postgres"],
  python: ["python", "py"],
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[.#/+]/g, "").replace(/\s+/g, " ").trim();
}

export async function extractResumeText(file: File): Promise<string> {
  if (file.type === "text/plain") return file.text();
  const buffer = await file.arrayBuffer();

  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    const document = await pdfjs.getDocument({ data: buffer }).promise;
    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
    }
    return pages.join("\n");
  }

  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.toLowerCase().endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    return result.value;
  }

  throw new Error("Unsupported resume format. Upload a PDF, DOCX, or plain text file.");
}

export function extractKnownSkills(text: string, catalog: CatalogSkill[]): ResumeSkillMatch[] {
  const normalizedText = normalize(text);
  if (!normalizedText) return [];

  const matches: ResumeSkillMatch[] = [];
  for (const skill of catalog) {
    const skillName = normalize(skill.name);
    const terms = [skillName, ...(aliases[skillName] ?? [])].map(normalize);
    const matchedTerm = terms.find((term) => term.length >= 2 && normalizedText.includes(term));
    if (!matchedTerm) continue;

    const index = normalizedText.indexOf(matchedTerm);
    const evidenceStart = Math.max(0, index - 70);
    const evidence = text.slice(evidenceStart, evidenceStart + 180).replace(/\s+/g, " ").trim();
    matches.push({ skillId: skill.id, evidence, confidence: matchedTerm === skillName ? 0.9 : 0.8 });
  }
  return matches;
}
