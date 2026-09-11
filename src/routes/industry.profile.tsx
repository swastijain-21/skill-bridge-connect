import { createFileRoute } from "@tanstack/react-router";
import { IndustryProfile } from "@/components/industry-portal";

export const Route = createFileRoute("/industry/profile")({
  component: IndustryProfile,
});
