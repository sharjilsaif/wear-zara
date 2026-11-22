"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import Link from "next/link";
import { LuCircleAlert, LuCircleCheck, LuInfo, LuX } from "react-icons/lu";

import { useI18n } from "@/i18n/client";

const ToastContext = createContext(() => {});

const ICONS = {
  success: <LuCircleCheck className="text-success" />,
  error: <LuCircleAlert className="text-sale" />,
  info: <LuInfo className="text-brand" />,
};

/** Usage: const toast = useToast(); toast({ title, description, type, action: { label, href } }) */
export function ToastProvider({ children }) {
  const { t } = useI18n();
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => setToasts((current) => current.filter((toast) => toast.id !== id)), []);

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
        className="pointer-events-none fixed inset-x-3 bottom-4 z-[1000] flex flex-col items-center gap-2 sm:inset-x-auto sm:end-6 sm:bottom-6 sm:items-end"
      >
        {toasts.map((item) => (
          <div key={item.id} role="status" className="glass-strong pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-2xl p-4 text-fg">
            <span className="mt-0.5 text-lg">{ICONS[item.type]}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{item.title}</p>
              {item.description && <p className="mt-0.5 line-clamp-2 text-xs text-fg-muted">{item.description}</p>}
              {item.action && (
                <Link href={item.action.href} onClick={() => dismiss(item.id)} className="mt-2 inline-block text-xs font-semibold text-link hover:underline">
                  {item.action.label}
                </Link>
              )}
            </div>
            <button
              type="button"
              aria-label={t("common.dismiss")}
              onClick={() => dismiss(item.id)}
              className="rounded-full p-1 text-fg-muted transition-colors hover:bg-fg/6 hover:text-fg"
            >
              <LuX />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
