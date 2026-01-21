export const publicLinks = [
  { name: "Home", path: "/" },
  { name: "Events", path: "/events" },
];

export const publicUserLinks = [
  { href: "/user-public/cart", label: "My Cart" },
  { href: "/user-public/download-history", label: "Download History" },
  { href: "/", label: "Logout" },
];

export const privateSuperAdminLinks = [
  { href: "/super-admin/dashboard", label: "Dashboard" },
  { href: "/super-admin/event-lists", label: "Event Lists" }, 
  { href: "/super-admin/users", label: "User Management" },
  { href: "/super-admin/withdrawals", label: "Withdrawal Management" },
  { href: "/", label: "Logout" },
];

export const privateAdminLinks = [
  { href: "/org/profile", label: "My Profile" },
  { href: "/org/dashboard", label: "Dashboard" },
  { href: "/org/create-event", label: "Create/Edit Event" },
  { href: "/org/users", label: "User Management" },
  { href: "/", label: "Logout" },
];

export const privateUserLinks = [
  { href: "/user/profile", label: "My Profile" },
  { href: "/user/dashboard", label: "Dashboard" },
  { href: "/user/event-lists", label: "Event Lists" },
  { href: "/user/my-register", label: "My Register" },
  { href: "/", label: "Logout" },
];

