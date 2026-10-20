export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-surface-elevated/40">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center gap-4 px-4 py-8 sm:px-6 lg:px-8">
        <a
          href="https://subarna.me"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex flex-col items-center gap-1.5 rounded-xl px-4 py-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="subarna.me"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]" />
          <span className="text-base font-semibold tracking-tight text-ink group-hover:text-accent">
            subarna.me
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-ink-muted">
            Teleprompter
          </span>
        </a>

        <div className="h-px w-16 bg-border" aria-hidden="true" />

        <p className="text-sm text-ink-muted">
          Developed by{" "}
          <a
            href="https://sagardash.me"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent underline-offset-4 transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Sagar Dash
          </a>
        </p>
      </div>
    </footer>
  );
}
