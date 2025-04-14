import { AdminSidebar } from "@/components/admin/layout/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { FC, PropsWithChildren } from "react";

const AdminLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="w-full flex-1 mx-auto p-4">{children}</div>
    </SidebarProvider>
  );
};

export default AdminLayout;
