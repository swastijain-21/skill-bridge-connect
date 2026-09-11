import { createFileRoute } from "@tanstack/react-router";
import { IndustryApplications } from "@/components/industry-portal";

export const Route = createFileRoute("/industry/applications")({
  component: IndustryApplications,
});
