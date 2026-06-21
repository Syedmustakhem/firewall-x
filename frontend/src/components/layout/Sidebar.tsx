import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Monitor, ShieldCheck, ListFilter,
  Rocket, FileText, LogOut, Sun, Moon, Shield,
  Activity, BarChart2, Users, Bell, GitBranch,
  Crown, Building2
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import { deploymentsApi, devicesApi } from "../../api";
import { useEffect, useState } from "react";

const coreItems = [
  { to: "/dashboard",        icon: LayoutDashboard, label: "Dashboard"   },
  { to: "/devices",          icon: Monitor,         label: "Devices"     },
  { to: "/policies",         icon: ShieldCheck,     label: "Policies"    },
  { to: "/rules",            icon: ListFilter,      label: "Rules"       },
  { to: "/deployments",      icon: Rocket,          label: "Deployments" },
  { to: "/logs",             icon: FileText,        label: "Logs"        },
];

const featureItems = [
  { to: "/heartbeat",        icon: Activity,        label: "Heartbeat"   },
  { to: "/traffic",          icon: BarChart2,       label: "Traffic"     },
  { to: "/users",            icon: Users,           label: "Users"       },
  { to: "/alerts",           icon: Bell,            label: "Alerts", badge: true },
  { to: "/versions",         icon: GitBranch,       label: "Versions"    },
];

const adminItems = [
  { to: "/super-admin",      icon: Crown,           label: "Super Admin" },
  { to: "/client-dashboard", icon: Building2,       label: "Client View" },
];

export const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const { isDark, toggle } = useThemeStore();
  const navigate = useNavigate();
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const check = async () => {
      try {
        const [depRes, devRes] = await Promise.all([deploymentsApi.getAll(), devicesApi.getAll()]);
        const failed = depRes.data.filter((d: any) => d.status === "failed").length;
        const offline = devRes.data.filter((d: any) => d.status === "offline").length;
        setAlertCount(failed + offline);
      } catch { }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  const NavItem = ({ to, icon: Icon, label, badge }: { to: string; icon: any; label: string; badge?: boolean }) => (
    <NavLink to={to}
      className={({ isActive }) =>
        `sidebar-item ${isActive ? "sidebar-item-active" : "sidebar-item-inactive"}`
      }>
      <Icon className="w-4 h-4 flex-shrink-0" />
      {label}
      {badge && alertCount > 0 && (
        <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
          {alertCount}
        </span>
      )}
    </NavLink>
  );

  return (
    <aside className="w-64 h-screen flex flex-col bg-white dark:bg-[#0d1117] border-r border-gray-200 dark:border-gray-800 fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg shadow-blue-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white tracking-tight">FirewallX</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">Management Console</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto scrollbar-hide">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider px-3 py-2">Core</p>
        {coreItems.map((item) => <NavItem key={item.to} {...item} />)}

        <p className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider px-3 py-2 mt-3">Features</p>
        {featureItems.map((item) => <NavItem key={item.to} {...item} />)}

        <p className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider px-3 py-2 mt-3">Admin</p>
        {adminItems.map((item) => <NavItem key={item.to} {...item} />)}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
        <button onClick={toggle} className="sidebar-item sidebar-item-inactive w-full">
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user?.role}</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate("/login"); }}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};