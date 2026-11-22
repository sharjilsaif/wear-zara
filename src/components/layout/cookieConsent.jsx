"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LuCookie } from "react-icons/lu";

import Button from "@/components/ui/button";
import { Switch } from "@/components/ui/formField";
import Modal from "@/components/ui/modal";
import { useI18n } from "@/i18n/client";

const COOKIE = "wz-consent";
const OPEN_EVENT = "wz:cookie-settings";
const CATEGORIES = ["necessary", "analytics", "marketing"];

function readConsent() {
  const raw = document.cookie.split("; ").find((part) => part.startsWith(`${COOKIE}=`));
  try {
    return raw ? JSON.parse(decodeURIComponent(raw.split("=")[1])) : null;
  } catch {
    return null;
  }
}

function saveConsent(choice) {
  const value = encodeURIComponent(JSON.stringify({ ...choice, necessary: true, date: new Date().toISOString() }));
  document.cookie = `${COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

/** Opens the cookie preferences dialog from anywhere (e.g. the footer link). */
export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN_EVENT));

/** GDPR-style cookie banner with Accept / Decline / Customise; the choice is remembered for a year. */
export default function CookieConsent() {
  const { t } = useI18n();
  const [banner, setBanner] = useState(false);
  const [settings, setSettings] = useState(false);
  const [choice, setChoice] = useState({ analytics: false, marketing: false });

  useEffect(() => {
    const saved = readConsent();
    // Show the banner shortly after load so it never blocks the first paint.
    const id = saved ? null : setTimeout(() => setBanner(true), 800);
    const open = () => {
      setChoice({ analytics: false, marketing: false, ...readConsent() });
      setSettings(true);
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => (clearTimeout(id), window.removeEventListener(OPEN_EVENT, open));
  }, []);

  const decide = (value) => {
    saveConsent(value);
    setBanner(false);
    setSettings(false);
  };

  return (
    <>
      {banner && (
        <div role="region" aria-label={t("cookies.title")} className="fixed inset-x-3 bottom-3 z-[900] flex justify-center sm:inset-x-6 sm:bottom-6">
          <div className="glass-strong flex w-full max-w-3xl animate-toast-in flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:p-6">
            <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-xl text-brand sm:flex">
              <LuCookie aria-hidden />
            </span>
            <div className="flex-1 text-sm">
              <p className="font-semibold">{t("cookies.title")}</p>
              <p className="mt-1 text-fg-muted">
                {t("cookies.text")}{" "}
                <Link href="/cookies" className="font-medium text-link hover:underline">
                  {t("cookies.learnMore")}
                </Link>
              </p>
            </div>
            <div className="grid shrink-0 grid-cols-2 gap-2 sm:w-64">
              <Button size="sm" onClick={() => decide({ analytics: true, marketing: true })} className="col-span-2">
                {t("cookies.acceptAll")}
              </Button>
              <Button size="sm" variant="secondary" onClick={() => decide({ analytics: false, marketing: false })}>
                {t("cookies.decline")}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => (setBanner(false), setSettings(true))}>
                {t("cookies.customize")}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Modal open={settings} onClose={() => setSettings(false)} title={t("cookies.settingsTitle")}>
        <p className="mt-2 text-sm text-fg-muted">{t("cookies.settingsText")}</p>
        <ul className="mt-5 flex flex-col gap-3">
          {CATEGORIES.map((key) => (
            <li key={key} className="flex items-start justify-between gap-4 rounded-2xl bg-fg/4 p-4">
              <div className="text-sm">
                <p className="font-semibold">{t(`cookies.${key}.title`)}</p>
                <p className="mt-0.5 text-fg-muted">{t(`cookies.${key}.text`)}</p>
              </div>
              <Switch
                label={t(`cookies.${key}.title`)}
                checked={key === "necessary" || Boolean(choice[key])}
                disabled={key === "necessary"}
                onChange={(value) => setChoice({ ...choice, [key]: value })}
              />
            </li>
          ))}
        </ul>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={() => decide({ analytics: false, marketing: false })}>
            {t("cookies.decline")}
          </Button>
          <Button onClick={() => decide(choice)}>{t("cookies.save")}</Button>
        </div>
      </Modal>
    </>
  );
}
