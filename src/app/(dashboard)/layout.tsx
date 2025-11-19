import React from "react";
import Sidebar from "@/components/sidebar";

// --- Top Navigation Component (Moved here) ---
const TopNavigation = () => (
  <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-20">
    {/* Logo Section */}
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-[#E84E33] rounded-lg flex items-center justify-center text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      </div>
      <span className="text-2xl font-bold text-gray-900 tracking-tight">
        Progress
      </span>
    </div>

    {/* Search Bar */}
    <div className="relative w-96">
      <input
        type="text"
        placeholder="Search"
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-red-500 text-sm"
      />
      <svg
        className="w-4 h-4 absolute left-3 top-3 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  </header>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {/* Top Bar */}
      <TopNavigation />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="shrink-0 w-64 h-full border-r border-gray-200">
          <Sidebar />
        </div>

        {/* Page Content (Scrollable) */}
        <div className="flex-1 h-full overflow-y-auto bg-white">{children}</div>
      </div>
    </div>
  );
}
