import { NavLink } from "react-router-dom";
import {
  FaSignOutAlt,
  FaUsers,
  FaHorseHead,
  FaBox,
  FaTachometerAlt,
  FaUserPlus,
} from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useLogout, useSession } from "../features/Auth/authHooks";
import { Dispatch, SetStateAction } from "react";
import { useWebSocket } from "./WebSocketContext";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  role = "USER",
}: {
  sidebarOpen: Boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  role: "USER" | "ADMIN";
}) {
  const { user } = useSession();
  const { logout, isPending } = useLogout();
  const { getSocket } = useWebSocket();
  // Role-based navigation links
  const navLinks =
    role === "ADMIN"
      ? [
          {
            to: "/admin/horses",
            icon: FaHorseHead,
            label: "Manage Horses",
          },
          {
            to: "/admin/devices",
            icon: FaBox,
            label: "Manage Devices",
          },
          {
            to: "/admin/users",
            icon: FaUsers,
            label: "Users",
          },
          {
            to: "/admin/signup",
            icon: FaUserPlus,
            label: "Signup Users",
          },
        ]
      : [
          {
            to: "/user/dashboard",
            icon: FaTachometerAlt,
            label: "Dashboard",
          },
          {
            to: "/user/feeders",
            icon: FaTachometerAlt,
            label: "Feeders",
          },
        ];

  async function handleLogout() {
    const socket = getSocket();

    try {
      if (socket?.connected) {
        // Wait up to 800ms for server to confirm it processed LOGOUT
        await socket.timeout(800).emitWithAck("LOGOUT");
      }
    } catch {
      // ignore: fallback will be disconnecting path (5s grace)
    } finally {
      logout(); // now do your react-query logout + navigation
    }
  }
  const isAdmin = role === "ADMIN";

  return (
    <>
      {/* Sidebar - Desktop and Mobile */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:sticky top-0 left-0 h-screen w-64 lg:w-80 bg-white/80 backdrop-blur-md border-r border-green-100 shadow-xl flex flex-col transition-all duration-300 ease-in-out z-30 lg:z-auto`}
      >
        {/* Logo/Header */}
        <div className="px-6 py-6 border-b border-green-100 bg-linear-to-r from-green-50 to-emerald-50">
          <h2 className="text-2xl font-bold bg-linear-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
            {isAdmin ? "Admin Portal" : "User Dashboard"}
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 overflow-y-auto">
          <ul className="space-y-1">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? "bg-linear-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-200"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-700 border border-transparent hover:border-green-200"
                    }`
                  }
                >
                  <Icon className="text-xl group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-sm tracking-wide">
                    {label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-6 border-t border-green-100 bg-green-50/50">
          <div className="flex items-center gap-4 mb-4 px-3 py-3 bg-white/60 rounded-xl backdrop-blur-sm border border-green-100">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                isAdmin
                  ? "bg-linear-to-br from-green-500 to-emerald-500"
                  : "bg-linear-to-br from-blue-500 to-sky-500"
              }`}
            >
              {isAdmin ? (
                <FaUsers className="text-white text-lg" />
              ) : (
                <FaTachometerAlt className="text-white text-lg" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">
                {user?.name || (isAdmin ? "Super Admin" : "User")}
              </p>
              <p className="text-xs text-gray-600 truncate mt-0.5">
                {user?.username ||
                  (isAdmin ? "admin@ostler.com" : "user@ostler.com")}
              </p>
              <span
                className={`inline-block mt-1.5 px-3 py-1 text-xs font-bold rounded-full border shadow-sm ${
                  isAdmin
                    ? "bg-linear-to-r from-green-100 to-emerald-100 text-green-800 border-green-200"
                    : "bg-linear-to-r from-blue-100 to-sky-100 text-blue-800 border-blue-200"
                }`}
              >
                {isAdmin ? "Administrator" : "User"}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={isPending}
            className="w-full flex items-center gap-3 px-5 py-3 rounded-xl text-red-600 hover:bg-red-50/80 hover:text-red-700 transition-all duration-200 font-semibold border border-transparent hover:border-red-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md bg-white/50 backdrop-blur-sm"
          >
            {isPending ? (
              <>
                <Loader2 className="text-lg animate-spin" />
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <FaSignOutAlt className="text-lg" />
                <span>Sign Out</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-20"
        />
      )}
    </>
  );
}
