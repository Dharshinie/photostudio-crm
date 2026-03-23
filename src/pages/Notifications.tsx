import { Check, CheckCheck, Clock, Image, Mail, MessageSquare, Package, Star, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type NotificationType = "delivery" | "booking" | "message" | "review" | "upload" | "system";

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  avatar?: string;
}

const initialNotifications: Notification[] = [
  { id: 1, type: "delivery", title: "Gallery delivered to Mara Jensen", description: "248 photos from the Jensen Wedding have been sent successfully.", time: "12 min ago", read: false },
  { id: 2, type: "booking", title: "New booking request", description: "Leo Tran requested a portrait session on Apr 14 at 3:00 PM.", time: "34 min ago", read: false },
  { id: 3, type: "message", title: "Message from Ava Mitchell", description: "\"Hi! Could we reschedule the product shoot to next Thursday?\"", time: "1 hr ago", read: false },
  { id: 4, type: "review", title: "New 5-star review", description: "Iris Nakamura left a review: \"Absolutely stunning work, exceeded expectations!\"", time: "2 hr ago", read: true },
  { id: 5, type: "upload", title: "Editing complete", description: "42 headshots for Ravi Patel are ready for final review.", time: "3 hr ago", read: true },
  { id: 6, type: "system", title: "Storage limit approaching", description: "You've used 87% of your cloud storage. Consider archiving older galleries.", time: "5 hr ago", read: true },
  { id: 7, type: "delivery", title: "Download confirmation", description: "Noah Caldwell downloaded the Caldwell Gala gallery (312 photos).", time: "Yesterday", read: true },
  { id: 8, type: "booking", title: "Booking confirmed", description: "Corporate headshots with Ravi Patel confirmed for Apr 10.", time: "Yesterday", read: true },
  { id: 9, type: "message", title: "Message from Noah Caldwell", description: "\"The gala photos look incredible, thank you so much!\"", time: "2 days ago", read: true },
  { id: 10, type: "upload", title: "Batch upload finished", description: "124 product photos for Aura Skincare have been uploaded.", time: "3 days ago", read: true },
];

const typeConfig: Record<NotificationType, { icon: typeof Clock; colorClass: string }> = {
  delivery: { icon: Package, colorClass: "bg-mint-light text-mint" },
  booking: { icon: Clock, colorClass: "bg-lavender-light text-lavender" },
  message: { icon: MessageSquare, colorClass: "bg-sky-light text-sky" },
  review: { icon: Star, colorClass: "bg-peach-light text-peach" },
  upload: { icon: Upload, colorClass: "bg-lavender-light text-lavender" },
  system: { icon: Mail, colorClass: "bg-muted text-muted-foreground" },
};

const filterTabs = ["All", "Unread", "Bookings", "Deliveries", "Messages"] as const;

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState<string>("All");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const toggleRead = (id: number) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));

  const filtered = notifications.filter((n) => {
    if (activeTab === "Unread") return !n.read;
    if (activeTab === "Bookings") return n.type === "booking";
    if (activeTab === "Deliveries") return n.type === "delivery";
    if (activeTab === "Messages") return n.type === "message";
    return true;
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground" style={{ lineHeight: "1.1" }}>
            Notifications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5 text-xs">
            <CheckCheck className="h-3.5 w-3.5" /> Mark all read
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
              activeTab === tab ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {tab}
            {tab === "Unread" && unreadCount > 0 && (
              <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary-foreground/20 text-[10px]">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="card-soft p-12 text-center animate-fade-in-up" style={{ animationDelay: "160ms" }}>
            <CheckCheck className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No notifications here</p>
          </div>
        ) : (
          filtered.map((n, i) => {
            const config = typeConfig[n.type];
            const Icon = config.icon;
            return (
              <div
                key={n.id}
                onClick={() => toggleRead(n.id)}
                className={`card-soft p-4 flex items-start gap-3.5 cursor-pointer group animate-fade-in-up transition-all duration-300 hover:translate-y-[-1px] ${
                  !n.read ? "border-l-2 border-l-primary" : ""
                }`}
                style={{ animationDelay: `${(i + 2) * 60}ms` }}
              >
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${config.colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm leading-snug ${!n.read ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`}>
                      {n.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">{n.time}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">{n.description}</p>
                </div>
                {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
