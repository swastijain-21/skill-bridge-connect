import { Outlet, createFileRoute } from "@tanstack/react-router";
import { StudentShell } from "@/components/student-portal";

export const Route = createFileRoute("/student")({
  component: () => (
    <StudentShell>
      <Outlet />
    </StudentShell>
  ),
});
