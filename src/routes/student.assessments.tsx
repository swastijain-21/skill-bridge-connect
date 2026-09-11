import { createFileRoute } from "@tanstack/react-router";
import { StudentAssessments } from "@/components/student-portal";

export const Route = createFileRoute("/student/assessments")({
  component: StudentAssessments,
});
