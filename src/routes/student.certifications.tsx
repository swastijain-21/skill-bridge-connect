import { createFileRoute } from "@tanstack/react-router";
import { StudentCertifications } from "@/components/student-portal";

export const Route = createFileRoute("/student/certifications")({
  component: StudentCertifications,
});
