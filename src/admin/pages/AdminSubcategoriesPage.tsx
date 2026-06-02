import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import type { Category, Subcategory } from "@/types/directory";
import {
  createSubcategory,
  deleteSubcategory,
  fetchCategories,
  fetchSubcategories,
  updateSubcategory,
} from "@/services/api";
import { getApiBaseUrl } from "@/services/http";
import { useAuth } from "@/context/AuthContext";
import { SectionCard } from "@/admin/components/SectionCard";
import { TableToolbar } from "@/admin/components/TableToolbar";
import { PaginationControls } from "@/admin/components/PaginationControls";
import { AdminModal } from "@/admin/components/AdminModal";

type SubcategoryFormValues = {
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  status: "active" | "inactive";
  image: FileList;
};

const API_BASE = getApiBaseUrl();

function absoluteImage(path: string | null) {
  if (!path) {
    return "";
  }
  return `${API_BASE}${path}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function AdminSubcategoriesPage() {
  const { token } = useAuth();
  const [rows, setRows] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Subcategory | null>(null);
  const [currentImagePreview, setCurrentImagePreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SubcategoryFormValues>({
    defaultValues: {
      categoryId: 0,
      name: "",
      slug: "",
      description: "",
      status: "active",
    },
  });

  const watchedFile = watch("image");

  const uploadPreview = useMemo(() => {
    const file = watchedFile?.[0];
    if (!file) {
      return currentImagePreview;
    }
    return URL.createObjectURL(file);
  }, [watchedFile, currentImagePreview]);

  useEffect(() => {
    return () => {
      if (uploadPreview && uploadPreview.startsWith("blob:")) {
        URL.revokeObjectURL(uploadPreview);
      }
    };
  }, [uploadPreview]);

  async function loadCategories() {
    try {
      const response = await fetchCategories({ page: 1, limit: 200, status: "active" });
      setCategories(response.data);
    } catch (_error) {
      toast.error("Unable to load categories");
    }
  }

  async function loadData() {
    try {
      setLoading(true);
      const response = await fetchSubcategories({
        page,
        limit: 10,
        search,
        status: statusFilter,
        categoryId: categoryFilter ? Number(categoryFilter) : undefined,
      });
      setRows(response.data);
      setTotalPages(response.pagination.totalPages || 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load subcategories";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, categoryFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadData();
    }, 350);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function openCreate() {
    setEditing(null);
    setCurrentImagePreview("");
    reset({
      categoryId: categories[0]?.id || 0,
      name: "",
      slug: "",
      description: "",
      status: "active",
    });
    setModalOpen(true);
  }

  function openEdit(subcategory: Subcategory) {
    setEditing(subcategory);
    setCurrentImagePreview(absoluteImage(subcategory.image));
    reset({
      categoryId: subcategory.categoryId,
      name: subcategory.name,
      slug: subcategory.slug,
      description: subcategory.description || "",
      status: subcategory.status,
    });
    setModalOpen(true);
  }

  async function onSubmit(values: SubcategoryFormValues) {
    if (!token) {
      toast.error("You are not authenticated");
      return;
    }

    const formData = new FormData();
    formData.append("categoryId", String(values.categoryId));
    formData.append("name", values.name);
    if (values.slug) {
      formData.append("slug", values.slug);
    }
    if (values.description) {
      formData.append("description", values.description);
    }
    formData.append("status", values.status);

    const imageFile = values.image?.[0];
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (editing) {
        await updateSubcategory(token, editing.id, formData);
        toast.success("Subcategory updated");
      } else {
        await createSubcategory(token, formData);
        toast.success("Subcategory created");
      }

      setModalOpen(false);
      setEditing(null);
      setPage(1);
      await loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save subcategory";
      toast.error(message);
    }
  }

  async function onDelete(id: number) {
    if (!token) {
      return;
    }

    const ok = window.confirm("Delete this subcategory?");
    if (!ok) {
      return;
    }

    try {
      await deleteSubcategory(token, id);
      toast.success("Subcategory deleted");
      await loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete subcategory";
      toast.error(message);
    }
  }

  return (
    <>
      <SectionCard
        title="Subcategory Management"
        subtitle="Manage subcategories under each parent category"
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f28a32] to-[#ffb16a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Subcategory
          </button>
        }
      >
        <TableToolbar
          search={search}
          onSearch={setSearch}
          right={
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(event) => {
                  setCategoryFilter(event.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-[#e3e8f3] bg-white px-3 py-2 text-sm text-[#42527c]"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-[#e3e8f3] bg-white px-3 py-2 text-sm text-[#42527c]"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          }
        />

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#edf0f7] text-[#7584a9]">
                <th className="px-3 py-3 font-semibold">Icon</th>
                <th className="px-3 py-3 font-semibold">Subcategory</th>
                <th className="px-3 py-3 font-semibold">Category</th>
                <th className="px-3 py-3 font-semibold">Slug</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Created</th>
                <th className="px-3 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-[#7a89ad]">
                    Loading subcategories...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-[#7a89ad]">
                    No subcategories found.
                  </td>
                </tr>
              ) : (
                rows.map((subcategory) => (
                  <tr key={subcategory.id} className="border-b border-[#f0f3fa] last:border-0">
                    <td className="px-3 py-3">
                      {subcategory.image ? (
                        <img
                          src={absoluteImage(subcategory.image)}
                          alt={subcategory.name}
                          className="h-12 w-12 rounded-xl object-cover"
                        />
                      ) : (
                        <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#f2f5fc] text-[#94a0bd]">
                          <ImageIcon className="h-4 w-4" />
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 font-semibold text-[#22315a]">{subcategory.name}</td>
                    <td className="px-3 py-3 text-[#62729a]">{subcategory.category?.name || "-"}</td>
                    <td className="px-3 py-3 text-[#62729a]">/{subcategory.slug}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          subcategory.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {subcategory.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[#6f7da0]">{formatDate(subcategory.createdAt)}</td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(subcategory)}
                          className="rounded-lg border border-[#dde4f2] p-2 text-[#4f5f87] hover:bg-[#f4f7fd]"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(subcategory.id)}
                          className="rounded-lg border border-[#f0d5d5] p-2 text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
      </SectionCard>

      <AdminModal
        open={modalOpen}
        title={editing ? "Edit Subcategory" : "Create Subcategory"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Category *</label>
            <select
              {...register("categoryId", {
                required: "Category is required",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "Please select a category",
                },
              })}
              className="w-full rounded-xl border border-[#e3e8f3] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
            >
              <option value={0}>Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId ? (
              <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Subcategory Name *</label>
            <input
              {...register("name", { required: "Subcategory name is required" })}
              className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
            />
            {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Slug</label>
            <input
              {...register("slug")}
              placeholder="auto-generated-if-empty"
              className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Status</label>
            <select
              {...register("status")}
              className="w-full rounded-xl border border-[#e3e8f3] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Description</label>
            <textarea
              rows={3}
              {...register("description")}
              className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Subcategory Icon</label>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="w-full rounded-xl border border-[#e3e8f3] bg-white px-3 py-2 text-sm"
            />
            {uploadPreview ? (
              <img
                src={uploadPreview}
                alt="Preview"
                className="mt-3 h-32 w-48 rounded-xl border border-[#e3e8f3] object-cover"
              />
            ) : null}
          </div>

          <div className="md:col-span-2 flex justify-end gap-2 border-t border-[#edf0f7] pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-xl border border-[#e3e8f3] px-4 py-2 text-sm font-semibold text-[#4e5d84]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-gradient-to-r from-[#f28a32] to-[#ffb16a] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : editing ? "Update Subcategory" : "Create Subcategory"}
            </button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}
