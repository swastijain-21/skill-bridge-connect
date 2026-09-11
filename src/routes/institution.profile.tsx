import { createFileRoute } from "@tanstack/react-router";
import { InstitutionProfile } from "@/components/institution-portal";

export const Route = createFileRoute("/institution/profile")({
  component: InstitutionProfile,
});
