import { createFileRoute } from "@tanstack/react-router";
import { StudentOpportunities } from "@/components/student-portal";

export const Route = createFileRoute("/student/opportunities")({
  component: StudentOpportunities,
});
