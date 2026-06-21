import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

// WHY LAYOUT COMPONENT?
// All pages share the same sidebar. Instead of adding the sidebar
// to every page, we wrap them in a Layout. React Router's <Outlet>
// renders the current page inside this layout. Clean and DRY.

export const Layout = () => (
  <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
    <Sidebar />
    <main className="flex-1 ml-64 p-8 overflow-y-auto">
      <Outlet />
    </main>
  </div>
);