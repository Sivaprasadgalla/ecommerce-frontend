"use client";
import AdminHeader from "@/components/header/admin";
import AdminSidebar from "@/components/sidebar/AdminSidebar";
import React, { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-w-0">
        <AdminHeader onToggleSidebar={() => setSidebarOpen((s) => !s)} />

        <main className="pt-5 lg:pl-5">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
