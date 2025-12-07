import { MoreHorizontal, FolderOpen, Plus } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from "../../components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

const projects = [
  {
    name: "Design System",
    url: "#",
    icon: FolderOpen,
  },
  {
    name: "Website Redesign",
    url: "#",
    icon: FolderOpen,
  },
  {
    name: "Marketing Site",
    url: "#",
    icon: FolderOpen,
  },
  {
    name: "Mobile App",
    url: "#",
    icon: FolderOpen,
  },
]

export function NavProjects() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarGroupAction title="Add Project">
        <Plus className="size-4" />
        <span className="sr-only">Add Project</span>
      </SidebarGroupAction>
      <SidebarMenu>
        {projects.map((project) => (
          <SidebarMenuItem key={project.name}>
            <SidebarMenuButton asChild>
              <a href={project.url}>
                <project.icon />
                <span>{project.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-lg" side="bottom" align="end">
                <DropdownMenuItem>
                  <span>Open</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
