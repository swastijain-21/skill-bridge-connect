import { Outlet, createFileRoute } from "@tanstack/react-router";
import { InstitutionShell } from "@/components/institution-portal";

export const Route = createFileRoute("/institution")({
  component: () => (
    <InstitutionShell>
      <Outlet />
    </InstitutionShell>
  ),
});
