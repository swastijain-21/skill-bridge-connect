import { createFileRoute } from "@tanstack/react-router";
import { InstitutionStudents } from "@/components/institution-portal";

export const Route = createFileRoute("/institution/students")({
  component: InstitutionStudents,
});
