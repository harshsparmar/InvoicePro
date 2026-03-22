import { NavLink, useLocation } from "react-router-dom";
import { MoonStar, PlusCircle, SunMedium, X } from "lucide-react";

import { navigationItems } from "../../constants/navigation";
import { cn } from "../../utils/cn";
import Button from "../ui/Button";
import LogoMark from "./LogoMark";

const isNavigationActive = (itemPath, pathname) => {
  if (itemPath === "/") {
    return pathname === "/";
  }

  if (itemPath === "/invoices/new") {
    return pathname === "/invoices/new";
  }

  if (itemPath === "/invoices") {
    return pathname === "/invoices" || (pathname.startsWith("/invoices/") && !pathname.startsWith("/invoices/new"));
  }

  return pathname.startsWith(itemPath);
};

const SidebarContent = ({ onClose, theme, toggleTheme }) => {
  const { pathname } = useLocation();

  return (
    <div className="flex h-full flex-col rounded-2xl border border-theme bg-white p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoMark />
          <div>
            <p className="font-display text-lg font-bold">InvoicePro</p>
            <p className="text-sm text-muted">Invoices and customers</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-5">
        <NavLink
          to="/invoices/new"
          onClick={onClose}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 text-sm font-medium text-white transition hover:bg-teal-800 dark:bg-teal-500 dark:text-slate-950"
        >
          <PlusCircle size={16} />
          New Invoice
        </NavLink>
      </div>

      <div className="mt-6 flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto pr-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isNavigationActive(item.path, pathname);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                "group flex min-h-[76px] items-center rounded-xl px-3 py-3 transition",
                isActive
                  ? "bg-teal-50 text-teal-900 dark:bg-teal-500/[0.12] dark:text-teal-200"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "rounded-lg p-2",
                    isActive
                      ? "bg-teal-700 text-white dark:bg-teal-500 dark:text-slate-950"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  )}
                >
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{item.label}</p>
                  <p className="mt-0.5 text-xs leading-5 text-muted">{item.description}</p>
                </div>
              </div>
            </NavLink>
          );
        })}
      </div>

      <div className="mt-4 border-t border-theme pt-4">
        <Button variant="secondary" onClick={toggleTheme} className="w-full justify-center">
          {theme === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </Button>
      </div>
    </div>
  );
};

export default function Sidebar({ open, onClose, theme, toggleTheme }) {
  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-[290px] shrink-0 border-r border-theme bg-slate-50/70 p-4 dark:bg-slate-950/40 lg:block">
        <SidebarContent onClose={onClose} theme={theme} toggleTheme={toggleTheme} />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-40 bg-slate-950/50 p-4 backdrop-blur-sm lg:hidden">
          <div className="h-full max-w-[320px]">
            <SidebarContent onClose={onClose} theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>
      ) : null}
    </>
  );
}
