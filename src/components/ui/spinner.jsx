import { cn } from "@/lib/format";

export default function Spinner({ className }) {
  return (
    <span
      role="status"
      aria-label="…"
      className={cn("inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent", className)}
    />
  );
}
