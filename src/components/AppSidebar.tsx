import {
  Camera,
  LayoutDashboard,
  CalendarDays,
  Users,
  Image,
  Bell,
  HardDrive,
  Settings,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Bookings", url: "/bookings", icon: CalendarDays },
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Gallery", url: "/gallery", icon: Image },
];

const secondaryItems = [
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Storage Limit", url: "/storage", icon: HardDrive },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/30 bg-white/40 backdrop-blur-xl max-md:border-slate-200 max-md:bg-white max-md:text-black max-md:backdrop-blur-none"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Camera className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-base font-semibold tracking-tight text-foreground max-md:text-black">
              StudioCRM
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-widest text-muted-foreground/70 max-md:text-black/70">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-accent hover:text-accent-foreground max-md:text-black max-md:hover:bg-slate-100 max-md:hover:text-black"
                      activeClassName="bg-accent text-accent-foreground font-medium max-md:bg-slate-100 max-md:text-black"
                    >
                      <item.icon className="mr-3 h-[18px] w-[18px]" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-widest text-muted-foreground/70 max-md:text-black/70">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-accent hover:text-accent-foreground max-md:text-black max-md:hover:bg-slate-100 max-md:hover:text-black"
                      activeClassName="bg-accent text-accent-foreground font-medium max-md:bg-slate-100 max-md:text-black"
                    >
                      <item.icon className="mr-3 h-[18px] w-[18px]" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
