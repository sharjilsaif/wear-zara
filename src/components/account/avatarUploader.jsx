"use client";

import { useRef } from "react";
import { useSession } from "next-auth/react";
import { LuCamera } from "react-icons/lu";

import Avatar from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/i18n/client";
import useRequest from "@/lib/useRequest";

const SIZE = 320;

/** Center-crops and resizes the picked image in the browser, so uploads stay tiny (~20–40 KB). */
async function toSquareImage(file) {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = Object.assign(document.createElement("canvas"), { width: SIZE, height: SIZE });
  const context = canvas.getContext("2d");
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, SIZE, SIZE);
  bitmap.close();

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", 0.86));
  return blob?.type === "image/webp" ? blob : new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.88));
}

export default function AvatarUploader({ name, image }) {
  const { t } = useI18n();
  const toast = useToast();
  const { update } = useSession();
  const { send, pending } = useRequest();
  const inputRef = useRef(null);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast({ type: "error", title: t("errors.imageType") });

    try {
      const blob = await toSquareImage(file);
      const result = await send("/api/account/avatar", { method: "PUT", blob, success: t("account.photoUpdated") });
      if (result.ok) await update({});
    } catch {
      toast({ type: "error", title: t("errors.imageType") });
    }
  };

  const remove = async () => {
    const result = await send("/api/account/avatar", { method: "DELETE", success: t("account.photoRemoved") });
    if (result.ok) await update({});
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={pending}
        aria-label={t("account.changePhoto")}
        className="group relative rounded-full transition-transform active:scale-95"
      >
        <Avatar src={image} name={name} size="xl" className="shadow-[0_8px_30px_rgb(0_0_0/0.12)]" />
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 text-2xl text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          {pending ? <Spinner className="h-6 w-6" /> : <LuCamera />}
        </span>
        <span className="glass-strong absolute bottom-0.5 end-0.5 flex h-9 w-9 items-center justify-center rounded-full text-base">
          <LuCamera aria-hidden />
        </span>
      </button>

      <div className="flex flex-col items-center gap-2 sm:items-start">
        <p className="text-sm text-fg-muted">{t("account.photoHint")}</p>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => inputRef.current?.click()} loading={pending}>
            {t(image ? "account.changePhoto" : "account.uploadPhoto")}
          </Button>
          {image && (
            <Button size="sm" variant="secondary" onClick={remove} disabled={pending}>
              {t("common.remove")}
            </Button>
          )}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/heic,image/heif" className="hidden" onChange={handleFile} />
    </div>
  );
}
