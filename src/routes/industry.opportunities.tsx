import { createFileRoute } from "@tanstack/react-router";
import { IndustryOpportunities } from "@/components/industry-portal";

export const Route = createFileRoute("/industry/opportunities")({
  component: IndustryOpportunities,
});
