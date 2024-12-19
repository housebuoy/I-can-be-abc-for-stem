"use client";

import { usePathname } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import admin from "./admin/page";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isStudioPath = pathname.startsWith("/studio");
  const isErrorPath = pathname.endsWith("/error");
  const adminDashboard = pathname.startsWith("/Admin")
  const excludedHeaderRoutes = ["/signup", "/login", "/studio/structure"];
  const excludedFooterRoutes = pathname.startsWith("/admin")
  const hideHeaderFooter = excludedHeaderRoutes.includes(pathname) || isStudioPath || isErrorPath;  
  const hideFooter = excludedFooterRoutes
  

  return (
    <>
      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && !hideFooter && <Footer />}
    </>
  );
}
