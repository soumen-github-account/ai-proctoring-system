import {
  UserRoundPlus,
  Video,
  House,
  BookOpenCheck,
  UserRoundPen,
  ClipboardClock,
  X
} from "lucide-react";
import { NavLink } from "react-router-dom";
import logo_img from "../assets/logo.png";

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { to: "/", label: "Dashboard", Icon: House },
    { to: "/live-stream", label: "Live Stream", Icon: Video },
    { to: "/manage-candidate", label: "Manage Candidate", Icon: UserRoundPen },
    { to: "/exam-data", label: "Exam Data", Icon: BookOpenCheck },
    { to: "/add-candidate", label: "Add Candidate", Icon: UserRoundPlus },
    { to: "/conduct-exam", label: "Conduct Exam", Icon: ClipboardClock }
  ];

  return (
    <div
      className={`
        fixed md:static z-50
        w-60 min-h-screen bg-white border-r-1 border-r-gray-300
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      {/* Mobile Close Button */}
      <div className="md:hidden flex justify-end p-4">
        <button onClick={onClose}>
          <X />
        </button>
      </div>

      <div className="px-4">
        <div className="flex justify-center my-2 mt-5">
          <img src={logo_img} className="w-28" alt="logo" />
        </div>

        <h1 className="text-center font-medium text-gray-800">Admin</h1>

        <nav className="mt-6 space-y-2">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose} // close sidebar on mobile click
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-full text-sm font-medium
                 transition-all shadow-md
                 ${
                   isActive
                     ? "bg-gradient-to-r from-[#03193f] to-[#6b5cff] text-white"
                     : "text-gray-700 hover:bg-gray-100"
                 }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 w-full border-t-1 border-gray-300 px-4 py-3 text-xs text-gray-500">
        © 2026 SDKING DEV
      </div>
    </div>
  );
};

export default Sidebar;
