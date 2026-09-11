import { createFileRoute } from "@tanstack/react-router";
import { IndustryDashboard } from "@/components/industry-portal";

export const Route = createFileRoute("/industry/")({
  component: IndustryDashboard,
});
