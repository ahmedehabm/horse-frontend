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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const isAdmin = role === "ADMIN";

  // 🔥 IMPORTANT: use translation keys instead of labels
  const navLinks =
    role === "ADMIN"
      ? [
          { to: "/admin/horses", icon: FaHorseHead, key: "nav.manageHorses" },
          { to: "/admin/devices", icon: FaBox, key: "nav.manageDevices" },
          { to: "/admin/users", icon: FaUsers, key: "nav.users" },
          { to: "/admin/signup", icon: FaUserPlus, key: "users.signupUsers" },
        ]
      : [
          {
            to: "/user/dashboard",
            icon: FaTachometerAlt,
            key: "nav.dashboard",
          },
          // { to: "/user/feeders", icon: FaTachometerAlt, key: "nav.feeders" },
        ];

  async function handleLogout() {
    const socket = getSocket();

    try {
      if (socket?.connected) {
        await socket.timeout(800).emitWithAck("LOGOUT");
      }
    } catch {
      // ignore
    } finally {
      logout();
    }
  }

  return (
    <>
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } xl:translate-x-0 fixed xl:sticky top-0 left-0 h-screen w-64 xl:w-80 bg-white/80 backdrop-blur-md border-r border-green-100 shadow-xl flex flex-col transition-all duration-300 ease-in-out z-30 xl:z-auto`}
      >
        {/* Header */}
        <div className="px-6 py-6 border-b border-green-100 bg-linear-to-r from-green-50 to-emerald-50">
          <h2 className="text-2xl font-bold bg-linear-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
            {isAdmin ? t("sidebar.adminPortal") : t("sidebar.userDashboard")}
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 overflow-y-auto">
          <ul className="space-y-1">
            {navLinks.map(({ to, icon: Icon, key }) => (
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
                    {t(key)}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info */}
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
                {user?.name || t("sidebar.defaultName", { role })}
              </p>

              <p className="text-xs text-gray-600 truncate mt-0.5">
                {user?.username ||
                  (isAdmin
                    ? t("sidebar.defaultAdminEmail")
                    : t("sidebar.defaultUserEmail"))}
              </p>

              <span
                className={`inline-block mt-1.5 px-3 py-1 text-xs font-bold rounded-full border shadow-sm ${
                  isAdmin
                    ? "bg-linear-to-r from-green-100 to-emerald-100 text-green-800 border-green-200"
                    : "bg-linear-to-r from-blue-100 to-sky-100 text-blue-800 border-blue-200"
                }`}
              >
                {isAdmin ? t("sidebar.administrator") : t("sidebar.user")}
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
                <span>{t("auth.loggingOut")}</span>
              </>
            ) : (
              <>
                <FaSignOutAlt className="text-lg" />
                <span>{t("auth.signOut")}</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="xl:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-20"
        />
      )}
    </>
  );
}
