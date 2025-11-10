import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import type React from "react";
import { Toaster } from "sonner";

interface HomeTemplateInterface {
  children: React.ReactNode;
}

//replate template to layout, centralize limit of screen in layout.
export default async function RootSettings({
  children,
}: HomeTemplateInterface) {
  return (
    <main className="flex w-full h-screen flex-col bg-background">
      <Toaster />
      <div className="max-w-screen-xl w-full mx-auto max-xl:px-12">
        <SidebarProvider>
          <AppSidebar variant="sidebar" />
          {children}
        </SidebarProvider>
      </div>
    </main>
  );
}
