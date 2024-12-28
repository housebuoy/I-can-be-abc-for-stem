import React from "react";
import { Users, Home, ShoppingCart, LogOut, Settings, Package, BarChart } from "lucide-react"
import Link from "next/link"; 
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

 
// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Orders management",
    url: "/admin/order-management",
    icon: ShoppingCart,
  },
  {
    title: "Users management",
    url: "/admin/user-management",
    icon: Users,
  },
  {
    title: "Reports and Analytics",
    url: "#",
    icon: BarChart,
  },
  {
    title: "Products Management",
    url: "/studio/structure",
    icon: Package,
  },
  {
    title: "Logout",
    url: "/ProfilePage",
    icon: LogOut,
  },
]

const AdminSidebar = () => {
  return (
    <Sidebar className="pt-24" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Dashboard Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="text-3xl"/>
                      <span>{item.title}</span>
                    </Link>
                    
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
