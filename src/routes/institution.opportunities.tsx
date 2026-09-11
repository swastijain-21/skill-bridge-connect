import { createFileRoute } from "@tanstack/react-router";
import { InstitutionOpportunities } from "@/components/institution-portal";

export const Route = createFileRoute("/institution/opportunities")({
  component: InstitutionOpportunities,
});
