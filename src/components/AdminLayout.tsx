import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeSection,
  onSectionChange
}) => {
  return (
    <SidebarProvider>
      {/* Global header with trigger */}
      <header className="h-12 flex items-center border-b bg-background px-4 fixed top-0 left-0 right-0 z-50">
        <SidebarTrigger className="mr-4" />
        <h1 className="font-semibold">Portail d'Administration</h1>
      </header>

      <div className="flex min-h-screen w-full pt-12">
        <AdminSidebar 
          activeSection={activeSection} 
          onSectionChange={onSectionChange} 
        />
        
        <main className="flex-1 flex">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};