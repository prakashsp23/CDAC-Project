import {  BarChart3, FileText, Inbox, Users, User, Table } from "lucide-react"
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
    children: [
      { title: "Mechanics", url: "/admin/mechanics", icon: Users },
      {
        title: "Service Requests",
        url: "/admin/service-requests",
        icon: FileText,
      },
      { title: "Feedback", url: "/admin/feedback", icon: Inbox },
    ],
  },
  {
    title: "Mechanic Page",
    url: "/mechanic",
    icon: FileText,
    children: [
      { title: "Work History", url: "/mechanic/work-history", icon: Table },
    ],
  },
  {
    title: "Customer Page",
    url: "/customers",
    icon: Users,
    // add sub-links here
    children: [
      { title: "Customer Table", url: "/customers/table", icon: Table },
      { title: "My Services", url: "/customers/myservices", icon: Users },
      { title: "All Services", url: "/customers/allservices", icon: Users },
      { title: "My Vehicle", url: "/customers/vehicles", icon: User },
      { title: "Feedback", url: "/customers/feedback", icon: BarChart3 },
    ],
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
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive}>
              {item.url === "#" ? (
                <a href="#">
                <item.icon className="size-8" />
                <span>{item.title}</span>
                </a>
              ) : (
                <Link to={item.url}>
                <item.icon className="" />
                <span>{item.title}</span>
                </Link>
              
              )}
              </SidebarMenuButton>
              {item.children && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children.map((child) => {
                    const childActive = child.url === "#" ? false : location.pathname === child.url || location.pathname.startsWith(child.url)
                    return (
                      <SidebarMenuItem key={child.title + child.url}>
                        <SidebarMenuButton asChild isActive={childActive}>
                          <Link to={child.url} className="flex items-center gap-2 text-sm">
                            <child.icon className="size-6" />
                            <span>{child.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </div>
              )}
            </SidebarMenuItem>
            );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
