import AdminSidebar from '@/components/AdminSidebar'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import React from 'react'


const Admin = () => {
  return (
  <div >
    <SidebarProvider>
        <AdminSidebar />
        <main>
            <SidebarTrigger className="mt-28 z-50 fixed hover:text-indigo-600"/>
        </main> 
    </SidebarProvider>
    </div>
  )
}

export default Admin