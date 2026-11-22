"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import Link from "next/link";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

import { cn } from "@/lib/format";

const ToastContext = createContext(() => {});

const ICONS = {
  success: <FiCheckCircle className="text-green-500" />,
  error: <FiAlertCircle className="text-red-500" />,
  info: <FiInfo className="text-sky-500" />,
};

/**
 * Lightweight notifications.
 * Usage: const toast = useToast(); toast({ title, description, type, action: { label, href } })
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    ({ type = "success", duration = 3500, ...rest }) => {
      const id = ++nextId.current;
      setToasts((current) => [...current.slice(-2), { id, type, ...rest }]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[1000] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-xl border border-line bg-surface-raised p-4 text-fg shadow-xl"
          >
            <span className="mt-0.5 text-lg">{ICONS[item.type]}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{item.title}</p>
              {item.description && <p className="mt-0.5 truncate text-xs text-fg-muted">{item.description}</p>}
              {item.action && (
                <Link
                  href={item.action.href}
                  onClick={() => dismiss(item.id)}
                  className={cn("mt-2 inline-block text-xs font-semibold text-brand hover:underline")}
                >
                  {item.action.label}
                </Link>
              )}
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => dismiss(item.id)}
              className="text-fg-muted transition-colors hover:text-fg"
            >
              <FiX />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
