import { Outlet, createFileRoute } from "@tanstack/react-router";
import { IndustryShell } from "@/components/industry-portal";

export const Route = createFileRoute("/industry")({
  component: () => (
    <IndustryShell>
      <Outlet />
    </IndustryShell>
  ),
});
