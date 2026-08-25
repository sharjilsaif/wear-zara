// src/app/admin/page.jsx
"use client";

import { useState, useEffect } from "react";

export default function AdminPanel() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    imageUrl: "", 
    categoryIds: [],
    rating: "5.0",
    reviews: "",
    discountPrice: "",
    discountPercentage: "",
  });
  
  const [productStatus, setProductStatus] = useState({ loading: false, message: "" });
  const [categoryStatus, setCategoryStatus] = useState({ loading: false, message: "" });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null); // Keeps track of which category to delete

  const fetchCategories = () => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => console.error("Error loading categories:", err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setFormData((prev) => {
      const currentIds = [...prev.categoryIds];
      if (currentIds.includes(categoryId)) {
        return { ...prev, categoryIds: currentIds.filter((id) => id !== categoryId) };
      } else {
        return { ...prev, categoryIds: [...currentIds, categoryId] };
      }
    });
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    setCategoryStatus({ loading: true, message: "" });

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });
      const data = await res.json();

      if (data.success) {
        setCategoryStatus({ loading: false, message: "Category added successfully!" });
        setNewCategoryName("");
        fetchCategories();
        setTimeout(() => {
          setCategoryStatus((prev) => ({ ...prev, message: "" }));
        }, 5000);
      } else {
        setCategoryStatus({ loading: false, message: `${data.error}` });
      }
    } catch (err) {
      setCategoryStatus({ loading: false, message: "Failed to create category." });
    }
  };

  const confirmDeleteCategory = (id, name) => {
    setCategoryToDelete({ id, name });
    setShowDeleteModal(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    const { id, name } = categoryToDelete;

    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setCategoryStatus({ loading: false, message: `Deleted: ${name}` });
        fetchCategories();
        setFormData((prev) => ({
          ...prev,
          categoryIds: prev.categoryIds.filter((catId) => catId !== id)
        }));
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete category.");
    } finally {
      // Clean up modal state[cite: 3]
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProductStatus({ loading: true, message: "" });

    // Validation: Require at least 1 category select
    if (formData.categoryIds.length === 0) {
      setProductStatus({ loading: false, message: "Please check at least one category." });
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          price: formData.price,
          imageUrl: formData.imageUrl,
          categoryIds: formData.categoryIds,
          rating: formData.rating,
          reviews: formData.reviews,
          discountPrice: formData.discountPrice || null,
          discountPercentage: formData.discountPercentage || null
        }),
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        setProductStatus({ loading: false, message: "Product saved successfully!" });
        // Reset form
        setFormData({
          name: "",
          price: "",
          imageUrl: "",
          categoryIds: [],
          rating: "5.0",
          reviews: "0",
          discountPrice: "",
          discountPercentage: "",
        });
        fetchCategories(); // Refresh product counts on categories
      } else {
        setProductStatus({ 
          loading: false, 
          message: `Error: ${data.details || data.error || "Failed to save product"}` 
        });
      }
    } catch (err) {
      console.error("Submission crash:", err);
      setProductStatus({ loading: false, message: "Network error. Check console." });
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-12 px-4 grid grid-cols-1 md:grid-cols-12 gap-8 text-zinc-800 dark:text-zinc-200">
      
      {/* LEFT PANEL: Category Manager (5 cols) */}
      <div className="md:col-span-5 space-y-6">
        <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 shadow-sm">
          <h2 className="text-xl font-bold mb-1 text-zinc-900 dark:text-white">Category Manager</h2>
          <p className="text-zinc-500 text-xs mb-4">Add or delete active department folders.</p>

          {categoryStatus.message && (
            <div className="p-2.5 mb-4 text-xs font-medium rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-400">
                {categoryStatus.message}
            </div>
          )}

          <form onSubmit={handleCreateCategory} className="flex gap-2 mb-6">
            <input 
              required 
              type="text" 
              spellCheck="false"
              placeholder="e.g. Winter Wear" 
              value={newCategoryName} 
              onChange={(e) => setNewCategoryName(e.target.value)} 
              className="grow px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg dark:bg-zinc-900 focus:outline-none focus:border-red-500 dark:focus:border-red-500 focus:ring-0 focus:ring-red-500 transition-colors" 
            />
            <button type="submit" disabled={categoryStatus.loading} className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold w-15 h-9 rounded-lg transition-colors flex items-center justify-center cursor-pointer">
              {categoryStatus.loading? <span className="w-4 h-4 animate-spin rounded-full border-t-transparent border-2 inline-block" /> : <span>Add</span>}
            </button>
          </form>

          {/* List of Existing Categories */}
          <div className="space-y-2 max-h-75 overflow-y-auto pr-1">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Active Folders ({categories.length})
            </span>
            {categories.map((cat) => {
              const count = cat._count?.products ?? 0;

              return (
                <div key={cat.id} className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{cat.name}</span>
                    <span className="text-[10px] text-zinc-400">Products: {count}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => confirmDeleteCategory(cat.id, cat.name)}
                    className="cursor-pointer text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 px-2 py-1 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Product Creator (7 cols) */}
      <div className="md:col-span-7">
        <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950 shadow-sm">
          <h2 className="text-xl font-bold mb-1 text-zinc-900 dark:text-white">Publish Product</h2>
          <p className="text-zinc-500 text-xs mb-6">Enter details and link products to departments.</p>

          {productStatus.message && (
            <div className="p-2.5 mb-4 text-xs font-medium rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-400">
              {productStatus.message}
            </div>
          )}

          <form onSubmit={handleProductSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                  Product Name
              </label>
              <input required type="text" spellCheck="false" placeholder="e.g. UNISEX SWEATSHIRT" value={formData.name} onChange={(e) => setFormData({ ... formData, name: e.target.value.toUpperCase() })} className="w-full px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg dark:bg-zinc-900 focus:outline-none focus:border-red-500 dark:focus:border-red-500 focus:ring-0 transition-colors uppercase"/>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Price ($)</label>
              <input 
                  required 
                  type="number" 
                  step="0.01" 
                  placeholder="9.99" 
                  value={formData.price} 
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                  className="w-full px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg dark:bg-zinc-900 focus:outline-none focus:border-red-500 dark:focus:border-red-500 focus:ring-0 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
              />
            </div>

            {/* Checkbox selector for linking to multiple Category folders */}
            <div className="border dark:border-zinc-800 rounded-lg p-4 bg-zinc-50 dark:bg-zinc-900/40">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Assign Categories (Select all that apply)
              </label>
              
              {categories.length === 0 ? (
                <p className="text-xs text-zinc-400">No categories found. Create one on the left!</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-38 overflow-y-auto select-none">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2.5 p-1.5 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.categoryIds.includes(cat.id)}
                        onChange={() => handleCategoryChange(cat.id)}
                        className="w-4 h-4 rounded text-red-500 focus:ring-red-500 dark:border-zinc-800"
                      />
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Cloud Image URL</label>
              <input required type="url" placeholder="Paste your cloud image url here" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full px-4 py-2 rounded-lg dark:bg-zinc-900 focus:outline-none border border-zinc-200 dark:border-zinc-800 focus:border-red-500 dark:focus:border-red-500 focus:ring-0 transition-colors" />
            </div>

            {/* Rating Selector */}
            <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 dark:border-zinc-900 pt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Rating (Stars)</label>
                <select 
                  value={formData.rating} 
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })} 
                  className="w-full px-4 py-2.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg dark:bg-zinc-900 bg-white dark:text-zinc-200 focus:outline-none focus:border-red-500 dark:focus:border-red-500 focus:ring-0 transition-colors"
                >
                  <option value="5.0">5 Stars</option>
                  <option value="4.0">4 Stars</option>
                  <option value="3.0">3 Stars</option>
                  <option value="2.0">2 Stars</option>
                  <option value="1.0">1 Star</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Reviews Count</label>
                <input type="number" placeholder="88" value={formData.reviews} onChange={(e) => setFormData({ ...formData, reviews: e.target.value })} className="w-full px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg dark:bg-zinc-900 focus:outline-none focus:border-red-500 dark:focus:border-red-500 focus:ring-0 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Original Price (Strikeout)</label>
                <input type="number" step="0.01" placeholder="160.00" value={formData.discountPrice} onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })} className="w-full px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg dark:bg-zinc-900 focus:outline-none focus:border-red-500 dark:focus:border-red-500 focus:ring-0 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1">Discount %</label>
                <input type="number" placeholder="40" value={formData.discountPercentage} onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })} className="w-full px-4 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-lg dark:bg-zinc-900 focus:outline-none focus:border-red-500 dark:focus:border-red-500 focus:ring-0 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"/>
              </div>
            </div>

            <button type="submit" disabled={productStatus.loading} className="w-full mt-2 bg-[var(--brand-red)] text-white py-3 rounded-lg font-medium hover:bg-[var(--brand-red-active)] transition-all disabled:opacity-50 cursor-pointer">
              {productStatus.loading ? "Publishing..." : "Publish Product"}
            </button>
          </form>
        </div>
      </div>

      {/* NEW: Customized Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-[90%] max-w-md rounded-3xl bg-white dark:bg-[#1a1a1a] p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-[#111] dark:text-white">
              Delete Category
            </h2>

            <p className="mt-3 text-sm text-[#666] dark:text-[#aaa]">
              Are you sure you want to permanently delete the category <br /> &quot;<span className="font-semibold text-zinc-800 dark:text-white">{categoryToDelete?.name}</span>&quot;? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCategoryToDelete(null);
                }}
                className="rounded-full border border-gray-300 px-5 py-2 text-sm transition hover:bg-gray-100 dark:border-[#333] dark:hover:bg-[#252525] cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteCategory}
                className="rounded-full bg-red-600 px-5 py-2 text-sm text-white transition hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}