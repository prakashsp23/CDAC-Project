import { BarChart3, FileText, Inbox, Users, User, Table, Package } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../components/ui/sidebar";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const navItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: BarChart3,
    allowedRoles: ["ADMIN"],
  },
  { title: "Mechanics", url: "/admin/mechanics", icon: Users, allowedRoles: ["ADMIN"] },
  {
    title: "Parts",
    url: "/admin/parts",
    icon: Package,
    allowedRoles: ["ADMIN"],
  },
  {
    title: "Service Requests",
    url: "/admin/service-requests",
    icon: FileText,
    allowedRoles: ["ADMIN"],
  },
  { title: "Feedback", url: "/admin/feedback", icon: Inbox, allowedRoles: ["ADMIN"] },
  {
    title: "Dashboard",
    url: "/mechanic",
    icon: BarChart3,
    allowedRoles: ["MECHANIC"],
  },
  { title: "Work History", url: "/mechanic/work-history", icon: Table, allowedRoles: ["MECHANIC"] },
  { title: "Assigned Jobs", url: "/mechanic/assigned-jobs", icon: Users, allowedRoles: ["MECHANIC"] },
  {
    title: "Dashboard",
    url: "/customers",
    icon: BarChart3,
    allowedRoles: ["CUSTOMER"],
  },
  { title: "Customer Table", url: "/customers/table", icon: Table, allowedRoles: ["CUSTOMER"] },
  { title: "My Services", url: "/customers/myservices", icon: Users, allowedRoles: ["CUSTOMER"] },
  { title: "All Services", url: "/customers/allservices", icon: Users, allowedRoles: ["CUSTOMER"] },
  { title: "My Vehicle", url: "/customers/vehicles", icon: User, allowedRoles: ["CUSTOMER"] },
  { title: "Feedback", url: "/customers/feedback", icon: BarChart3, allowedRoles: ["CUSTOMER"] },
];

export function NavMain() {
  const location = useLocation();
  const userRole = useSelector((state) => state.auth.role);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navItems
          .filter((item) => item.allowedRoles.includes(userRole))
          .map((item) => {
            // More precise active check - only match exact path or ensure it's truly a parent path
            const isActive =
              item.url === "#"
                ? false
                : item.url === "/"
                  ? location.pathname === "/"
                  : location.pathname === item.url;

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
                    {item.children
                      .filter((child) => child.allowedRoles.includes(userRole))
                      .map((child) => {
                        const childActive =
                          child.url === "#"
                            ? false
                            : location.pathname === child.url ||
                            location.pathname.startsWith(child.url + "/");
                        return (
                          <SidebarMenuItem key={child.title + child.url}>
                            <SidebarMenuButton asChild isActive={childActive}>
                              <Link
                                to={child.url}
                                className="flex items-center gap-2 text-sm"
                              >
                                <child.icon className="size-6" />
                                <span>{child.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
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
