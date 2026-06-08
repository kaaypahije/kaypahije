import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import {
  FolderTree,
  ImageUp,
  Layers,
  Building2,
  Sparkles,
  BadgeCheck,
  CircleCheckBig,
} from "lucide-react";
import { SectionCard } from "@/admin/components/SectionCard";
import { fetchDashboardStats, fetchHeroSettings, updateHeroSettings } from "@/services/api";
import { buildApiUrl } from "@/services/http";
import type { DashboardStats, HeroSettings } from "@/types/directory";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const cardConfig = [
  { key: "totalCategories", label: "Total Categories", icon: FolderTree },
  { key: "totalSubcategories", label: "Total Subcategories", icon: Layers },
  { key: "totalBusinesses", label: "Total Businesses", icon: Building2 },
  { key: "featuredBusinesses", label: "Featured Businesses", icon: Sparkles },
  { key: "verifiedBusinesses", label: "Verified Businesses", icon: BadgeCheck },
  { key: "activeListings", label: "Active Listings", icon: CircleCheckBig },
] as const;

const pieColors = ["#ff8f3f", "#1f2b52", "#6d7c9f"];

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function resolveImage(path: string | null | undefined) {
  if (!path) {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return buildApiUrl(path);
}

export function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroSettings, setHeroSettings] = useState<HeroSettings | null>(null);
  const [savingHero, setSavingHero] = useState(false);
  const [deletingBanner, setDeletingBanner] = useState<"primary" | "secondary" | null>(null);
  const [heroBannerPrimaryFile, setHeroBannerPrimaryFile] = useState<File | null>(null);
  const [heroBannerSecondaryFile, setHeroBannerSecondaryFile] = useState<File | null>(null);
  const primaryInputRef = useRef<HTMLInputElement | null>(null);
  const secondaryInputRef = useRef<HTMLInputElement | null>(null);

  const heroPrimaryPreview = useMemo(
    () => (heroBannerPrimaryFile ? URL.createObjectURL(heroBannerPrimaryFile) : ""),
    [heroBannerPrimaryFile],
  );
  const heroSecondaryPreview = useMemo(
    () => (heroBannerSecondaryFile ? URL.createObjectURL(heroBannerSecondaryFile) : ""),
    [heroBannerSecondaryFile],
  );

  useEffect(() => {
    return () => {
      if (heroPrimaryPreview) {
        URL.revokeObjectURL(heroPrimaryPreview);
      }
      if (heroSecondaryPreview) {
        URL.revokeObjectURL(heroSecondaryPreview);
      }
    };
  }, [heroPrimaryPreview, heroSecondaryPreview]);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!token) {
        return;
      }

      try {
        setLoading(true);
        const response = await fetchDashboardStats(token);
        if (active) {
          setStats(response.data);
        }
      } catch (error) {
        if (active) {
          const message = error instanceof Error ? error.message : "Failed to load dashboard";
          toast.error(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    let active = true;

    async function loadHeroSettings() {
      try {
        const response = await fetchHeroSettings();
        if (active) {
          setHeroSettings(response.data);
        }
      } catch (error) {
        if (active) {
          const message = error instanceof Error ? error.message : "Failed to load hero banners";
          toast.error(message);
        }
      }
    }

    loadHeroSettings();

    return () => {
      active = false;
    };
  }, []);

  const pieData = useMemo(() => {
    if (!stats) {
      return [];
    }

    return [
      { name: "Featured", value: stats.cards.featuredBusinesses },
      { name: "Verified", value: stats.cards.verifiedBusinesses },
      {
        name: "Others",
        value:
          stats.cards.totalBusinesses -
          Math.max(stats.cards.featuredBusinesses, stats.cards.verifiedBusinesses),
      },
    ];
  }, [stats]);

  const primaryBannerImage = heroPrimaryPreview || resolveImage(heroSettings?.heroBannerPrimary);
  const secondaryBannerImage = heroSecondaryPreview || resolveImage(heroSettings?.heroBannerSecondary);

  async function handleHeroSettingsSave() {
    if (!token) {
      return;
    }

    if (!heroBannerPrimaryFile && !heroBannerSecondaryFile) {
      toast.error("Select at least one hero banner image");
      return;
    }

    const formData = new FormData();
    if (heroBannerPrimaryFile) {
      formData.append("heroBannerPrimary", heroBannerPrimaryFile);
    }
    if (heroBannerSecondaryFile) {
      formData.append("heroBannerSecondary", heroBannerSecondaryFile);
    }

    try {
      setSavingHero(true);
      const response = await updateHeroSettings(token, formData);
      setHeroSettings(response.data);
      setHeroBannerPrimaryFile(null);
      setHeroBannerSecondaryFile(null);
      if (primaryInputRef.current) {
        primaryInputRef.current.value = "";
      }
      if (secondaryInputRef.current) {
        secondaryInputRef.current.value = "";
      }
      toast.success("Hero banners updated");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update hero banners";
      toast.error(message);
    } finally {
      setSavingHero(false);
    }
  }

  async function handleHeroBannerDelete(target: "primary" | "secondary") {
    if (!token) {
      return;
    }

    const formData = new FormData();
    formData.append(target === "primary" ? "removeHeroBannerPrimary" : "removeHeroBannerSecondary", "true");

    try {
      setDeletingBanner(target);
      const response = await updateHeroSettings(token, formData);
      setHeroSettings(response.data);

      if (target === "primary") {
        setHeroBannerPrimaryFile(null);
        if (primaryInputRef.current) {
          primaryInputRef.current.value = "";
        }
      } else {
        setHeroBannerSecondaryFile(null);
        if (secondaryInputRef.current) {
          secondaryInputRef.current.value = "";
        }
      }

      toast.success(`Hero banner ${target === "primary" ? "1" : "2"} deleted`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete hero banner";
      toast.error(message);
    } finally {
      setDeletingBanner(null);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-[#e8ebf5] bg-white p-6 text-sm text-[#6d7c9f] shadow-sm">
        Loading dashboard overview...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-3xl border border-[#e8ebf5] bg-white p-6 text-sm text-[#6d7c9f] shadow-sm">
        Unable to load dashboard data.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cardConfig.map((card) => (
          <div
            key={card.key}
            className="rounded-3xl border border-[#e8ebf5] bg-white p-5 shadow-sm transition hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#7684a7]">{card.label}</p>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#fff1e7] text-[#e3721a]">
                <card.icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-[#1f2b52]">
              {(stats.cards[card.key] || 0).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>

      <SectionCard
        title="Yashaswini Mart Controls"
        subtitle="Manage Yashaswini Mart categories and listings from admin"
      >
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/categories?segment=yashaswini"
            className="inline-flex items-center rounded-xl border border-[#dfe6f4] bg-white px-4 py-2.5 text-sm font-semibold text-[#41527d]"
          >
            Manage Yashaswini Categories
          </Link>
          <Link
            to="/admin/businesses?segment=yashaswini"
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#f28a32] to-[#ffb16a] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Open Yashaswini Mart Management
          </Link>
          <Link
            to="/yashaswini-mart"
            className="inline-flex items-center rounded-xl border border-[#dfe6f4] bg-white px-4 py-2.5 text-sm font-semibold text-[#41527d]"
          >
            View Frontend Yashaswini Page
          </Link>
        </div>
      </SectionCard>

      <SectionCard
        title="Homepage Hero Banners"
        subtitle="Update the two banner images shown in the frontend hero section"
        action={
          <button
            type="button"
            onClick={handleHeroSettingsSave}
            disabled={savingHero}
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-[#f28a32] to-[#ffb16a] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {savingHero ? "Saving..." : "Save Hero Banners"}
          </button>
        }
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1f2b52]">
              <ImageUp className="h-4 w-4 text-[#e3721a]" />
              Hero Banner 1
            </div>
            <label className="block rounded-2xl border border-dashed border-[#d9e2f1] bg-[#fafbfd] p-4">
              <span className="mb-2 block text-sm font-medium text-[#425071]">
                {primaryBannerImage ? "Replace image" : "Upload image"}
              </span>
              <input
                ref={primaryInputRef}
                type="file"
                accept="image/*"
                onChange={(event) => setHeroBannerPrimaryFile(event.target.files?.[0] || null)}
                className="block w-full text-sm text-[#66738f] file:mr-4 file:rounded-xl file:border-0 file:bg-[#fff1e7] file:px-4 file:py-2 file:font-semibold file:text-[#e3721a]"
              />
              <p className="mt-2 text-xs text-[#7d89a8]">Recommended: wide desktop banner image.</p>
            </label>
            <div className="overflow-hidden rounded-2xl border border-[#e8ebf5] bg-[#f7f9fc]">
              {primaryBannerImage ? (
                <img src={primaryBannerImage} alt="Hero banner 1 preview" className="h-48 w-full object-cover" />
              ) : (
                <div className="flex h-48 items-center justify-center text-sm text-[#7d89a8]">
                  No banner uploaded yet
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => handleHeroBannerDelete("primary")}
                disabled={!heroSettings?.heroBannerPrimary || deletingBanner === "primary" || savingHero}
                className="inline-flex items-center rounded-xl border border-[#f3d6d6] bg-white px-4 py-2 text-sm font-semibold text-[#c45050] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingBanner === "primary" ? "Deleting..." : "Delete Banner"}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1f2b52]">
              <ImageUp className="h-4 w-4 text-[#e3721a]" />
              Hero Banner 2
            </div>
            <label className="block rounded-2xl border border-dashed border-[#d9e2f1] bg-[#fafbfd] p-4">
              <span className="mb-2 block text-sm font-medium text-[#425071]">
                {secondaryBannerImage ? "Replace image" : "Upload image"}
              </span>
              <input
                ref={secondaryInputRef}
                type="file"
                accept="image/*"
                onChange={(event) => setHeroBannerSecondaryFile(event.target.files?.[0] || null)}
                className="block w-full text-sm text-[#66738f] file:mr-4 file:rounded-xl file:border-0 file:bg-[#fff1e7] file:px-4 file:py-2 file:font-semibold file:text-[#e3721a]"
              />
              <p className="mt-2 text-xs text-[#7d89a8]">Recommended: same ratio as banner 1.</p>
            </label>
            <div className="overflow-hidden rounded-2xl border border-[#e8ebf5] bg-[#f7f9fc]">
              {secondaryBannerImage ? (
                <img src={secondaryBannerImage} alt="Hero banner 2 preview" className="h-48 w-full object-cover" />
              ) : (
                <div className="flex h-48 items-center justify-center text-sm text-[#7d89a8]">
                  No banner uploaded yet
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => handleHeroBannerDelete("secondary")}
                disabled={!heroSettings?.heroBannerSecondary || deletingBanner === "secondary" || savingHero}
                className="inline-flex items-center rounded-xl border border-[#f3d6d6] bg-white px-4 py-2 text-sm font-semibold text-[#c45050] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingBanner === "secondary" ? "Deleting..." : "Delete Banner"}
              </button>
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <SectionCard title="Business Growth" subtitle="Monthly listings added">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyBusinesses}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2fb" />
                <XAxis dataKey="label" stroke="#8795b6" fontSize={12} />
                <YAxis stroke="#8795b6" fontSize={12} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "rgba(255, 177, 106, 0.15)" }}
                  formatter={(value: number) => [value, "Listings"]}
                />
                <Bar dataKey="count" fill="#f28a32" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Listing Mix" subtitle="Featured and verified balance">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={3}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value, "Count"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {pieData.map((entry, index) => (
              <span
                key={entry.name}
                className="inline-flex items-center gap-2 rounded-full bg-[#f7f8fc] px-3 py-1 text-xs font-semibold text-[#4d5a7d]"
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: pieColors[index % pieColors.length] }}
                />
                {entry.name}: {entry.value}
              </span>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Recent Businesses" subtitle="Latest listings added to directory">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#edf0f7] text-[#7b89ad]">
                <th className="px-3 py-3 font-semibold">Business</th>
                <th className="px-3 py-3 font-semibold">Category</th>
                <th className="px-3 py-3 font-semibold">Location</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentBusinesses.map((business) => (
                <tr key={business.id} className="border-b border-[#f0f3fa] last:border-0">
                  <td className="px-3 py-3">
                    <p className="font-semibold text-[#22305a]">{business.businessName}</p>
                    <p className="text-xs text-[#7e8aac]">/{business.slug}</p>
                  </td>
                  <td className="px-3 py-3 text-[#4f5e83]">{business.category?.name || "-"}</td>
                  <td className="px-3 py-3 text-[#4f5e83]">{[business.area, business.city].filter(Boolean).join(", ")}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
