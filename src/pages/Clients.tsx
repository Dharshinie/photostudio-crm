import { Mail, Phone, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const clients = [
  { name: "Mara Jensen", email: "mara@email.com", phone: "+1 (415) 234-8901", sessions: 6, totalSpent: "$4,200", lastSession: "Mar 28", status: "active" },
  { name: "Leo Tran", email: "leo.tran@email.com", phone: "+1 (628) 555-0147", sessions: 3, totalSpent: "$1,050", lastSession: "Mar 15", status: "active" },
  { name: "Ava Mitchell", email: "ava.m@email.com", phone: "+1 (510) 982-3344", sessions: 8, totalSpent: "$6,400", lastSession: "Mar 20", status: "active" },
  { name: "Noah Caldwell", email: "noah.c@email.com", phone: "+1 (650) 771-2280", sessions: 2, totalSpent: "$3,200", lastSession: "Feb 14", status: "inactive" },
  { name: "Iris Nakamura", email: "iris.n@email.com", phone: "+1 (408) 643-9912", sessions: 5, totalSpent: "$2,250", lastSession: "Apr 8", status: "active" },
  { name: "Ravi Patel", email: "ravi.p@email.com", phone: "+1 (925) 338-5567", sessions: 1, totalSpent: "$275", lastSession: "Apr 10", status: "new" },
];

const statusColors: Record<string, string> = {
  active: "bg-mint-light text-mint",
  inactive: "bg-muted text-muted-foreground",
  new: "bg-sky-light text-sky",
};

const avatarColors = [
  "bg-lavender-light text-lavender",
  "bg-mint-light text-mint",
  "bg-peach-light text-peach",
  "bg-sky-light text-sky",
];

export default function Clients() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground" style={{ lineHeight: "1.1" }}>Clients</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your client directory and session history.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      <div className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground flex-1 max-w-xs">
          <Search className="h-4 w-4" />
          <input className="bg-transparent outline-none w-full placeholder:text-muted-foreground" placeholder="Search clients…" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {clients.map((c, i) => (
          <div
            key={c.name}
            className="card-soft p-5 animate-fade-in-up hover:translate-y-[-2px] transition-all duration-300"
            style={{ animationDelay: `${(i + 2) * 80}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className={`h-11 w-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                {c.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground truncate">{c.name}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${statusColors[c.status]}`}>
                    {c.status}
                  </span>
                </div>
                <div className="mt-1.5 space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                    <Mail className="h-3 w-3 shrink-0" /> {c.email}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Phone className="h-3 w-3 shrink-0" /> {c.phone}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border/40 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>{c.sessions}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Sessions</p>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>{c.totalSpent}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Spent</p>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>{c.lastSession}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Last</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
