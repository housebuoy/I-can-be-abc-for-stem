"use client";

import { usePathname } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isStudioPath = pathname.startsWith("/studio");
  const isErrorPath = pathname.endsWith("/error");
  const excludedRoutes = ["/signup", "/login", "/studio/structure"];
  const hideHeaderFooter = excludedRoutes.includes(pathname) || isStudioPath || isErrorPath;
  

  return (
    <>
      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && <Footer />}
    </>
  );
}
