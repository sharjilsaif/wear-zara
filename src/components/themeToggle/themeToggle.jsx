"use client";

import React, { useEffect, useState } from "react";

const ThemeToggle = ({ isDark, setTheme }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-6 w-11" />;
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-[2px] transition-colors duration-300 ease-in-out ${
        isDark ? "bg-[#2a2a2a]" : "bg-[#efefef]"
      }`}
    >
      {/* 🚀 GPU-Accelerated Knob */}
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full transition-all duration-300 ease-in-out ${
          isDark
            ? "translate-x-5 bg-[#efefef]"
            : "translate-x-0 bg-[#2a2a2a]"
        }`}
      />
    </button>
  );
};

export default ThemeToggle;