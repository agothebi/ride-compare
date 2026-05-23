import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
  footer?: ReactNode;
};

export function AppShell({ children, footer }: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="mx-auto flex w-full max-w-[430px] flex-1 flex-col px-5 pt-[max(1.5rem,env(safe-area-inset-top))]">
        {children}
      </main>
      {footer ? (
        <footer className="mx-auto w-full max-w-[430px] px-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {footer}
        </footer>
      ) : null}
    </div>
  );
}
