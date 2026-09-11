import { createFileRoute } from "@tanstack/react-router";
import { InstitutionDashboard } from "@/components/institution-portal";

export const Route = createFileRoute("/institution/")({
  component: InstitutionDashboard,
});
