import { CalendarDays, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const bookings = [
  { id: 1, client: "Mara Jensen", type: "Wedding", date: "Mar 28, 2026", time: "10:00 AM", location: "Riverside Gardens", status: "confirmed", amount: "$2,400" },
  { id: 2, client: "Leo Tran", type: "Portrait Session", date: "Mar 30, 2026", time: "2:00 PM", location: "Studio A", status: "pending", amount: "$350" },
  { id: 3, client: "Ava Mitchell", type: "Product Shoot", date: "Apr 2, 2026", time: "9:00 AM", location: "Studio B", status: "confirmed", amount: "$800" },
  { id: 4, client: "Noah Caldwell", type: "Corporate Event", date: "Apr 5, 2026", time: "6:00 PM", location: "Grand Ballroom", status: "pending", amount: "$1,600" },
  { id: 5, client: "Iris Nakamura", type: "Family Portrait", date: "Apr 8, 2026", time: "11:00 AM", location: "Maple Park", status: "completed", amount: "$450" },
  { id: 6, client: "Ravi Patel", type: "Headshots", date: "Apr 10, 2026", time: "3:00 PM", location: "Studio A", status: "confirmed", amount: "$275" },
];

const statusColors: Record<string, string> = {
  confirmed: "bg-mint-light text-mint",
  pending: "bg-peach-light text-peach",
  completed: "bg-lavender-light text-lavender",
};

export default function Bookings() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground" style={{ lineHeight: "1.1" }}>Bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your photo sessions and appointments.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Booking
        </Button>
      </div>

      <div className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
        <Button variant="outline" size="sm" className="gap-2 text-xs">
          <Filter className="h-3.5 w-3.5" /> Filter
        </Button>
        {["All", "Pending", "Confirmed", "Completed"].map((f) => (
          <button
            key={f}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
              f === "All" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="card-soft overflow-hidden animate-fade-in-up" style={{ animationDelay: "160ms" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/40">
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Client</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Type</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Location</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground shrink-0">
                      {b.client.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="font-medium text-foreground">{b.client}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-muted-foreground hidden md:table-cell">{b.type}</td>
                <td className="py-3.5 px-4 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {b.date}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-muted-foreground hidden lg:table-cell">{b.location}</td>
                <td className="py-3.5 px-4 font-medium text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>{b.amount}</td>
                <td className="py-3.5 px-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[b.status]}`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
