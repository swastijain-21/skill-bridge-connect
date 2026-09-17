import { createFileRoute } from "@tanstack/react-router";
import { StudentResume } from "@/components/student-portal";

export const Route = createFileRoute("/student/resume")({
  component: StudentResume,
});
