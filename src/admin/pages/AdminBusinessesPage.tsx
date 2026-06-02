import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, ImageIcon, Phone, BadgeCheck, Star } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import type { Business, Category, Subcategory } from "@/types/directory";
import {
  createBusiness,
  deleteBusiness,
  fetchBusinesses,
  fetchCategories,
  fetchSubcategoriesByCategory,
  seedYashaswiniDefaults,
  updateBusiness,
} from "@/services/api";
import { getApiBaseUrl } from "@/services/http";
import { useAuth } from "@/context/AuthContext";
import { SectionCard } from "@/admin/components/SectionCard";
import { TableToolbar } from "@/admin/components/TableToolbar";
import { PaginationControls } from "@/admin/components/PaginationControls";
import { AdminModal } from "@/admin/components/AdminModal";
import { isYashaswiniMartCategoryName } from "@/data/businesses";

type BusinessFormValues = {
  businessName: string;
  slug: string;
  categoryId: number;
  subcategoryId: number;
  mobile: string;
  whatsapp: string;
  email: string;
  website: string;
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  mapLink: string;
  latitude: string;
  longitude: string;
  description: string;
  services: string;
  openingTime: string;
  closingTime: string;
  featured: boolean;
  verified: boolean;
  status: "active" | "inactive";
  seoTitle: string;
  seoDescription: string;
  logo: FileList;
  banner: FileList;
  gallery: FileList;
};

const API_BASE = getApiBaseUrl();
const YASHASWINI_FILTER_VALUE = "__yashaswini__";

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

export function AdminBusinessesPage() {
  const [searchParams] = useSearchParams();
  const routeSegment = searchParams.get("segment") || "";
  const isYashaswiniSegment = routeSegment.toLowerCase() === "yashaswini";
  const previousRouteSegment = useRef(routeSegment);
  const attemptedAutoImportRef = useRef(false);
  const { token } = useAuth();
  const [rows, setRows] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState<Subcategory[]>([]);
  const [filterSubcategories, setFilterSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Business | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [removedGalleryIds, setRemovedGalleryIds] = useState<number[]>([]);
  const [importingDefaults, setImportingDefaults] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BusinessFormValues>({
    defaultValues: {
      businessName: "",
      slug: "",
      categoryId: 0,
      subcategoryId: 0,
      mobile: "",
      whatsapp: "",
      email: "",
      website: "",
      address: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      mapLink: "",
      latitude: "",
      longitude: "",
      description: "",
      services: "",
      openingTime: "",
      closingTime: "",
      featured: false,
      verified: false,
      status: "active",
      seoTitle: "",
      seoDescription: "",
    },
  });

  const watchedLogo = watch("logo");
  const watchedBanner = watch("banner");
  const watchedCategoryId = watch("categoryId");

  const yashaswiniCategoryIds = useMemo(
    () =>
      categories
        .filter((category) => isYashaswiniMartCategoryName(category.name))
        .map((category) => category.id),
    [categories],
  );

  const isYashaswiniMode =
    isYashaswiniSegment || categoryFilter === YASHASWINI_FILTER_VALUE;

  const formCategories = useMemo(() => {
    if (!isYashaswiniMode) {
      return categories;
    }
    return categories.filter((category) => isYashaswiniMartCategoryName(category.name));
  }, [categories, isYashaswiniMode]);

  const logoFilePreview = useMemo(() => {
    const file = watchedLogo?.[0];
    if (!file) {
      return logoPreview;
    }
    return URL.createObjectURL(file);
  }, [watchedLogo, logoPreview]);

  const bannerFilePreview = useMemo(() => {
    const file = watchedBanner?.[0];
    if (!file) {
      return bannerPreview;
    }
    return URL.createObjectURL(file);
  }, [watchedBanner, bannerPreview]);

  useEffect(() => {
    return () => {
      if (logoFilePreview && logoFilePreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoFilePreview);
      }
      if (bannerFilePreview && bannerFilePreview.startsWith("blob:")) {
        URL.revokeObjectURL(bannerFilePreview);
      }
    };
  }, [logoFilePreview, bannerFilePreview]);

  async function loadCategories() {
    try {
      const response = await fetchCategories({ page: 1, limit: 200, status: "active" });
      setCategories(response.data);
    } catch (_error) {
      toast.error("Unable to load categories");
    }
  }

  async function loadSubcategories(categoryId: number, target: "form" | "filter" = "form") {
    if (!categoryId) {
      if (target === "form") {
        setSubcategoryOptions([]);
      } else {
        setFilterSubcategories([]);
      }
      return;
    }

    try {
      const response = await fetchSubcategoriesByCategory(categoryId);
      if (target === "form") {
        setSubcategoryOptions(response.data);
      } else {
        setFilterSubcategories(response.data);
      }
    } catch (_error) {
      toast.error("Unable to load subcategories");
    }
  }

  async function fetchYashaswiniRows(selectedSubcategoryId?: number) {
    let categoryIds = yashaswiniCategoryIds;

    if (categoryIds.length === 0) {
      const response = await fetchCategories({ page: 1, limit: 300 });
      const fetchedCategories = response.data;
      const matched = fetchedCategories
        .filter((category) => isYashaswiniMartCategoryName(category.name))
        .map((category) => category.id);

      if (matched.length > 0) {
        setCategories(fetchedCategories);
        categoryIds = matched;
      }
    }

    if (categoryIds.length === 0) {
      return [];
    }

    const responses = await Promise.all(
      categoryIds.map((categoryId) =>
        fetchBusinesses({
          page: 1,
          limit: 300,
          search,
          status: statusFilter,
          categoryId,
          subcategoryId: selectedSubcategoryId,
        }),
      ),
    );

    const mergedMap = new Map<number, Business>();
    for (const response of responses) {
      for (const business of response.data) {
        mergedMap.set(business.id, business);
      }
    }

    return Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async function importDefaultYashaswiniBusinesses(showToast = true) {
    if (!token) {
      return false;
    }

    try {
      setImportingDefaults(true);
      const response = await seedYashaswiniDefaults(token);
      const createdCount = response.data.created.length;

      if (showToast) {
        if (createdCount > 0) {
          toast.success(`Imported ${createdCount} default Yashaswini businesses`);
        } else {
          toast.success("Default Yashaswini businesses are already present");
        }
      }

      return true;
    } catch (error) {
      if (showToast) {
        const message = error instanceof Error ? error.message : "Failed to import defaults";
        toast.error(message);
      }
      return false;
    } finally {
      setImportingDefaults(false);
    }
  }

  async function loadData() {
    try {
      setLoading(true);

      if (isYashaswiniMode) {
        const pageSize = 10;
        const selectedSubcategoryId = subcategoryFilter ? Number(subcategoryFilter) : undefined;
        let mergedRows = await fetchYashaswiniRows(selectedSubcategoryId);

        if (
          mergedRows.length === 0 &&
          token &&
          !attemptedAutoImportRef.current &&
          !subcategoryFilter
        ) {
          attemptedAutoImportRef.current = true;
          const imported = await importDefaultYashaswiniBusinesses(false);
          if (imported) {
            mergedRows = await fetchYashaswiniRows(selectedSubcategoryId);
          }
        }

        const total = mergedRows.length;
        const totalPageCount = Math.max(1, Math.ceil(total / pageSize));
        const boundedPage = Math.min(page, totalPageCount);
        const offset = (boundedPage - 1) * pageSize;

        if (boundedPage !== page) {
          setPage(boundedPage);
        }

        setRows(mergedRows.slice(offset, offset + pageSize));
        setTotalPages(totalPageCount);
        return;
      }

      const response = await fetchBusinesses({
        page,
        limit: 10,
        search,
        status: statusFilter,
        categoryId:
          categoryFilter && categoryFilter !== YASHASWINI_FILTER_VALUE
            ? Number(categoryFilter)
            : undefined,
        subcategoryId: subcategoryFilter ? Number(subcategoryFilter) : undefined,
      });
      setRows(response.data);
      setTotalPages(response.pagination.totalPages || 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load businesses";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    attemptedAutoImportRef.current = false;

    if (isYashaswiniSegment) {
      setCategoryFilter(YASHASWINI_FILTER_VALUE);
      setSubcategoryFilter("");
      setPage(1);
    } else if (
      previousRouteSegment.current.toLowerCase() === "yashaswini" &&
      categoryFilter === YASHASWINI_FILTER_VALUE
    ) {
      setCategoryFilter("");
      setSubcategoryFilter("");
      setPage(1);
    }

    previousRouteSegment.current = routeSegment;
  }, [categoryFilter, isYashaswiniSegment, routeSegment]);

  useEffect(() => {
    if (!categoryFilter || categoryFilter === YASHASWINI_FILTER_VALUE) {
      setFilterSubcategories([]);
    } else {
      loadSubcategories(Number(categoryFilter), "filter");
    }
  }, [categoryFilter]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, categoryFilter, subcategoryFilter, isYashaswiniMode, yashaswiniCategoryIds]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadData();
    }, 350);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    if (watchedCategoryId) {
      loadSubcategories(Number(watchedCategoryId));
    } else {
      setSubcategoryOptions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedCategoryId]);

  function openCreate() {
    setEditing(null);
    setLogoPreview("");
    setBannerPreview("");
    setRemovedGalleryIds([]);
    setSubcategoryOptions([]);

    const firstCategoryId = formCategories[0]?.id || 0;
    reset({
      businessName: "",
      slug: "",
      categoryId: firstCategoryId,
      subcategoryId: 0,
      mobile: "",
      whatsapp: "",
      email: "",
      website: "",
      address: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      mapLink: "",
      latitude: "",
      longitude: "",
      description: "",
      services: "",
      openingTime: "",
      closingTime: "",
      featured: false,
      verified: false,
      status: "active",
      seoTitle: "",
      seoDescription: "",
    });

    if (firstCategoryId) {
      loadSubcategories(firstCategoryId);
    }

    setModalOpen(true);
  }

  async function openEdit(business: Business) {
    setEditing(business);
    setLogoPreview(absoluteImage(business.logo));
    setBannerPreview(absoluteImage(business.banner));
    setRemovedGalleryIds([]);

    await loadSubcategories(business.categoryId);

    reset({
      businessName: business.businessName,
      slug: business.slug,
      categoryId: business.categoryId,
      subcategoryId: business.subcategoryId,
      mobile: business.mobile,
      whatsapp: business.whatsapp || "",
      email: business.email || "",
      website: business.website || "",
      address: business.address || "",
      area: business.area || "",
      city: business.city || "",
      state: business.state || "",
      pincode: business.pincode || "",
      mapLink: business.mapLink || "",
      latitude: business.latitude || "",
      longitude: business.longitude || "",
      description: business.description || "",
      services: (business.services || []).join(", "),
      openingTime: business.openingTime || "",
      closingTime: business.closingTime || "",
      featured: business.featured,
      verified: business.verified,
      status: business.status,
      seoTitle: business.seoTitle || "",
      seoDescription: business.seoDescription || "",
    });

    setModalOpen(true);
  }

  async function onSubmit(values: BusinessFormValues) {
    if (!token) {
      toast.error("You are not authenticated");
      return;
    }

    const formData = new FormData();
    formData.append("businessName", values.businessName);
    if (values.slug) {
      formData.append("slug", values.slug);
    }
    formData.append("categoryId", String(values.categoryId));
    formData.append("subcategoryId", String(values.subcategoryId));
    formData.append("mobile", values.mobile);

    const optionalTextFields: Array<[string, string]> = [
      ["whatsapp", values.whatsapp],
      ["email", values.email],
      ["website", values.website],
      ["address", values.address],
      ["area", values.area],
      ["city", values.city],
      ["state", values.state],
      ["pincode", values.pincode],
      ["mapLink", values.mapLink],
      ["latitude", values.latitude],
      ["longitude", values.longitude],
      ["description", values.description],
      ["services", values.services],
      ["openingTime", values.openingTime],
      ["closingTime", values.closingTime],
      ["seoTitle", values.seoTitle],
      ["seoDescription", values.seoDescription],
    ];

    for (const [key, value] of optionalTextFields) {
      if (value !== undefined) {
        formData.append(key, value);
      }
    }

    formData.append("featured", String(Boolean(values.featured)));
    formData.append("verified", String(Boolean(values.verified)));
    formData.append("status", values.status);

    const logoFile = values.logo?.[0];
    if (logoFile) {
      formData.append("logo", logoFile);
    }

    const bannerFile = values.banner?.[0];
    if (bannerFile) {
      formData.append("banner", bannerFile);
    }

    const galleryFiles = Array.from(values.gallery || []);
    galleryFiles.forEach((file) => {
      formData.append("gallery", file);
    });

    if (editing && removedGalleryIds.length > 0) {
      formData.append("removeGalleryIds", removedGalleryIds.join(","));
    }

    try {
      if (editing) {
        await updateBusiness(token, editing.id, formData);
        toast.success("Business updated");
      } else {
        await createBusiness(token, formData);
        toast.success("Business created");
      }

      setModalOpen(false);
      setEditing(null);
      setPage(1);
      await loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save business";
      toast.error(message);
    }
  }

  async function onDelete(id: number) {
    if (!token) {
      return;
    }

    const ok = window.confirm("Delete this business?");
    if (!ok) {
      return;
    }

    try {
      await deleteBusiness(token, id);
      toast.success("Business deleted");
      await loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete business";
      toast.error(message);
    }
  }

  function toggleRemoveGallery(id: number) {
    setRemovedGalleryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  const visibleGallery = (editing?.gallery || []).filter((image) => !removedGalleryIds.includes(image.id));

  return (
    <>
      <SectionCard
        title={isYashaswiniMode ? "Yashaswini Mart Management" : "Business Management"}
        subtitle={
          isYashaswiniMode
            ? "Add, update, and delete Yashaswini Mart listings"
            : "Manage directory listings, contact details, images, and listing status"
        }
        action={
          <div className="flex flex-wrap items-center justify-end gap-2">
            {isYashaswiniMode ? (
              <button
                type="button"
                onClick={async () => {
                  const imported = await importDefaultYashaswiniBusinesses(true);
                  if (imported) {
                    await loadData();
                  }
                }}
                disabled={importingDefaults}
                className="inline-flex items-center gap-2 rounded-xl border border-[#dfe6f4] bg-white px-4 py-2.5 text-sm font-semibold text-[#41527d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {importingDefaults ? "Importing..." : "Import Default 4"}
              </button>
            ) : null}
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f28a32] to-[#ffb16a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add Business
            </button>
          </div>
        }
      >
        <TableToolbar
          search={search}
          onSearch={setSearch}
          right={
            <div className="flex flex-wrap gap-2">
              <select
                value={categoryFilter}
                onChange={(event) => {
                  setCategoryFilter(event.target.value);
                  setSubcategoryFilter("");
                  setPage(1);
                }}
                disabled={isYashaswiniSegment}
                className="rounded-xl border border-[#e3e8f3] bg-white px-3 py-2 text-sm text-[#42527c]"
              >
                <option value="">All Categories</option>
                <option value={YASHASWINI_FILTER_VALUE}>Yashaswini Mart</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={subcategoryFilter}
                onChange={(event) => {
                  setSubcategoryFilter(event.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-[#e3e8f3] bg-white px-3 py-2 text-sm text-[#42527c]"
              >
                <option value="">All Subcategories</option>
                {filterSubcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
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
                <th className="px-3 py-3 font-semibold">Business</th>
                <th className="px-3 py-3 font-semibold">Category</th>
                <th className="px-3 py-3 font-semibold">Contact</th>
                <th className="px-3 py-3 font-semibold">Location</th>
                <th className="px-3 py-3 font-semibold">Flags</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Created</th>
                <th className="px-3 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-[#7a89ad]">
                    Loading businesses...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-[#7a89ad]">
                    No businesses found.
                  </td>
                </tr>
              ) : (
                rows.map((business) => (
                  <tr key={business.id} className="border-b border-[#f0f3fa] last:border-0">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        {business.logo ? (
                          <img
                            src={absoluteImage(business.logo)}
                            alt={business.businessName}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                        ) : (
                          <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#f2f5fc] text-[#94a0bd]">
                            <ImageIcon className="h-4 w-4" />
                          </span>
                        )}
                        <div>
                          <p className="font-semibold text-[#22315a]">{business.businessName}</p>
                          <p className="text-xs text-[#7d8bb0]">/{business.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[#62729a]">
                      <p>{business.category?.name || "-"}</p>
                      <p className="text-xs text-[#93a0bd]">{business.subcategory?.name || "-"}</p>
                    </td>
                    <td className="px-3 py-3 text-[#62729a]">
                      <p className="inline-flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" /> {business.mobile}
                      </p>
                      <p className="text-xs text-[#93a0bd]">{business.email || "-"}</p>
                    </td>
                    <td className="px-3 py-3 text-[#62729a]">
                      {[business.area, business.city].filter(Boolean).join(", ") || business.city}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            business.featured
                              ? "bg-amber-100 text-amber-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          <Star className="mr-1 inline h-3.5 w-3.5" />
                          {business.featured ? "Featured" : "Normal"}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            business.verified
                              ? "bg-sky-100 text-sky-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          <BadgeCheck className="mr-1 inline h-3.5 w-3.5" />
                          {business.verified ? "Verified" : "Unverified"}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          business.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {business.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[#6f7da0]">{formatDate(business.createdAt)}</td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(business)}
                          className="rounded-lg border border-[#dde4f2] p-2 text-[#4f5f87] hover:bg-[#f4f7fd]"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(business.id)}
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
        title={editing ? "Edit Business" : "Create Business"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.13em] text-[#8390b2]">Basic Info</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Business Name *</label>
                <input
                  {...register("businessName", { required: "Business name is required" })}
                  className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
                />
                {errors.businessName ? (
                  <p className="mt-1 text-xs text-red-600">{errors.businessName.message}</p>
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

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Category *</label>
                <select
                  {...register("categoryId", {
                    required: "Category is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Please select a category" },
                  })}
                  onChange={(event) => {
                    const nextValue = Number(event.target.value);
                    setValue("categoryId", nextValue);
                    setValue("subcategoryId", 0);
                    loadSubcategories(nextValue);
                  }}
                  className="w-full rounded-xl border border-[#e3e8f3] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
                >
                  <option value={0}>Select category</option>
                  {formCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId ? (
                  <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p>
                ) : null}
                {isYashaswiniMode && formCategories.length === 0 ? (
                  <p className="mt-1 text-xs text-[#8a96b5]">
                    Add one of these categories first: Supermarket, Home Essentials, Snacks & Beverages, Personal Care.
                  </p>
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Subcategory *</label>
                <select
                  {...register("subcategoryId", {
                    required: "Subcategory is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Please select a subcategory" },
                  })}
                  className="w-full rounded-xl border border-[#e3e8f3] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
                >
                  <option value={0}>Select subcategory</option>
                  {subcategoryOptions.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
                {errors.subcategoryId ? (
                  <p className="mt-1 text-xs text-red-600">{errors.subcategoryId.message}</p>
                ) : null}
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.13em] text-[#8390b2]">Contact</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Mobile *</label>
                <input
                  {...register("mobile", { required: "Mobile number is required" })}
                  className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
                />
                {errors.mobile ? <p className="mt-1 text-xs text-red-600">{errors.mobile.message}</p> : null}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">WhatsApp</label>
                <input
                  {...register("whatsapp")}
                  className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Website URL</label>
                <input
                  {...register("website")}
                  placeholder="https://"
                  className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.13em] text-[#8390b2]">Location</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Address *</label>
                <textarea
                  rows={2}
                  {...register("address", { required: "Address is required" })}
                  className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
                />
                {errors.address ? (
                  <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
                ) : null}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Area</label>
                <input
                  {...register("area")}
                  className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">City *</label>
                <input
                  {...register("city", { required: "City is required" })}
                  className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
                />
                {errors.city ? <p className="mt-1 text-xs text-red-600">{errors.city.message}</p> : null}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">State *</label>
                <input
                  {...register("state", { required: "State is required" })}
                  className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
                />
                {errors.state ? <p className="mt-1 text-xs text-red-600">{errors.state.message}</p> : null}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Pincode</label>
                <input
                  {...register("pincode")}
                  className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Google Map Link</label>
                <input
                  {...register("mapLink")}
                  placeholder="https://maps.google.com/..."
                  className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Latitude</label>
                <input
                  {...register("latitude")}
                  className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Longitude</label>
                <input
                  {...register("longitude")}
                  className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.13em] text-[#8390b2]">Business Details</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Description</label>
                <textarea
                  rows={3}
                  {...register("description")}
                  className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Service Tags</label>
                <input
                  {...register("services")}
                  placeholder="Delivery, Fresh Produce, AC"
                  className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Opening Time</label>
                <input
                  {...register("openingTime")}
                  placeholder="09:00 AM"
                  className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Closing Time</label>
                <input
                  {...register("closingTime")}
                  placeholder="09:00 PM"
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
              <div className="flex items-center gap-4 pt-8 text-sm font-semibold text-[#3f4c74]">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" {...register("featured")} /> Featured
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" {...register("verified")} /> Verified
                </label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.13em] text-[#8390b2]">SEO</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">SEO Title</label>
                <input
                  {...register("seoTitle")}
                  className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">SEO Description</label>
                <textarea
                  rows={3}
                  {...register("seoDescription")}
                  className="w-full rounded-xl border border-[#e3e8f3] px-3 py-2.5 text-sm outline-none focus:border-[#f39a4f]"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.13em] text-[#8390b2]">Images</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Business Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("logo")}
                  className="w-full rounded-xl border border-[#e3e8f3] bg-white px-3 py-2 text-sm"
                />
                {logoFilePreview ? (
                  <img
                    src={logoFilePreview}
                    alt="Logo preview"
                    className="mt-3 h-28 w-28 rounded-xl border border-[#e3e8f3] object-cover"
                  />
                ) : null}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Banner Image</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register("banner")}
                  className="w-full rounded-xl border border-[#e3e8f3] bg-white px-3 py-2 text-sm"
                />
                {bannerFilePreview ? (
                  <img
                    src={bannerFilePreview}
                    alt="Banner preview"
                    className="mt-3 h-28 w-full rounded-xl border border-[#e3e8f3] object-cover"
                  />
                ) : null}
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-[#3f4c74]">Gallery Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  {...register("gallery")}
                  className="w-full rounded-xl border border-[#e3e8f3] bg-white px-3 py-2 text-sm"
                />

                {editing && (editing.gallery || []).length > 0 ? (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#8b97b8]">
                      Existing Gallery (click to remove)
                    </p>
                    <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
                      {(editing.gallery || []).map((image) => {
                        const removed = removedGalleryIds.includes(image.id);
                        return (
                          <button
                            key={image.id}
                            type="button"
                            onClick={() => toggleRemoveGallery(image.id)}
                            className={`relative overflow-hidden rounded-xl border ${
                              removed ? "border-rose-400 opacity-45" : "border-[#dfe6f4]"
                            }`}
                          >
                            <img src={absoluteImage(image.image)} alt="Gallery" className="h-20 w-full object-cover" />
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-xs text-[#8a96b5]">
                      Removed images in this edit: {removedGalleryIds.length}
                    </p>
                  </div>
                ) : null}

                {visibleGallery.length === 0 && editing ? (
                  <p className="mt-2 text-xs text-[#8a96b5]">No existing gallery images kept.</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-[#edf0f7] pt-4">
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
              {isSubmitting ? "Saving..." : editing ? "Update Business" : "Create Business"}
            </button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}
