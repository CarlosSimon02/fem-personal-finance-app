import {
  SidebarProvider,
  SidebarTrigger,
} from "@/presentation/components/ui/sidebar";
import AppSidebar from "./_components/AppSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        <div className="p-4 [&>*]:container [&>*]:mx-auto">{children}</div>
      </main>
    </SidebarProvider>
  );
}
