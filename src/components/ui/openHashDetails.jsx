"use client";

import { useEffect } from "react";

/** Opens the <details> whose id matches the URL hash (e.g. /faq#returns). */
export default function OpenHashDetails() {
  useEffect(() => {
    const open = () => {
      const target = window.location.hash && document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target?.tagName === "DETAILS") target.open = true;
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);

  return null;
}
