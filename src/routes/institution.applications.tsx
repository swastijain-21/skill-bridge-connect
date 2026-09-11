import { createFileRoute } from "@tanstack/react-router";
import { InstitutionApplications } from "@/components/institution-portal";

export const Route = createFileRoute("/institution/applications")({
  component: InstitutionApplications,
});
