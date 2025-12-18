export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

export const adminMenuItems = [
  { name: "Dashboard", href: "/admin", icon: "dashboard" },
  { name: "Users", href: "/admin/users", icon: "users" },
  { name: "Settings", href: "/admin/settings", icon: "settings" },
];

export const userMenuItems = [
  { name: "Contacts", href: "/contacts", icon: "contacts" },
  { name: "Profile", href: "/profile", icon: "profile" },
];