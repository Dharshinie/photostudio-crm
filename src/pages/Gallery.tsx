import { Download, Eye, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const galleries = [
  { id: 1, title: "Jensen Wedding", client: "Mara Jensen", photos: 248, date: "Mar 28", status: "delivered", cover: "hsl(262, 52%, 88%)" },
  { id: 2, title: "Corporate Headshots", client: "Ravi Patel", photos: 42, date: "Apr 10", status: "editing", cover: "hsl(210, 70%, 88%)" },
  { id: 3, title: "Spring Family Portraits", client: "Iris Nakamura", photos: 86, date: "Apr 8", status: "delivered", cover: "hsl(162, 48%, 85%)" },
  { id: 4, title: "Product Launch — Aura Skincare", client: "Ava Mitchell", photos: 124, date: "Apr 2", status: "review", cover: "hsl(18, 85%, 88%)" },
  { id: 5, title: "Engagement Session", client: "Leo Tran", photos: 64, date: "Mar 30", status: "editing", cover: "hsl(262, 40%, 90%)" },
  { id: 6, title: "Caldwell Gala", client: "Noah Caldwell", photos: 312, date: "Apr 5", status: "delivered", cover: "hsl(210, 60%, 90%)" },
];

const statusColors: Record<string, string> = {
  delivered: "bg-mint-light text-mint",
  editing: "bg-peach-light text-peach",
  review: "bg-sky-light text-sky",
};

export default function Gallery() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground" style={{ lineHeight: "1.1" }}>Gallery</h1>
          <p className="mt-1 text-sm text-muted-foreground">Photo deliveries and session galleries.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className={view === "grid" ? "bg-accent" : ""} onClick={() => setView("grid")}>
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className={view === "list" ? "bg-accent" : ""} onClick={() => setView("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={`grid gap-4 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
        {galleries.map((g, i) => (
          <div
            key={g.id}
            className="card-soft overflow-hidden animate-fade-in-up group"
            style={{ animationDelay: `${(i + 1) * 80}ms` }}
          >
            <div
              className="h-40 w-full relative flex items-center justify-center"
              style={{ backgroundColor: g.cover }}
            >
              <span className="text-4xl font-bold opacity-20">{g.photos}</span>
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-foreground/10">
                <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                  <Eye className="h-3.5 w-3.5" /> Preview
                </Button>
                <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                  <Download className="h-3.5 w-3.5" /> Download
                </Button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground truncate">{g.title}</h3>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${statusColors[g.status]}`}>
                  {g.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{g.client} · {g.photos} photos · {g.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
