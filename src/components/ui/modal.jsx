"use client";

import { useEffect, useRef } from "react";
import { LuX } from "react-icons/lu";

import Button from "@/components/ui/button";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/format";

const SIZES = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  xl: "sm:max-w-[min(64rem,calc(100vw-3rem))] lg:w-[70vw]",
};

/**
 * Native <dialog>: focus trapping, Escape-to-close and the top layer for free.
 * A bottom sheet on phones, a centred glass card from `sm` up (animations live in globals.css).
 * `bare` drops the inner padding so content (e.g. an image) can run edge to edge.
 */
export default function Modal({ open, onClose, title, children, className, size = "md", bare = false, hideTitle = false }) {
  const { t } = useI18n();
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.focus(); // focus the sheet itself, not the close button (no stray focus ring)
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => event.target === ref.current && onClose()}
      aria-label={hideTitle ? title : undefined}
      tabIndex={-1}
      className={cn(
        "glass-strong mx-auto mt-auto mb-0 outline-none max-h-[92dvh] w-full max-w-none overflow-y-auto overscroll-contain rounded-t-[2rem] p-0 text-fg sm:m-auto sm:w-[calc(100%-2rem)] sm:rounded-[2rem]",
        SIZES[size],
        className,
      )}
    >
      <div className={cn("relative", !bare && "p-6 sm:p-7")}>
        <span
          aria-hidden
          className={cn("mx-auto block h-1.5 w-10 rounded-full sm:hidden", bare ? "absolute inset-x-0 top-2.5 z-10 bg-white/70" : "-mt-2 mb-4 bg-fg/15")}
        />
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.close")}
          className="glass-strong absolute end-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-fg-muted transition-all hover:scale-105 hover:text-fg active:scale-90"
        >
          <LuX />
        </button>
        {!hideTitle && <h2 className="pe-10 text-xl font-semibold tracking-tight">{title}</h2>}
        {children}
      </div>
    </dialog>
  );
}

/** Apple-style alert: centred text, two equal buttons. */
export function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel, cancelLabel, loading, tone = "danger" }) {
  const { t } = useI18n();
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm" className="text-center">
      {description && <p className="mt-3 text-sm leading-6 text-fg-muted">{description}</p>}
      <div className="mt-7 grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={onClose}>
          {cancelLabel ?? t("common.cancel")}
        </Button>
        <Button variant={tone === "danger" ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
          {confirmLabel ?? t("common.confirm")}
        </Button>
      </div>
    </Modal>
  );
}
