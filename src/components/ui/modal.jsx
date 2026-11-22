"use client";

import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

import Button from "@/components/ui/button";
import { cn } from "@/lib/format";

/**
 * Accessible modal built on the native <dialog> element:
 * focus trapping, Escape-to-close and the top layer come for free.
 */
export default function Modal({ open, onClose, title, children, className, hideTitle = false }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        // Clicking the backdrop (the dialog element itself) closes it.
        if (event.target === dialogRef.current) onClose();
      }}
      aria-label={hideTitle ? title : undefined}
      className={cn(
        "m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-line bg-surface-raised p-0 text-fg shadow-2xl backdrop:bg-black/50",
        className,
      )}
    >
      {open && (
        <div className="relative p-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-lg text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg"
          >
            <FiX />
          </button>
          {!hideTitle && <h2 className="pr-10 text-xl font-semibold">{title}</h2>}
          {children}
        </div>
      )}
    </dialog>
  );
}

/** Yes/No confirmation built on Modal (logout, delete account, delete category...). */
export function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", loading, tone = "danger" }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      {description && <p className="mt-3 text-sm leading-6 text-fg-muted">{description}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={onClose} className="rounded-full">
          {cancelLabel}
        </Button>
        <Button variant={tone === "danger" ? "danger" : "primary"} size="sm" onClick={onConfirm} loading={loading} className="min-w-24 rounded-full">
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
