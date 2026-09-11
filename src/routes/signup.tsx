import { createFileRoute } from "@tanstack/react-router";
import { SignupForm } from "@/components/auth-form";

export const Route = createFileRoute("/signup")({
  component: SignupForm,
});
