import { Icon, type IconName } from "./ui/Icon";

type DropdownRowProps = {
  icon: IconName;
  primary: string;
  secondary?: string;
  onSelect: () => void;
};

export function DropdownRow({
  icon,
  primary,
  secondary,
  onSelect,
}: DropdownRowProps) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onSelect}
      className="flex min-h-12 w-full items-center gap-3 px-4 py-2.5 text-left transition-colors active:bg-surface-raised"
    >
      <Icon name={icon} className="h-5 w-5 shrink-0 text-text-muted" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[17px] text-text">{primary}</span>
        {secondary ? (
          <span className="block truncate text-[13px] text-text-muted">
            {secondary}
          </span>
        ) : null}
      </span>
    </button>
  );
}
