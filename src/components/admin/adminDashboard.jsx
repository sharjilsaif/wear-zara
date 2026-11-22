import Link from "next/link";
import { FiAlertCircle, FiBox, FiFolder, FiPercent } from "react-icons/fi";

import CategoryManager from "@/components/admin/categoryManager";
import ProductForm from "@/components/admin/productForm";
import ProductTable from "@/components/admin/productTable";
import Breadcrumb from "@/components/ui/breadcrumb";
import { getOriginalPrice } from "@/lib/format";

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface-raised p-5">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-xl text-brand">
        <Icon aria-hidden />
      </span>
      <div>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-xs text-fg-muted">{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard({ isAdmin, isLoggedIn, categories, products, totalProducts }) {
  const readOnly = !isAdmin;
  const onSale = products.filter((product) => getOriginalPrice(product)).length;

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Admin" }]} />
      <h1 className="mb-2 text-2xl font-semibold tracking-tight sm:text-4xl">Admin Dashboard</h1>
      <p className="mb-8 text-sm text-fg-muted">Manage the Wear Zara catalogue.</p>

      {readOnly && (
        <div role="status" className="mb-8 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          <FiAlertCircle aria-hidden className="mt-0.5 shrink-0 text-lg" />
          <p>
            <strong>Read-only demo.</strong> You can explore the dashboard, but only store administrators can publish
            or delete items.{" "}
            {!isLoggedIn && (
              <Link href="/login?callbackUrl=/admin" className="font-semibold underline">
                Log in as an admin
              </Link>
            )}
          </p>
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Stat icon={FiBox} label="Products" value={totalProducts} />
        <Stat icon={FiFolder} label="Categories" value={categories.length} />
        <Stat icon={FiPercent} label="On sale" value={onSale} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
        <CategoryManager categories={categories} readOnly={readOnly} />
        <ProductForm categories={categories} readOnly={readOnly} />
      </div>

      <ProductTable products={products} readOnly={readOnly} className="mt-8" />
    </div>
  );
}
