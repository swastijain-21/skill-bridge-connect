import { createFileRoute } from "@tanstack/react-router";
import { StudentDashboard } from "@/components/student-portal";

export const Route = createFileRoute("/student/")({
  component: StudentDashboard,
});
