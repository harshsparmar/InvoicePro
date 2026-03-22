import { Menu } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import useTheme from "../../hooks/useTheme";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <main className="flex-1 p-4">
          <div className="min-h-[calc(100vh-2rem)] p-1 md:p-2">
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl border border-theme bg-white p-2.5 text-[color:var(--text)] transition hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                <Menu size={18} />
              </button>
              <p className="text-sm font-semibold text-muted">InvoicePro</p>
              <div className="w-10" />
            </div>

            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
