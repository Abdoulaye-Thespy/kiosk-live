'use client'
import SideNav from '@/app/ui/dashboard/sidenav';
import { withRole } from '@/components/withrole';
 
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav userRole='juridique' />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}

export default withRole(Layout, ['JURIDIQUE'])