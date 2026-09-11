import { Link, createFileRoute } from "@tanstack/react-router";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="landing-page min-h-screen px-5 py-6 text-white sm:px-8 sm:py-8">
      <div className="landing-backdrop" aria-hidden="true">
        <span className="landing-node landing-node-one" />
        <span className="landing-node landing-node-two" />
        <span className="landing-node landing-node-three" />
        <span className="landing-node landing-node-four" />
      </div>
      <main className="landing-content mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col">
        <header className="flex items-center justify-between">
          <Link
            to="/"
            className="landing-wordmark inline-flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-slate-200"
          >
            <span className="landing-mark" aria-hidden="true">
              SB
            </span>
            <span className="hidden sm:inline">SKILLBRIDGE CONNECT</span>
            <span className="sm:hidden">SKILLBRIDGE</span>
          </Link>
          <span className="landing-status hidden items-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-slate-400 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
            Academic · Industry Network
          </span>
        </header>

        <section className="landing-hero grid flex-1 items-center gap-12 py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.7fr)] lg:gap-20 lg:py-20">
          <div>
            <p className="landing-eyebrow text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200/80">
              Welcome to the connected future
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              SkillBridge <span className="landing-title-accent">Connect</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
              Bridging Academic Skills with Industry Opportunities
            </p>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-400">
              A focused space for learners, institutions, and employers to turn potential into
              meaningful progress.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="landing-primary inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="landing-secondary inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold text-slate-100 transition"
              >
                Sign Up
              </Link>
              <Link
                to="/student"
                className="landing-tertiary inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold text-slate-200 transition"
              >
                Go to Student Portal
              </Link>
            </div>
          </div>

          <div className="landing-panel rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
                  One shared direction
                </p>
                <p className="mt-2 text-lg font-semibold text-white">From learning to impact</p>
              </div>
              <span className="landing-panel-mark text-cyan-200" aria-hidden="true">
                ↗
              </span>
            </div>
            <div className="mt-6 space-y-5">
              {[
                ["01", "Assess", "Understand strengths and opportunities"],
                ["02", "Improve", "Build skills that move you forward"],
                ["03", "Match", "Find the right people and possibilities"],
              ].map(([number, title, description]) => (
                <div className="flex gap-4" key={number}>
                  <span className="pt-0.5 text-xs font-semibold tracking-[0.16em] text-cyan-200/70">
                    {number}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-100">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-white/10 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Built for the next generation of opportunity.</span>
          <span className="uppercase tracking-[0.16em]">SkillBridge Connect · SIH 2026</span>
        </footer>
      </main>
    </div>
  );
}
