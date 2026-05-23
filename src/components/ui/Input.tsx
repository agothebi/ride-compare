import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, id, className = "", ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-[15px] font-medium text-text-muted"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`min-h-12 w-full rounded-[var(--radius-app)] border border-border bg-surface-raised px-4 text-[17px] text-text outline-none transition-[border-color,box-shadow] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent/25 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    </div>
  );
}
