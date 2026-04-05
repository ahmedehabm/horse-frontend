// src/ui/DashboardLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useSession } from "../features/Auth/authHooks";
import Sidebar from "./Sidebar";
import { WebSocketProvider } from "./WebSocketContext";
import LanguageSwitcher from "./LanguageSwithcher";

export default function AppLayout({
  role = "USER",
}: {
  role: "USER" | "ADMIN";
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSession();
  const { t } = useTranslation();

  const isAdmin = role === "ADMIN";

  return (
    <WebSocketProvider>
      <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-50">
        {/* Mobile Header */}
        <header className="xl:hidden bg-white/80 backdrop-blur-md border-b border-green-100 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <h2 className="text-xl font-bold bg-linear-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
            {isAdmin ? t("nav.dashboard") + " Admin" : t("nav.dashboard")}
          </h2>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
            >
              {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar Component */}
          <Sidebar
            role={role}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Desktop Header */}
            <header className="hidden xl:flex bg-white/90 backdrop-blur-md border-b border-green-100 px-8 py-6 items-center justify-between sticky top-0 z-10 shadow-sm">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-800">
                  {t("common.welcomeBack")},
                </h1>
                <span className="text-xl font-semibold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {user?.name || (isAdmin ? "Admin" : "User")}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <LanguageSwitcher />
              </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-6  xl:p-10 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </WebSocketProvider>
  );
}
