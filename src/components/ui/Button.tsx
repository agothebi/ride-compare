import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "accent" | "uber" | "lyft" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  accent:
    "bg-accent text-white active:bg-[var(--color-accent-pressed)] disabled:bg-surface-raised disabled:text-text-muted",
  uber: "bg-black text-white active:opacity-80 disabled:opacity-40",
  lyft: "bg-[#FF00BF] text-white active:opacity-80 disabled:opacity-40",
  secondary:
    "border border-border bg-surface-raised text-text active:bg-surface disabled:text-text-muted",
};

export function Button({
  variant = "accent",
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`flex min-h-12 w-full items-center justify-center rounded-[var(--radius-app)] px-4 text-[17px] font-medium transition-opacity duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
