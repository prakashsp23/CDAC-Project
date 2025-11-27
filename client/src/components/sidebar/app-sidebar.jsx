import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "../../components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"
import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <TeamSwitcher />
        {/* <div className="text-xl font-semibold font-[Montserrat]">Service Station</div> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        {/* <NavProjects /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
