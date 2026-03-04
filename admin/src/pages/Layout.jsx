import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">

      {/* Topbar (Mobile only) */}
      <div className="h-14 bg-white border-b-1 border-gray-300 flex items-center px-4 py-3 md:hidden">
        <button onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <h1 className="ml-4 font-semibold">Admin Panel</h1>
      </div>

      <div className="flex flex-1 relative">

        {/* Overlay (Mobile) */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
          />
        )}

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 bg-[#eaeaea] p-4 md:p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
