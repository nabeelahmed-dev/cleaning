import {
  Building2,
  CalendarDays,
  House,
  Leaf,
  ShieldCheck,
  Sparkles,
  Store,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { site } from "@/lib/site";

export const icons: Record<string, LucideIcon> = {
  house: House,
  building: Building2,
  store: Store,
  leaf: Leaf,
  shield: ShieldCheck,
  sparkles: Sparkles,
  trash: Trash2,
  calendar: CalendarDays,
};

// Four-point sparkle used as the brand mark.
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 0c.9 6.6 4.5 10.2 12 12-7.5 1.8-11.1 5.4-12 12-.9-6.6-4.5-10.2-12-12 7.5-1.8 11.1-5.4 12-12Z" />
    </svg>
  );
}

export function Logo({ light = true }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <Sparkle className={`h-7 w-7 ${light ? "text-white" : "text-azure"}`} />
      <span className="leading-none">
        <span
          className={`block text-xl font-semibold tracking-tight ${
            light ? "text-white" : "text-ink"
          }`}
        >
          {site.name}
        </span>
        <span
          className={`mt-1 block text-[0.55rem] font-medium uppercase tracking-[0.28em] ${
            light ? "text-white/70" : "text-ink/55"
          }`}
        >
          {site.tagline}
        </span>
      </span>
    </span>
  );
}
