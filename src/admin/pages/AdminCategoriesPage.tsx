import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import type { Category } from "@/types/directory";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  syncYashaswiniCategories,
  updateCategory,
} from "@/services/api";
import { getApiBaseUrl } from "@/services/http";
import { useAuth } from "@/context/AuthContext";
import { SectionCard } from "@/admin/components/SectionCard";
import { TableToolbar } from "@/admin/components/TableToolbar";
import { PaginationControls } from "@/admin/components/PaginationControls";
import { AdminModal } from "@/admin/components/AdminModal";
import { allYashaswiniMartCategoryNames, isYashaswiniMartCategoryName } from "@/data/businesses";

type CategoryFormValues = {
  name: string;
  slug: string;
  description: string;
  featured: boolean;
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

export function AdminCategoriesPage() {
  const [searchParams] = useSearchParams();
  const routeSegment = searchParams.get("segment") || "";
  const isYashaswiniSegment = routeSegment.toLowerCase() === "yashaswini";
  const attemptedAutoSyncRef = useRef(false);
  const { token } = useAuth();
  const [rows, setRows] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [currentImagePreview, setCurrentImagePreview] = useState<string>("");
  const [syncingDefaults, setSyncingDefaults] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      featured: false,
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

  async function loadData() {
    try {
      setLoading(true);

      if (isYashaswiniSegment) {
        let response = await fetchCategories({
          page: 1,
          limit: 300,
          search,
          status: statusFilter,
          featured: featuredFilter,
        });

        let filteredRows = response.data
          .filter((category) => isYashaswiniMartCategoryName(category.name))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        if (
          token &&
          !search &&
          !statusFilter &&
          !featuredFilter &&
          filteredRows.length < allYashaswiniMartCategoryNames.length &&
          !attemptedAutoSyncRef.current
        ) {
          attemptedAutoSyncRef.current = true;
          await syncCategoryDefaults(false);
          response = await fetchCategories({
            page: 1,
            limit: 300,
            search,
            status: statusFilter,
            featured: featuredFilter,
          });

          filteredRows = response.data
            .filter((category) => isYashaswiniMartCategoryName(category.name))
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        const pageSize = 10;
        const totalPageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
        const boundedPage = Math.min(page, totalPageCount);
        const offset = (boundedPage - 1) * pageSize;

        if (boundedPage !== page) {
          setPage(boundedPage);
        }

        setRows(filteredRows.slice(offset, offset + pageSize));
        setTotalPages(totalPageCount);
        return;
      }

      const response = await fetchCategories({
        page,
        limit: 10,
        search,
        status: statusFilter,
        featured: featuredFilter,
      });

      setRows(response.data);
      setTotalPages(response.pagination.totalPages || 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load categories";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    attemptedAutoSyncRef.current = false;
  }, [isYashaswiniSegment]);

  async function syncCategoryDefaults(showToast = true) {
    if (!token) {
      return false;
    }

    try {
      setSyncingDefaults(true);
      const response = await syncYashaswiniCategories(token);
      const createdCount = response.data.created.length;

      if (showToast) {
        if (createdCount > 0) {
          toast.success(`Synced ${createdCount} Yashaswini categories`);
        } else {
          toast.success("Yashaswini categories are already synced");
        }
      }

      return true;
    } catch (error) {
      if (showToast) {
        const message = error instanceof Error ? error.message : "Failed to sync Yashaswini categories";
        toast.error(message);
      }
      return false;
    } finally {
      setSyncingDefaults(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, featuredFilter, isYashaswiniSegment]);

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
      name: "",
      slug: "",
      description: "",
      featured: false,
      status: "active",
    });
    setModalOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setCurrentImagePreview(absoluteImage(category.image));
    reset({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      featured: category.featured,
      status: category.status,
    });
    setModalOpen(true);
  }

  async function onSubmit(values: CategoryFormValues) {
    if (!token) {
      toast.error("You are not authenticated");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    if (values.slug) {
      formData.append("slug", values.slug);
    }
    if (values.description) {
      formData.append("description", values.description);
    }
    formData.append("featured", String(Boolean(values.featured)));
    formData.append("status", values.status);

    const imageFile = values.image?.[0];
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (editing) {
        await updateCategory(token, editing.id, formData);
        toast.success("Category updated");
      } else {
        await createCategory(token, formData);
        toast.success("Category created");
      }

      setModalOpen(false);
      setEditing(null);
      setPage(1);
      await loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save category";
      toast.error(message);
    }
  }

  async function onDelete(id: number) {
    if (!token) {
      return;
    }

    const ok = window.confirm("Delete this category?");
    if (!ok) {
      return;
    }

    try {
      await deleteCategory(token, id);
      toast.success("Category deleted");
      await loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete category";
      toast.error(message);
    }
  }

  return (
    <>
      <SectionCard
        title={isYashaswiniSegment ? "Yashaswini Category Management" : "Category Management"}
        subtitle={
          isYashaswiniSegment
            ? "Manage the categories used inside Yashaswini Mart"
            : "Add, edit, filter, and activate/deactivate categories"
        }
        action={
          <div className="flex flex-wrap gap-2">
            {isYashaswiniSegment ? (
              <button
                type="button"
                onClick={async () => {
                  const synced = await syncCategoryDefaults(true);
                  if (synced) {
                    await loadData();
                  }
                }}
                disabled={syncingDefaults}
                className="inline-flex items-center gap-2 rounded-xl border border-[#dfe6f4] bg-white px-4 py-2.5 text-sm font-semibold text-[#41527d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {syncingDefaults ? "Syncing..." : "Sync Yashaswini Categories"}
              </button>
            ) : null}
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f28a32] to-[#ffb16a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
            >
              <Plus className="h-4 w-4" /> {isYashaswiniSegment ? "Add Yashaswini Category" : "Add Category"}
            </button>
          </div>
        }
      >
        <TableToolbar
          search={search}
          onSearch={setSearch}
          right={
            <div className="flex gap-2">
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
              <select
                value={featuredFilter}
                onChange={(event) => {
                  setFeaturedFilter(event.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-[#e3e8f3] bg-white px-3 py-2 text-sm text-[#42527c]"
              >
                <option value="">All</option>
                <option value="true">Featured</option>
                <option value="false">Non-featured</option>
              </select>
            </div>
          }
        />

        {isYashaswiniSegment ? (
          <div className="mb-5 rounded-2xl border border-[#edf1f8] bg-[#fafbfe] p-4">
            <p className="text-sm font-semibold text-[#23325d]">Yashaswini Mart categories</p>
            <p className="mt-1 text-xs text-[#7f8cae]">
              Use these category names for the Yashaswini Mart section.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {allYashaswiniMartCategoryNames.map((name) => (
                <span
                  key={name}
                  className="rounded-full border border-[#e2e8f5] bg-white px-3 py-1 text-xs font-semibold text-[#41527d]"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#edf0f7] text-[#7584a9]">
                <th className="px-3 py-3 font-semibold">Icon</th>
                <th className="px-3 py-3 font-semibold">Name</th>
                <th className="px-3 py-3 font-semibold">Slug</th>
                <th className="px-3 py-3 font-semibold">Featured</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Created</th>
                <th className="px-3 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-[#7a89ad]">
                    Loading categories...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-[#7a89ad]">
                    No categories found.
                  </td>
                </tr>
              ) : (
                rows.map((category) => (
                  <tr key={category.id} className="border-b border-[#f0f3fa] last:border-0">
                    <td className="px-3 py-3">
                      {category.image ? (
                        <img
                          src={absoluteImage(category.image)}
                          alt={category.name}
                          className="h-12 w-12 rounded-xl object-cover"
                        />
                      ) : (
                        <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#f2f5fc] text-[#94a0bd]">
                          <ImageIcon className="h-4 w-4" />
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 font-semibold text-[#22315a]">{category.name}</td>
                    <td className="px-3 py-3 text-[#62729a]">/{category.slug}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          category.featured
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {category.featured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          category.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {category.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[#6f7da0]">{formatDate(category.createdAt)}</td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(category)}
                          className="rounded-lg border border-[#dde4f2] p-2 text-[#4f5f87] hover:bg-[#f4f7fd]"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(category.id)}
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
        title={editing ? "Edit Category" : "Create Category"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Category Name *</label>
            <input
              {...register("name", { required: "Category name is required" })}
              placeholder={isYashaswiniSegment ? "e.g. Supermarket" : "e.g. Restaurants"}
              className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
            />
            {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
            {isYashaswiniSegment ? (
              <p className="mt-1 text-xs text-[#8a96b5]">
                Suggested names: {allYashaswiniMartCategoryNames.join(", ")}
              </p>
            ) : null}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Slug</label>
            <input
              {...register("slug")}
              placeholder="auto-generated-if-empty"
              className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Description</label>
            <textarea
              rows={3}
              {...register("description")}
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

          <div className="flex items-center gap-2 pt-7">
            <input id="category-featured" type="checkbox" {...register("featured")} />
            <label htmlFor="category-featured" className="text-sm font-semibold text-[#3f4c74]">
              Featured category
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Category Icon</label>
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
              {isSubmitting ? "Saving..." : editing ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}
