import { createFileRoute } from "@tanstack/react-router";
import { StudentProfile } from "@/components/student-portal";

export const Route = createFileRoute("/student/profile")({
  component: StudentProfile,
});
