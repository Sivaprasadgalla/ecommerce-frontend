"use client";
import React from "react";
import Link from "next/link";

type Item = { name: string; href: string; icon: React.ReactNode };

type Props = {
  open: boolean;
  onClose?: () => void; // optional close handler for mobile
};

export default function AdminSidebar({ open, onClose }: Props) {
  const items: Item[] = [
    { name: "Dashboard", href: "/admin", icon: dashboardIcon() },
    { name: "Users", href: "/admin/users", icon: usersIcon() },
    { name: "Products", href: "/admin/products", icon: productsIcon() },
    { name: "Orders", href: "/admin/orders", icon: ordersIcon() },
    { name: "Settings", href: "/admin/settings", icon: settingsIcon() },
  ];

  return (
    <>
      {/* overlay for small screens */}
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-40 transition-opacity lg:hidden ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-auto`}
        aria-hidden={false}
      >
        <div className="h-16 flex items-center px-4 border-b border-gray-100">
          <div className="text-lg font-semibold">Admin</div>
        </div>

        <nav className="px-2 py-4 space-y-1">
          {items.map((it) => (
            <Link key={it.name} href={it.href} className="group flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50">
              <span className="w-5 h-5 text-gray-600">{it.icon}</span>
              <span className="text-sm text-gray-800">{it.name}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-3 py-4">
          <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50">
            <span className="w-5 h-5 text-gray-600">{logoutIcon()}</span>
            <span className="text-sm text-gray-800">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

/* Inline SVG icons (no external libs) */
function dashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" />
    </svg>
  );
}
function usersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-3-3.87M9 21v-2a4 4 0 013-3.87M12 7a4 4 0 100-8 4 4 0 000 8z" transform="translate(0 1)"/>
    </svg>
  );
}
function settingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" />
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 014.27 16.9l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82L4.27 4.27A2 2 0 017.1 1.44l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V1a2 2 0 014 0v.09c.12.62.54 1.12 1 1.51h.11a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.11c.39.46.9.88 1.51 1V9a2 2 0 010 4h-.09c-.62.12-1.12.54-1.51 1z" />
    </svg>
  );
}
function ordersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
    </svg>
  );
}
function productsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4" />
    </svg>
  );
}
function logoutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M7 8v8" />
    </svg>
  );
}
