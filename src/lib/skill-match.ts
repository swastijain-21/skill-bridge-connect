export type SkillRequirement = {
  skillId: string;
  name: string;
  minProficiency: number;
  weight: number;
};

export type SkillStatus = "met" | "partial" | "gap";

export type SkillBreakdown = {
  skillId: string;
  name: string;
  required: number;
  actual: number;
  status: SkillStatus;
  weight: number;
  evidence: ("resume" | "assessment" | "profile")[];
};

export type MatchResult = {
  score: number;
  breakdown: SkillBreakdown[];
  missing: string[];
  metCount: number;
};

export function statusFor(actual: number, required: number): SkillStatus {
  if (required <= 0) return "met";
  if (actual >= required) return "met";
  if (actual >= required * 0.6) return "partial";
  return "gap";
}

/**
 * Deterministic, rule-based match engine.
 * Each required skill contributes weight * min(actual / required, 1).
 * Score = weighted coverage of the opportunity's requirements, 0-100.
 */
export function computeMatch(
  requirements: SkillRequirement[],
  studentSkills: Record<string, number>,
  evidence: Record<string, ("resume" | "assessment" | "profile")[]> = {},
): MatchResult {
  if (requirements.length === 0) {
    return { score: 0, breakdown: [], missing: [], metCount: 0 };
  }

  let weighted = 0;
  let totalWeight = 0;
  const breakdown: SkillBreakdown[] = [];
  const missing: string[] = [];

  for (const req of requirements) {
    const weight = req.weight > 0 ? req.weight : 1;
    const actual = studentSkills[req.skillId] ?? 0;
    const required = req.minProficiency > 0 ? req.minProficiency : 1;
    const coverage = Math.min(actual / required, 1);
    weighted += coverage * weight;
    totalWeight += weight;

    const status = statusFor(actual, req.minProficiency);
    if (status !== "met") missing.push(req.name);
    breakdown.push({
      skillId: req.skillId,
      name: req.name,
      required: req.minProficiency,
      actual,
      status,
      weight,
      evidence: evidence[req.skillId] ?? (actual > 0 ? ["profile"] : []),
    });
  }

  breakdown.sort((a, b) => b.weight - a.weight || a.name.localeCompare(b.name));

  return {
    score: Math.round((weighted / totalWeight) * 100),
    breakdown,
    missing,
    metCount: breakdown.filter((b) => b.status === "met").length,
  };
}

export function matchTone(score: number): "met" | "partial" | "gap" {
  if (score >= 75) return "met";
  if (score >= 50) return "partial";
  return "gap";
}

/** Readiness = weighted blend of skill depth and breadth against industry demand. */
export function careerReadiness(
  skills: { proficiency: number; demand: number }[],
  profileCompletion: number,
): number {
  if (skills.length === 0) return Math.round(profileCompletion * 0.3);
  const demandWeighted =
    skills.reduce((sum, s) => sum + s.proficiency * (s.demand / 100), 0) /
    skills.reduce((sum, s) => sum + s.demand / 100, 0);
  const breadth = Math.min(skills.length / 8, 1) * 100;
  return Math.round(demandWeighted * 0.6 + breadth * 0.2 + profileCompletion * 0.2);
}
