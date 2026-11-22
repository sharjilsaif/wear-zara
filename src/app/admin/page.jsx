import AdminDashboard from "@/components/admin/adminDashboard";
import { auth } from "@/auth";
import { getCategories, getProducts } from "@/lib/catalog";

export const metadata = {
  title: "Admin Dashboard",
  robots: { index: false },
};

export default async function AdminPage() {
  const [session, categories, { products, total }] = await Promise.all([
    auth(),
    getCategories(),
    getProducts({ pageSize: 200 }),
  ]);

  return (
    <AdminDashboard
      isAdmin={Boolean(session?.user?.isAdmin)}
      isLoggedIn={Boolean(session?.user)}
      categories={categories}
      products={products}
      totalProducts={total}
    />
  );
}
