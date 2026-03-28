import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  Clock3,
  IndianRupee,
  Image,
  PackageCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useData, type Project, type ProjectStatus } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const revenueData = [
  { month: "Jan", revenue: 3200 },
  { month: "Feb", revenue: 4100 },
  { month: "Mar", revenue: 3800 },
  { month: "Apr", revenue: 5200 },
  { month: "May", revenue: 4700 },
  { month: "Jun", revenue: 5900 },
  { month: "Jul", revenue: 6400 },
];

const deliveryBreakdown = [
  { name: "Editing", value: 2, color: "#7c3aed" },
  { name: "In Progress", value: 1, color: "#2563eb" },
  { name: "Exporting", value: 1, color: "#0f766e" },
  { name: "Packing", value: 1, color: "#ea580c" },
  { name: "Delivered", value: 1, color: "#16a34a" },
];

const projectStatusOptions: Array<{ value: ProjectStatus; label: string; helper: string }> = [
  { value: "editing", label: "Editing Started", helper: "Retouching and color correction" },
  { value: "in-progress", label: "In Progress", helper: "Active work in the production queue" },
  { value: "exporting", label: "Exporting", helper: "Generating final files and gallery assets" },
  { value: "packing", label: "Packing", helper: "Preparing links, folders, and delivery notes" },
  { value: "delivered", label: "Delivered", helper: "Client-ready and sent" },
];

const statusUi: Record<ProjectStatus, { label: string; badge: string; dot: string }> = {
  editing: {
    label: "Editing",
    badge: "border-violet-200 bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
  },
  "in-progress": {
    label: "In Progress",
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },
  exporting: {
    label: "Exporting",
    badge: "border-teal-200 bg-teal-50 text-teal-700",
    dot: "bg-teal-500",
  },
  packing: {
    label: "Packing",
    badge: "border-orange-200 bg-orange-50 text-orange-700",
    dot: "bg-orange-500",
  },
  delivered: {
    label: "Delivered",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
};

const priorityUi = {
  High: "bg-rose-50 text-rose-700 border-rose-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { clients, bookings, projects, albums, updateProjectStatus } = useData();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const totalRevenue = bookings.reduce((sum, booking) => sum + parseInt(booking.amount.replace(/[^\d]/g, ""), 10), 0);
  const activeClients = clients.filter((client) => client.status === "active").length;
  const pendingDeliveries = projects.filter((project) => project.status !== "delivered").length;
  const recentProjects = projects.slice(0, 4);
  const pendingProjects = projects.filter((project) => project.status !== "delivered");
  const albumReviewQueue = albums.filter((album) => album.selectedPhotoIds.length > 0 || album.status === "editing");

  const averageCompletion = useMemo(() => {
    if (!projects.length) {
      return 0;
    }
    return Math.round(projects.reduce((sum, project) => sum + project.completion, 0) / projects.length);
  }, [projects]);

  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length.toString(),
      meta: "+12% vs last month",
      icon: CalendarDays,
      accent: "from-violet-100 via-white to-violet-50",
      iconWrap: "bg-violet-600",
    },
    {
      label: "Revenue",
      value: `Rs.${totalRevenue.toLocaleString()}`,
      meta: "Premium sessions driving growth",
      icon: IndianRupee,
      accent: "from-emerald-100 via-white to-emerald-50",
      iconWrap: "bg-emerald-600",
    },
    {
      label: "Active Clients",
      value: activeClients.toString(),
      meta: "High-retention client relationships",
      icon: Users,
      accent: "from-sky-100 via-white to-sky-50",
      iconWrap: "bg-slate-900",
    },
    {
      label: "Pending Deliveries",
      value: pendingDeliveries.toString(),
      meta: `${averageCompletion}% average completion`,
      icon: PackageCheck,
      accent: "from-orange-100 via-white to-orange-50",
      iconWrap: "bg-orange-500",
    },
    {
      label: "Album Picks",
      value: albumReviewQueue.reduce((sum, album) => sum + album.selectedPhotoIds.length, 0).toString(),
      meta: "Selections synced from client albums",
      icon: Image,
      accent: "from-cyan-100 via-white to-sky-50",
      iconWrap: "bg-cyan-500",
    },
  ];

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-4">
        <section className="glass overflow-hidden rounded-[2rem] border border-white/70 px-6 py-7 shadow-xl">
          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr] xl:items-center">
            <div className="space-y-3">
              <Badge className="w-fit border-0 bg-violet-100 px-4 py-1 text-violet-700 hover:bg-violet-100">
                Studio Analytics
              </Badge>
              <div className="space-y-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 md:text-4xl">
                  Production dashboard for bookings, revenue, and active projects
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                  Track studio performance, monitor pending work, and update delivery statuses without leaving the dashboard.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <HeroMetric label="Projects in Queue" value={`${pendingProjects.length}`} helper="Open production tasks" />
              <HeroMetric label="Delivered This Cycle" value={`${projects.filter((project) => project.status === "delivered").length}`} helper="Completed and shared" />
              <HeroMetric label="Avg Completion" value={`${averageCompletion}%`} helper="Across active projects" />
            </div>
          </div>
        </section>

        <section className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          {stats.map((item) => (
            <div
              key={item.label}
              className={`flex h-full min-h-[210px] flex-col items-start overflow-hidden rounded-[1.8rem] border border-white/70 bg-gradient-to-br ${item.accent} p-5 shadow-lg shadow-slate-200/50`}
            >
              <div className="flex h-full w-full flex-col items-start">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                  <p className="text-3xl font-bold tracking-tight text-slate-800 sm:text-[2.1rem]">{item.value}</p>
                  <p className="max-w-[16rem] text-sm leading-7 text-slate-500">{item.meta}</p>
                </div>
                <div className={`mt-auto flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.35rem] text-white shadow-md ${item.iconWrap}`}>
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="grid items-start gap-3 xl:grid-cols-[1.7fr_1fr]">
          <div className="space-y-3">
            <div className="card-soft rounded-[1.75rem] p-4 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Revenue Overview</h2>
                  <p className="mt-1 text-sm text-slate-500">Monthly studio revenue performance.</p>
                </div>
                <Badge className="border-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  +18.2%
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={revenueData} barCategoryGap={18}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={(value) => `Rs.${value / 1000}k`} />
                  <Tooltip
                    cursor={{ fill: "rgba(99, 102, 241, 0.06)" }}
                    contentStyle={{
                      borderRadius: "18px",
                      border: "1px solid rgba(226, 232, 240, 1)",
                      boxShadow: "0 20px 45px -20px rgba(15, 23, 42, 0.25)",
                    }}
                    formatter={(value: number) => [`Rs.${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Bar dataKey="revenue" radius={[12, 12, 0, 0]} fill="url(#revenueGradient)" />
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card-soft rounded-[1.75rem] p-4 shadow-xl">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Recent Projects</h2>
                  <p className="mt-1 text-sm text-slate-500">Quickly jump into active client work.</p>
                </div>
                <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
                  {recentProjects.length} active cards
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {recentProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onQuickUpdate={() => setSelectedProject(project)}
                    onOpenProject={() => navigate(`/projects/${project.id}`)}
                  />
                ))}
              </div>
            </div>

            <div className="card-soft rounded-[1.75rem] p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Album Review Queue</h2>
                  <p className="mt-1 text-sm text-slate-500">Client-selected images that are ready for admin review and editing.</p>
                </div>
                <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
                  {albumReviewQueue.length} albums
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-2">
                {albumReviewQueue.length ? albumReviewQueue.map((album) => (
                  <div key={album.recordId || album.albumId} className="flex h-full flex-col rounded-[1.4rem] border border-slate-200/80 bg-white/85 p-4 shadow-sm sm:p-5 lg:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-bold text-slate-800">{album.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{album.clientName}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0 border-cyan-200 bg-cyan-50 text-cyan-700">
                        {album.status}
                      </Badge>
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-2 xl:grid-cols-3 2xl:grid-cols-3">
                      <AlbumMetric label="Album ID" value={album.albumId} />
                      <AlbumMetric label="Passcode" value={album.passcode} />
                      <AlbumMetric label="Picks" value={String(album.selectedPhotoIds.length)} />
                    </div>
                    <div className="mt-4 px-1 text-sm leading-6 text-slate-500">
                      {album.selectedPhotoIds.length
                        ? `${album.selectedPhotoIds.length} images selected by client. Open Gallery to review and start editing.`
                        : "Waiting for client selections."}
                    </div>
                    <div className="mt-auto pt-4">
                      <Button variant="outline" onClick={() => navigate("/gallery")} className="w-full">
                        Open Gallery Review
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="rounded-[1.4rem] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                    No album selections yet. Once a client opens an album and picks photos, they will appear here automatically.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="card-soft rounded-[1.75rem] p-4 shadow-xl">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-800">Delivery Pipeline</h2>
                <p className="mt-1 text-sm text-slate-500">Current project status distribution.</p>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={deliveryBreakdown} dataKey="value" nameKey="name" innerRadius={70} outerRadius={96} stroke="none" paddingAngle={4}>
                    {deliveryBreakdown.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "18px",
                      border: "1px solid rgba(226, 232, 240, 1)",
                      boxShadow: "0 20px 45px -20px rgba(15, 23, 42, 0.25)",
                    }}
                    formatter={(value: number, name: string) => [value, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid gap-2.5">
                {deliveryBreakdown.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-sm font-medium text-slate-700">{entry.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-500">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-soft rounded-[1.75rem] p-4 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Pending Work</h2>
                  <p className="mt-1 text-sm text-slate-500">Priority queue for studio delivery.</p>
                </div>
                <CircleDashed className="h-5 w-5 text-slate-400" />
              </div>
              <div className="space-y-3">
                {pendingProjects.map((project) => (
                  <div key={project.id} className="rounded-[1.4rem] border border-slate-200/80 bg-white/80 p-4 shadow-sm">
                    <div className="flex h-full flex-col justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{project.clientName}</p>
                        <p className="mt-1 text-sm text-slate-500">{project.projectName}</p>
                      </div>
                      <Badge variant="outline" className={priorityUi[project.priority]}>
                        {project.priority}
                      </Badge>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                        <span>{statusUi[project.status].label}</span>
                        <span>{project.completion}%</span>
                      </div>
                      <Progress value={project.completion} className="h-2 bg-slate-200" />
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <span>Due {project.dueDate}</span>
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="font-semibold text-violet-600 transition-colors hover:text-violet-500"
                      >
                        Quick Update
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Dialog open={Boolean(selectedProject)} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-lg rounded-[1.75rem] border-white/70 bg-white/95 p-0 shadow-2xl">
          {selectedProject && (
            <div className="overflow-hidden rounded-[1.75rem]">
              <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 px-6 py-6 text-white">
                <DialogHeader className="text-left">
                  <DialogTitle className="text-2xl font-bold">{selectedProject.projectName}</DialogTitle>
                  <DialogDescription className="text-violet-100">
                    Update the live production status for {selectedProject.clientName} without leaving the dashboard.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="space-y-5 p-6">
                <div className="rounded-[1.25rem] bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{selectedProject.clientName}</p>
                      <p className="mt-1 text-sm text-slate-500">{selectedProject.projectType}</p>
                    </div>
                    <Badge variant="outline" className={statusUi[selectedProject.status].badge}>
                      {statusUi[selectedProject.status].label}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  {projectStatusOptions.map((option) => {
                    const active = selectedProject.status === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          updateProjectStatus(selectedProject.id, option.value);
                          setSelectedProject(null);
                        }}
                        className={`w-full rounded-[1.25rem] border px-4 py-4 text-left transition-all ${
                          active
                            ? "border-violet-300 bg-violet-50 shadow-sm"
                            : "border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/60"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{option.label}</p>
                            <p className="mt-1 text-sm text-slate-500">{option.helper}</p>
                          </div>
                          {active ? <CheckCircle2 className="h-5 w-5 text-violet-600" /> : <Clock3 className="h-5 w-5 text-slate-300" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function AlbumMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-[108px] min-w-0 flex-col rounded-[1rem] border border-slate-200/70 bg-slate-50 px-3 py-3 text-center sm:min-h-[116px] sm:px-4">
      <p className="text-[10px] font-semibold uppercase leading-4 tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <div className="mt-3 flex min-h-0 flex-1 items-center justify-center">
        <p className="max-w-full break-words text-[1.05rem] font-bold leading-8 tracking-tight text-slate-800">
        {value}
        </p>
      </div>
    </div>
  );
}

function HeroMetric({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/70 bg-white/75 p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{helper}</p>
    </div>
  );
}

function ProjectCard({
  project,
  onQuickUpdate,
  onOpenProject,
}: {
  project: Project;
  onQuickUpdate: () => void;
  onOpenProject: () => void;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/85 p-5 shadow-md shadow-slate-200/40">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-bold text-slate-800">{project.clientName}</p>
          <p className="mt-1 text-sm text-slate-500">{project.projectName}</p>
        </div>
        <Badge variant="outline" className={statusUi[project.status].badge}>
          <span className={`mr-2 inline-block h-2 w-2 rounded-full ${statusUi[project.status].dot}`} />
          {statusUi[project.status].label}
        </Badge>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>{project.projectType}</span>
          <span>Due {project.dueDate}</span>
        </div>
        <Progress value={project.completion} className="h-2 bg-slate-200" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">{project.deliverables}</span>
          <span className="font-semibold text-slate-700">{project.completion}%</span>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          onClick={onOpenProject}
          className="h-11 rounded-full bg-slate-900 px-5 text-white shadow-md hover:bg-slate-800"
        >
          Open Project
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={onQuickUpdate}
          className="h-11 rounded-full border-slate-200 bg-white px-5 text-slate-700 hover:bg-slate-50"
        >
          <Sparkles className="mr-2 h-4 w-4 text-violet-500" />
          Quick Update
        </Button>
      </div>
    </div>
  );
}
