import { cn } from "@/lib/format";

/** Unsplash CDN URL cropped to exactly w × h (smart-cropped around faces / the busiest area). */
export function unsplashUrl(id, { w, h, crop = "faces,entropy", q = 75 }) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=${crop}&q=${q}&auto=format`;
}

const srcSet = (source) => `${unsplashUrl(source.id, source)} 1x, ${unsplashUrl(source.id, { ...source, w: source.w * 2, h: source.h * 2, q: 60 })} 2x`;

/**
 * Art-directed image: a different crop (or a different photo) per screen size, so the subject
 * always fits — portrait on phones, wider on tablets, panoramic on desktops.
 * sources: [{ media, id, w, h, crop? }] from the widest breakpoint down; the last one (no media) is the phone fallback.
 */
export default function ArtImage({ sources, alt, priority = false, className }) {
  const fallback = sources[sources.length - 1];

  return (
    <picture>
      {sources.slice(0, -1).map((source) => (
        <source key={source.media} media={source.media} srcSet={srcSet(source)} />
      ))}
      {/* Plain <img> inside <picture> for art direction; Unsplash's CDN does the resizing. */}
      <img
        src={unsplashUrl(fallback.id, fallback)}
        srcSet={srcSet(fallback)}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={cn("absolute inset-0 h-full w-full object-cover", className)}
      />
    </picture>
  );
}

/** Standard breakpoints for full-width hero-style images. */
export const artSources = ({ phone, tablet = phone, desktop = tablet }) => [
  { media: "(min-width: 1024px)", w: 1600, h: 760, ...desktop },
  { media: "(min-width: 640px)", w: 1024, h: 720, ...tablet },
  { w: 640, h: 900, ...phone },
];
