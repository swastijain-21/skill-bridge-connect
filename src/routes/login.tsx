import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/components/auth-form";

export const Route = createFileRoute("/login")({
  component: LoginForm,
});
