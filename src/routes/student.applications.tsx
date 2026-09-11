import { createFileRoute } from "@tanstack/react-router";
import { StudentApplications } from "@/components/student-portal";

export const Route = createFileRoute("/student/applications")({
  component: StudentApplications,
});
