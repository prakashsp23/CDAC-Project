import { Home, BarChart3, FileText, Inbox, Users, User } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from "../../components/ui/sidebar"
import { useLocation, Link } from "react-router-dom"

const items = [
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Admin Page",
    url: "/admin",
    icon: BarChart3,
  },
  {
    title: "Mechanic Page",
    url: "/mechanic",
    icon: FileText,
  },
  {
    title: "Customer Page",
    url: "/customers",
    icon: Users,
  },
  {
    title: "Feedback",
    url: "#",
    icon: Inbox,
  },
]

export function NavMain() {
  const location = useLocation();

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            item.url === "#"
              ? false
              : item.url === "/"
              ? location.pathname === "/" // exact root
              : location.pathname.startsWith(item.url);

          return (
            <SidebarMenuItem key={item.title} >
              <SidebarMenuButton asChild isActive={isActive} >
                {item.url === "#" ? (
                  <a href="#">
                    <item.icon className="size-8" />
                    <span>{item.title}</span>
                  </a>
                ) : (
                  <Link to={item.url}>
                    <item.icon  className="" />
                    <span>{item.title}</span>
                  </Link>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
