import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "../../components/ui/sidebar"

const teams = [
    {
        name: "Service Station",
        logo: "SS",
    },
]

export function TeamSwitcher() {
    const { isMobile } = useSidebar()

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg font-semibold">
                            {teams[0].logo}
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{teams[0].name}</span>
                        </div>
                    </SidebarMenuButton>
        </SidebarMenuItem>
    )
}
