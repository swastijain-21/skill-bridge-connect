import { createFileRoute } from "@tanstack/react-router";
import { StudentSkillGaps } from "@/components/student-portal";

export const Route = createFileRoute("/student/skill-gaps")({
  component: StudentSkillGaps,
});
