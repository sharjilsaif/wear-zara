"use client";

import Image from "next/image";

const UNSPLASH_HOSTS = new Set(["images.unsplash.com", "plus.unsplash.com"]);

/** Let Unsplash's CDN resize/compress the image instead of re-optimizing it ourselves. */
function unsplashLoader({ src, width, quality }) {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality || 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  return url.toString();
}

function getHost(src) {
  try {
    return new URL(src).hostname;
  } catch {
    return null;
  }
}

/**
 * next/image wrapper for catalogue images. Works with any URL an admin pastes:
 * Unsplash gets responsive sizes via its CDN, other hosts are served as-is.
 */
export default function ProductImage({ src, alt, ...props }) {
  if (!src) return <Image src="/placeholder.svg" alt={alt} unoptimized {...props} />;

  const host = getHost(src);

  if (host && UNSPLASH_HOSTS.has(host)) {
    return <Image src={src} alt={alt} loader={unsplashLoader} {...props} />;
  }

  return <Image src={src} alt={alt} unoptimized={Boolean(host)} {...props} />;
}
