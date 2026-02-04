// src/ui/DashboardLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useSession } from "../features/Auth/authHooks";
import Sidebar from "./Sidebar";
import { WebSocketProvider } from "./WebSocketContext";

export default function AppLayout({
  role = "USER",
}: {
  role: "USER" | "ADMIN";
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSession();

  const isAdmin = role === "ADMIN";

  return (
    <WebSocketProvider>
      <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-50">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white/80 backdrop-blur-md border-b border-green-100 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <h2 className="text-xl font-bold bg-linear-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
            {isAdmin ? "Admin Dashboard" : "Dashboard"}
          </h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
          >
            {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
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
            <header className="hidden lg:flex bg-white/90 backdrop-blur-md border-b border-green-100 px-8 py-6 items-center justify-between sticky top-0 z-10 shadow-sm">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-800">
                  Welcome Back,
                </h1>
                <span className="text-xl font-semibold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {user?.name || (isAdmin ? "Admin" : "User")}
                </span>
              </div>
              <span
                className={`px-4 py-2 bg-linear-to-r text-sm font-semibold rounded-full border shadow-sm ${
                  isAdmin
                    ? "from-green-100 to-emerald-100 text-green-800 border-green-200"
                    : "from-blue-100 to-sky-100 text-blue-800 border-blue-200"
                }`}
              >
                {isAdmin ? "Admin" : "User"}
              </span>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-6 lg:p-8 xl:p-10 overflow-y-auto">
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
