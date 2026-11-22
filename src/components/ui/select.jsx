"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LuCheck, LuChevronDown } from "react-icons/lu";

import { cn } from "@/lib/format";

/**
 * Custom-designed dropdown (accessible listbox) used instead of the native <select>.
 * options: [{ value, label }]. Pass `name` to submit the value with a <form>.
 */
export default function Select({ value, onChange, options, label, hint, name, disabled, className, buttonClassName, align = "start" }) {
  const id = useId();
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (event) => !rootRef.current?.contains(event.target) && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open, active]);

  const openList = () => {
    setActive(Math.max(0, options.indexOf(selected)));
    setOpen(true);
  };
  const choose = (option) => {
    setOpen(false);
    if (option.value !== value) onChange(option.value);
  };

  const onKeyDown = (event) => {
    const keys = { ArrowDown: 1, ArrowUp: -1 };
    if (!open && ["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      return openList();
    }
    if (!open) return;
    if (event.key in keys) setActive((index) => (index + keys[event.key] + options.length) % options.length);
    else if (event.key === "Home") setActive(0);
    else if (event.key === "End") setActive(options.length - 1);
    else if (event.key === "Enter" || event.key === " ") choose(options[active]);
    else if (event.key === "Escape" || event.key === "Tab") return setOpen(false);
    else return;
    event.preventDefault();
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {label && (
        <span id={`${id}-label`} className="mb-2 block text-[13px] font-medium text-fg/85">
          {label}
        </span>
      )}
      {name && <input type="hidden" name={name} value={selected?.value ?? ""} />}
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={label ? `${id}-label` : undefined}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-field px-4 py-3 text-start text-[15px] text-fg shadow-[inset_0_1px_2px_rgb(0_0_0/0.04)] backdrop-blur-sm transition-all duration-200 hover:border-line-strong focus-visible:border-brand focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/15 disabled:opacity-55",
          open && "border-brand ring-4 ring-brand/15",
          buttonClassName,
        )}
      >
        <span className="truncate">{selected?.label}</span>
        <LuChevronDown aria-hidden className={cn("shrink-0 text-fg-muted transition-transform duration-300 ease-apple", open && "rotate-180")} />
      </button>

      <ul
        ref={listRef}
        id={`${id}-list`}
        role="listbox"
        aria-labelledby={label ? `${id}-label` : undefined}
        className={cn(
          "glass-strong absolute z-50 mt-2 max-h-72 min-w-full overflow-y-auto rounded-2xl p-1.5 transition-all duration-200 ease-apple",
          align === "end" ? "end-0" : "start-0",
          open ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-1 scale-[0.98] opacity-0",
        )}
      >
        {options.map((option, index) => {
          const isSelected = option.value === selected?.value;
          return (
            <li
              key={option.value}
              id={`${id}-${index}`}
              role="option"
              aria-selected={isSelected}
              onPointerEnter={() => setActive(index)}
              onClick={() => choose(option)}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-sm whitespace-nowrap transition-colors",
                index === active && "bg-fg/6",
                isSelected && "font-semibold",
              )}
            >
              {option.label}
              {isSelected && <LuCheck aria-hidden className="text-brand" />}
            </li>
          );
        })}
      </ul>
      {hint && <p className="mt-1.5 text-xs text-fg-muted">{hint}</p>}
    </div>
  );
}
