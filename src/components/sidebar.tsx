"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const TrainingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);
const AnimalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const FolderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    />
  </svg>
);
const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);
const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const NavLink = ({
  href,
  icon,
  label,
  isActive,
  isButton = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isButton?: boolean;
}) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-md mb-1 transition-all duration-200 ${
        isActive || isButton
          ? "bg-[#C92A2A] text-white shadow-md font-medium"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <span className={isActive || isButton ? "text-white" : "text-gray-400"}>
        {icon}
      </span>
      <span className="text-sm">{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const { userId, fullName, admin, logout } = useAuth();
  const pathname = usePathname();
  const initial = fullName ? fullName.charAt(0).toUpperCase() : "U";
  // if (!userId) return null; // for testing

  return (
    <div className="flex flex-col h-full pt-6 pb-4 px-3 bg-white">
      {/* Main Nav */}
      <nav className="flex-1 space-y-1 mt-2">
        <NavLink
          href="/"
          icon={<TrainingIcon />}
          label="Training logs"
          isButton={pathname === "/"}
          isActive={pathname === "/"}
        />
        <NavLink
          href="/animals"
          icon={<AnimalIcon />}
          label="Animals"
          isActive={pathname === "/animals"}
        />

        {/* Admin Section */}
        {admin && (
          <div className="mt-8 px-4 mb-2">
            <div className="h-px bg-gray-200 w-full mb-4"></div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Admin access
            </span>
            <div className="mt-2 space-y-1 -mx-4 px-4">
              {" "}
              {/* Reset padding for links */}
              <NavLink
                href="/admin"
                icon={<FolderIcon />}
                label="All training"
                isActive={pathname === "/admin"}
              />
              <NavLink
                href="/admin/animals"
                icon={<AnimalIcon />}
                label="All animals"
                isActive={pathname === "/admin/animals"}
              />
              <NavLink
                href="/admin/users"
                icon={<UsersIcon />}
                label="All users"
                isActive={pathname === "/admin/users"}
              />
            </div>
          </div>
        )}
      </nav>

      {/* Footer User Card */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-50 group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C92A2A] text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {initial}
            </div>
            <div className="flex flex-col">
              {/* Use the real name from context */}
              <span className="text-sm font-bold text-gray-900">
                {fullName || "User"}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {admin ? "Admin" : "Trainer"}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-[#C92A2A] transition-colors"
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
