import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ListTree,
  Layers,
  Building2,
  Store,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/categories", label: "Categories", icon: ListTree },
  { to: "/admin/categories?segment=yashaswini", label: "Yashaswini Categories", icon: Store },
  { to: "/admin/subcategories", label: "Subcategories", icon: Layers },
  { to: "/admin/businesses", label: "Businesses", icon: Building2 },
  { to: "/admin/businesses?segment=yashaswini", label: "Yashaswini Mart", icon: Store },
];

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  function isNavItemActive(target: string, end?: boolean) {
    const [targetPath, targetSearch = ""] = target.split("?");
    const normalizedTargetSearch = targetSearch ? `?${targetSearch}` : "";

    if (end) {
      return location.pathname === targetPath && location.search === normalizedTargetSearch;
    }

    return location.pathname === targetPath && location.search === normalizedTargetSearch;
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <div className="flex">
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-[#e8ebf5] bg-white shadow-xl transition-transform duration-300 md:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-20 items-center justify-between border-b border-[#eef1f8] px-6">
            <Link to="/admin" className="text-xl font-extrabold text-[#1d2748]">
              Kay Pahije Admin
            </Link>
            <button
              className="md:hidden rounded-lg border border-[#e3e8f3] p-2"
              onClick={() => setOpen(false)}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-1 p-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={() =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isNavItemActive(item.to, item.end)
                      ? "bg-[#fff1e7] text-[#e26f16]"
                      : "text-[#5f6d91] hover:bg-[#f4f7ff] hover:text-[#1f2b52]"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}

            <button
              type="button"
              onClick={logout}
              className="mt-4 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#5f6d91] transition hover:bg-[#f4f7ff] hover:text-[#1f2b52]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
        </aside>

        <div className="min-h-screen flex-1 md:ml-72">
          <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-[#e8ebf5] bg-white/95 px-4 backdrop-blur md:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-xl border border-[#e3e8f3] p-2 md:hidden"
                onClick={() => setOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#8a96b5]">Admin Dashboard</p>
                <h1 className="text-lg font-bold text-[#1f2b52]">Business Directory Console</h1>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-[#1f2b52]">{user?.name || "Admin"}</p>
              <p className="text-xs text-[#8a96b5]">{user?.email}</p>
            </div>
          </header>

          <main className="p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      {open && (
        <button
          aria-label="Close sidebar overlay"
          type="button"
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
