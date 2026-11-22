import Image from "next/image";

import signUpImage from "../../../public/signUpPageIMG.png";

/** Split image + form card shared by the login and sign-up pages. */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="container-page py-10">
      <div className="grid overflow-hidden rounded-3xl border border-line bg-surface-raised shadow-[0_20px_60px_rgba(0,0,0,0.06)] lg:grid-cols-2">
        <div className="relative hidden min-h-144 bg-[#cbe4ea] lg:block">
          <Image src={signUpImage} alt="" fill priority placeholder="blur" sizes="640px" className="object-cover" />
        </div>
        <div className="flex items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mb-8 mt-2 text-sm text-fg-muted">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
