import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <main className="mx-auto flex w-full max-w-[430px] flex-1 flex-col px-5 pb-8 pt-[max(1.5rem,env(safe-area-inset-top))]">
        {children}
      </main>
    </div>
  );
}
