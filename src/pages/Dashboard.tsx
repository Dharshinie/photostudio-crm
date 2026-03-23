import { Camera, CalendarDays, Users, DollarSign, Package, TrendingUp, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const stats = [
  { label: "Total Bookings", value: "148", change: "+12%", icon: CalendarDays, colorClass: "stat-lavender", iconColor: "text-lavender" },
  { label: "Revenue", value: "$24,580", change: "+8.3%", icon: DollarSign, colorClass: "stat-mint", iconColor: "text-mint" },
  { label: "Active Clients", value: "67", change: "+5", icon: Users, colorClass: "stat-sky", iconColor: "text-sky" },
  { label: "Pending Deliveries", value: "12", change: "-3", icon: Package, colorClass: "stat-peach", iconColor: "text-peach" },
];

const revenueData = [
  { month: "Jan", revenue: 3200 },
  { month: "Feb", revenue: 4100 },
  { month: "Mar", revenue: 3800 },
  { month: "Apr", revenue: 5200 },
  { month: "May", revenue: 4700 },
  { month: "Jun", revenue: 5900 },
  { month: "Jul", revenue: 6400 },
];

const bookingsData = [
  { month: "Jan", bookings: 18 },
  { month: "Feb", bookings: 24 },
  { month: "Mar", bookings: 20 },
  { month: "Apr", bookings: 28 },
  { month: "May", bookings: 22 },
  { month: "Jun", bookings: 31 },
  { month: "Jul", bookings: 26 },
];

const sessionTypes = [
  { name: "Portraits", value: 38, color: "hsl(262, 52%, 58%)" },
  { name: "Weddings", value: 24, color: "hsl(162, 48%, 48%)" },
  { name: "Events", value: 20, color: "hsl(210, 70%, 58%)" },
  { name: "Product", value: 18, color: "hsl(18, 85%, 65%)" },
];

const recentBookings = [
  { client: "Mara Jensen", type: "Wedding", date: "Mar 28", status: "confirmed" },
  { client: "Leo Tran", type: "Portrait", date: "Mar 30", status: "pending" },
  { client: "Ava Mitchell", type: "Product", date: "Apr 2", status: "confirmed" },
  { client: "Noah Caldwell", type: "Event", date: "Apr 5", status: "pending" },
  { client: "Iris Nakamura", type: "Portrait", date: "Apr 8", status: "completed" },
];

const statusColors: Record<string, string> = {
  confirmed: "bg-mint-light text-mint",
  pending: "bg-peach-light text-peach",
  completed: "bg-lavender-light text-lavender",
};

export default function Dashboard() {
  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight text-foreground" style={{ lineHeight: "1.1" }}>
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome back, here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`card-soft p-5 ${s.colorClass} animate-fade-in-up`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</p>
                <p className="mt-2 text-2xl font-bold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {s.value}
                </p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.iconColor} bg-card`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-mint">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {s.change} <span className="text-muted-foreground font-normal">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="card-soft p-5 lg:col-span-2 animate-fade-in-up" style={{ animationDelay: "320ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Revenue Overview</h2>
            <span className="flex items-center gap-1 text-xs text-mint font-medium">
              <TrendingUp className="h-3.5 w-3.5" /> +18.2%
            </span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,14%,90%)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(240,8%,52%)" axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(240,8%,52%)" axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid hsl(240,14%,90%)", boxShadow: "0 4px 14px hsl(240 20% 16% / 0.08)" }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="hsl(262, 52%, 58%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Session types donut */}
        <div className="card-soft p-5 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <h2 className="text-sm font-semibold text-foreground mb-4">Session Types</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={sessionTypes} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none">
                {sessionTypes.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid hsl(240,14%,90%)" }}
                formatter={(value: number, name: string) => [`${value}%`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {sessionTypes.map((t) => (
              <div key={t.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                {t.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Bookings trend */}
        <div className="card-soft p-5 lg:col-span-2 animate-fade-in-up" style={{ animationDelay: "480ms" }}>
          <h2 className="text-sm font-semibold text-foreground mb-4">Booking Trends</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={bookingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,14%,90%)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(240,8%,52%)" axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(240,8%,52%)" axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(240,14%,90%)" }} />
              <Line type="monotone" dataKey="bookings" stroke="hsl(210, 70%, 58%)" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(210, 70%, 58%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent bookings */}
        <div className="card-soft p-5 lg:col-span-3 animate-fade-in-up" style={{ animationDelay: "560ms" }}>
          <h2 className="text-sm font-semibold text-foreground mb-4">Recent Bookings</h2>
          <div className="space-y-3">
            {recentBookings.map((b) => (
              <div key={b.client} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground">
                    {b.client.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{b.client}</p>
                    <p className="text-xs text-muted-foreground">{b.type} · {b.date}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[b.status]}`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
