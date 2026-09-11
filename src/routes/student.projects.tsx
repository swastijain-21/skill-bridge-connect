import { createFileRoute } from "@tanstack/react-router";
import { StudentProjects } from "@/components/student-portal";

export const Route = createFileRoute("/student/projects")({
  component: StudentProjects,
});
