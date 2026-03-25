import { CalendarDays, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewBookingDialog } from "@/components/NewBookingDialog";
import { useData } from "@/contexts/DataContext";

const statusColors: Record<string, string> = {
  confirmed: "bg-mint-light text-mint",
  pending: "bg-peach-light text-peach",
  completed: "bg-lavender-light text-lavender",
};

export default function Bookings() {
  const { bookings } = useData();
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground" style={{ lineHeight: "1.1" }}>Bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your photo sessions and appointments.</p>
        </div>
        <NewBookingDialog />
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
