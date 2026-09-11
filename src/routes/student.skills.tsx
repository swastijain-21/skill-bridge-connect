import { createFileRoute } from "@tanstack/react-router";
import { StudentSkills } from "@/components/student-portal";

export const Route = createFileRoute("/student/skills")({
  component: StudentSkills,
});
