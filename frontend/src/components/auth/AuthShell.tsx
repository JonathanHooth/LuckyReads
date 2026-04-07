import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  eyebrow?: string;
  panelClassName?: string;
};

export default function AuthShell({
  title,
  subtitle,
  children,
  eyebrow = "LuckyReads",
  panelClassName = "",
}: AuthShellProps) {
  const panelClasses = ["login-panel", panelClassName].filter(Boolean).join(" ");

  return (
    <main className="login-shell">
      <section className={panelClasses}>
        <div className="login-copy">
          <p className="login-eyebrow">{eyebrow}</p>
          <h1 className="login-title">{title}</h1>
          <p className="login-subtitle">{subtitle}</p>
        </div>
        {children}
      </section>
    </main>
  );
}
