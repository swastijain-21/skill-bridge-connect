import { createFileRoute } from "@tanstack/react-router";
import { StudentLearning } from "@/components/student-portal";

export const Route = createFileRoute("/student/learning")({
  component: StudentLearning,
});
