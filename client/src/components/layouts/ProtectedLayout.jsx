import { Outlet } from "react-router-dom"
import { SidebarProvider } from "../ui/sidebar"
import { AppSidebar } from "../sidebar/app-sidebar"
import { SidebarTrigger } from "../ui/sidebar"
import { ModeToggle } from "../mode-toggle"

export default function ProtectedLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col w-full">
        <header className="flex h-16 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1" />
          <ModeToggle />
        </header>
        <main className="flex-1 overflow-auto">
          <div className="p-2 bg-muted h-full">
            <div className="rounded-lg h-full w-full bg-background">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
