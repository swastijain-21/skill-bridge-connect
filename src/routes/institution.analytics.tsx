import { createFileRoute } from "@tanstack/react-router";
import { InstitutionAnalytics } from "@/components/institution-portal";

export const Route = createFileRoute("/institution/analytics")({
  component: InstitutionAnalytics,
});
