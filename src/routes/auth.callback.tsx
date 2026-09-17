import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { homeFor, provisionAuthenticatedUser } from "@/hooks/use-session";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const finishAuthentication = async () => {
      try {
        const code = new URLSearchParams(window.location.search).get("code");
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        }

        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!data.session) throw new Error("Your verification link is invalid or has expired.");

        const profile = await provisionAuthenticatedUser();
        window.location.assign(homeFor(profile.role));
      } catch (callbackError) {
        if (active) {
          setError(callbackError instanceof Error ? callbackError.message : "Unable to finish email verification.");
        }
      }
    };

    void finishAuthentication();
    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <section className="max-w-md text-center">
        {error ? (
          <>
            <h1 className="text-xl font-semibold">Verification could not be completed</h1>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold">Finishing your account setup</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your email is verified. We are preparing your portal.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
