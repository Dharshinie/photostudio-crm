import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, ChevronDown, LogOut, Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const quickNotifications = [
  { id: 1, title: "Gallery delivered to Mara Jensen", time: "12 min ago", unread: true },
  { id: 2, title: "New booking request from Leo Tran", time: "34 min ago", unread: true },
  { id: 3, title: "Message from Ava Mitchell", time: "1 hr ago", unread: true },
  { id: 4, title: "New 5-star review from Iris Nakamura", time: "2 hr ago", unread: false },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = quickNotifications.filter((n) => n.unread).length;
  const { logout } = useAuth();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full overflow-visible">
        <AppSidebar />
        <div className="relative z-0 flex min-w-0 flex-1 flex-col overflow-visible">
          <header className="relative z-[90] h-16 flex items-center justify-between border-b border-white/30 px-6 glass overflow-visible">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1" />
              <div className="hidden sm:flex items-center gap-2 rounded-xl bg-white/40 backdrop-blur-sm border border-white/50 px-3 py-2 text-sm text-muted-foreground">
                <Search className="h-4 w-4" />
                <span>Search…</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative z-[95]" ref={notifRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                >
                  <Bell className="h-[18px] w-[18px]" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-peach text-[9px] font-bold text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>

                {showNotifications && (
                  <div className="absolute right-0 top-12 z-[110] w-80 rounded-2xl border border-white/40 p-1 shadow-lg glass animate-fade-in-up">
                    <div className="px-3 py-2.5 flex items-center justify-between border-b border-border/30">
                      <p className="text-sm font-semibold text-foreground">Notifications</p>
                      <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    </div>
                    <div className="py-1">
                      {quickNotifications.map((n) => (
                        <button
                          key={n.id}
                          className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-accent/60 transition-colors flex items-start gap-2.5"
                        >
                          {n.unread && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                          {!n.unread && <span className="h-2 w-2 shrink-0 mt-1.5" />}
                          <div className="min-w-0">
                            <p className={`text-xs leading-snug ${n.unread ? "font-semibold text-foreground" : "text-foreground/70"}`}>
                              {n.title}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-border/30 px-3 py-2">
                      <button
                        onClick={() => { navigate("/notifications"); setShowNotifications(false); }}
                        className="w-full text-center text-xs font-medium text-primary hover:underline"
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="relative z-[95]" ref={profileRef}>
                <button
                  onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-accent/60 transition-colors"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-sm font-bold text-white shadow-md">
                    A
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-foreground leading-tight">Admin</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">Administrator</p>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden md:block" />
                </button>

                {showProfile && (
                  <div className="absolute right-0 top-14 z-[120] w-72 rounded-2xl border border-white/40 p-2 shadow-xl glass animate-fade-in-up">
                    <div className="px-4 py-4 border-b border-border/30">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-lg font-bold text-white shadow-md">
                          A
                        </div>
                        <div>
                          <p className="text-base font-bold text-foreground">Admin</p>
                          <p className="text-xs text-muted-foreground">admin@studiocrm.com</p>
                          <span className="inline-block mt-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Administrator</span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1.5">
                      <button
                        onClick={() => { navigate("/settings"); setShowProfile(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-accent/60 transition-colors"
                      >
                        <User className="h-4 w-4 text-muted-foreground" /> My Profile
                      </button>
                      <button
                        onClick={() => { navigate("/settings"); setShowProfile(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-accent/60 transition-colors"
                      >
                        <Settings className="h-4 w-4 text-muted-foreground" /> Settings
                      </button>
                    </div>
                    <div className="border-t border-border/30 py-1.5">
                      <button
                        onClick={() => {
                          logout();
                          navigate("/login");
                          setShowProfile(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
          <main className="relative z-0 flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
