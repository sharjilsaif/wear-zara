import { cn, initials } from "@/lib/format";

const SIZES = { xs: "h-7 w-7 text-[10px]", sm: "h-9 w-9 text-xs", md: "h-11 w-11 text-sm", lg: "h-16 w-16 text-lg", xl: "h-28 w-28 text-3xl" };
const GRADIENTS = ["from-sky-400 to-blue-600", "from-violet-400 to-indigo-600", "from-pink-400 to-rose-600", "from-amber-400 to-orange-600", "from-emerald-400 to-teal-600"];

/** Profile picture, or coloured initials when the user hasn't uploaded one. */
export default function Avatar({ src, name = "", size = "md", className }) {
  const gradient = GRADIENTS[[...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % GRADIENTS.length];

  return (
    <span className={cn("relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white ring-1 ring-black/5", SIZES[size], !src && `bg-linear-to-br ${gradient}`, className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- small, already-optimised avatar served by our API
        <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <span aria-hidden>{initials(name)}</span>
      )}
    </span>
  );
}
