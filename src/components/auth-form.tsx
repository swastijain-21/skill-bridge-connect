import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { homeFor, provisionAuthenticatedUser, type AppRole } from "@/hooks/use-session";

const publicRoles = [
  { value: "student", label: "Student" },
  { value: "institution", label: "Institution" },
  { value: "industry", label: "Industry" },
] as const;

function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <main className="auth-page auth-shell flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
      <div className="auth-backdrop" aria-hidden="true" />
      <section className="auth-layout relative z-10 w-full max-w-5xl">
        <div className="auth-brand-panel hidden rounded-3xl p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <Link
              to="/"
              className="auth-wordmark inline-flex items-center gap-3 text-sm font-semibold tracking-[0.2em]"
            >
              <span className="auth-mark" aria-hidden="true">
                SB
              </span>
              SKILLBRIDGE CONNECT
            </Link>
            <p className="mt-24 max-w-sm text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200/80">
              Academic talent. Industry opportunity.
            </p>
            <h2 className="mt-5 max-w-md text-4xl font-semibold leading-tight tracking-tight text-white">
              Build the bridge to what comes next.
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
              A connected space for learners, institutions, and employers to
              turn potential into progress.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
            <span className="h-px w-10 bg-cyan-300/70" />
            SkillBridge Connect · SIH 2026
          </div>
        </div>
        <div className="w-full lg:max-w-md lg:justify-self-end">
          <Link
            to="/"
            className="auth-mobile-wordmark mb-6 block text-center text-sm font-semibold tracking-[0.2em] text-white lg:hidden"
          >
            SKILLBRIDGE CONNECT
          </Link>
          <div className="auth-card rounded-3xl p-7 sm:p-10">
            <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
            {children}
          </div>
          <div className="mt-6 text-center text-sm text-slate-300">{footer}</div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  required = true,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-slate-200">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="auth-input mt-2 block w-full rounded-xl px-4 py-3 text-slate-100 outline-none transition"
      />
    </label>
  );
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signInError) {
      setError(signInError.message);
      setSubmitting(false);
      return;
    }

    try {
      const profile = await provisionAuthenticatedUser({ email });
      window.location.assign(homeFor(profile.role));
    } catch (provisioningError) {
      setError(provisioningError instanceof Error ? provisioningError.message : "Unable to finish setting up your account.");
      setSubmitting(false);
      return;
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to continue building your path with SkillBridge."
      footer={
        <>
          New to SkillBridge?{" "}
          <Link to="/signup" className="font-semibold text-cyan-200 underline underline-offset-4">
            Sign Up
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="auth-form mt-8 space-y-5">
        <Field label="Email" type="email" value={email} onChange={setEmail} />
        <Field label="Password" type="password" value={password} onChange={setPassword} />
        {error && <p className="rounded-xl border border-red-300/20 bg-red-400/10 px-3 py-2 text-sm text-red-200">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="auth-submit w-full rounded-xl px-4 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </AuthShell>
  );
}

export function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<AppRole>("student");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          role,
        },
      },
    });
    if (signUpError) {
      setError(signUpError.message);
      setSubmitting(false);
      return;
    }
    if (!data.user || !data.session) {
      setPendingVerificationEmail(email.trim());
      setMessage("Check your email to confirm your account, then sign in.");
      setVerificationPending(true);
      setSubmitting(false);
      return;
    }

    try {
      await provisionAuthenticatedUser({
        fullName,
        email,
        role,
      });
    } catch (provisioningError) {
      setError(provisioningError instanceof Error ? provisioningError.message : "Unable to finish setting up your account.");
      setSubmitting(false);
      return;
    }
    window.location.assign(homeFor(role));
  };

  const resendVerificationEmail = async () => {
    const verificationEmail = pendingVerificationEmail;
    if (!verificationEmail) {
      setError("Enter your email address before requesting a new verification email.");
      return;
    }

    setError("");
    setMessage("");
    setResending(true);
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: verificationEmail,
    });
    if (resendError) {
      setError(resendError.message);
      setResending(false);
      return;
    }

    setMessage("Verification email sent. Please check your inbox.");
    setResending(false);
  };

  return (
    <AuthShell
      title="Create your account"
      description="Choose your role to get started with SkillBridge Connect."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-cyan-200 underline underline-offset-4">
            Sign In
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="auth-form mt-8 space-y-5">
        <Field label="Full name" value={fullName} onChange={setFullName} />
        <Field label="Email" type="email" value={email} onChange={setEmail} />
        <Field label="Password" type="password" value={password} onChange={setPassword} />
        <Field
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
        <fieldset>
          <legend className="text-sm font-medium text-slate-200">I am joining as</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {publicRoles.map((option) => (
              <label
                key={option.value}
                className={`auth-role cursor-pointer rounded-xl border px-2 py-2.5 text-center text-xs font-medium transition ${
                  role === option.value
                    ? "auth-role-selected text-white"
                    : "border-slate-600/80 text-slate-300 hover:border-cyan-300/70 hover:text-white"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={role === option.value}
                  onChange={() => setRole(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
        {error && <p className="rounded-xl border border-red-300/20 bg-red-400/10 px-3 py-2 text-sm text-red-200">{error}</p>}
        {message && <p className="rounded-xl border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">{message}</p>}
        {verificationPending && (
          <button
            type="button"
            onClick={resendVerificationEmail}
            disabled={resending}
            className="auth-secondary w-full rounded-xl px-4 py-3 font-semibold text-slate-100 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {resending ? "Sending Verification Email..." : "Resend verification email"}
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="auth-submit w-full rounded-xl px-4 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
    </AuthShell>
  );
}
