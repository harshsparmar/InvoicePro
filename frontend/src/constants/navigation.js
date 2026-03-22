import { FileText, LayoutDashboard, Users } from "lucide-react";

export const navigationItems = [
  {
    label: "Dashboard",
    description: "Revenue, charts, and recent activity",
    path: "/",
    icon: LayoutDashboard
  },
  {
    label: "Customers",
    description: "Manage your client directory",
    path: "/customers",
    icon: Users
  },
  {
    label: "Invoices",
    description: "Track every bill and payment",
    path: "/invoices",
    icon: FileText
  }
];
