import AdminDashboard from "@/components/admin/AdminDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel | Om Santosh Wakchaure Portfolio",
  description: "Admin Panel for managing personal portfolio content and skills.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
