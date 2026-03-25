import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Download,
  FolderKanban,
  PackageCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useData, type ProjectStatus, type ProjectTimelineStep } from "@/contexts/DataContext";

const statusUi: Record<ProjectStatus, { label: string; badge: string }> = {
  editing: { label: "Editing", badge: "border-violet-200 bg-violet-50 text-violet-700" },
  "in-progress": { label: "In Progress", badge: "border-blue-200 bg-blue-50 text-blue-700" },
  exporting: { label: "Exporting", badge: "border-teal-200 bg-teal-50 text-teal-700" },
  packing: { label: "Packing", badge: "border-orange-200 bg-orange-50 text-orange-700" },
  delivered: { label: "Delivered", badge: "border-emerald-200 bg-emerald-50 text-emerald-700" },
};

export default function ProjectDetails() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { projects } = useData();

  const project = projects.find((item) => item.id === Number(projectId));

  const currentStep = useMemo(
    () => project?.timeline.find((step) => step.status === "current") ?? project?.timeline[project.timeline.length - 1],
    [project],
  );

  if (!project) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center text-center">
        <FolderKanban className="h-12 w-12 text-slate-300" />
        <h1 className="mt-4 text-2xl font-bold text-slate-800">Project not found</h1>
        <p className="mt-2 text-slate-500">The project may have been removed or the link is incorrect.</p>
        <Button onClick={() => navigate("/")} className="mt-6 rounded-full bg-slate-900 text-white hover:bg-slate-800">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="glass overflow-hidden rounded-[2rem] border border-white/70 px-6 py-7 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700">
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">{project.projectName}</h1>
                <Badge variant="outline" className={statusUi[project.status].badge}>
                  {statusUi[project.status].label}
                </Badge>
              </div>
              <p className="mt-2 text-base text-slate-500">
                {project.clientName} • {project.projectType}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <DetailStat label="Due Date" value={project.dueDate} icon={CalendarDays} />
            <DetailStat label="Completion" value={`${project.completion}%`} icon={Sparkles} />
            <DetailStat label="Deliverables" value={project.deliverables.split(",")[0]} icon={PackageCheck} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
        <div className="card-soft rounded-[1.75rem] p-6 shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Project Tracking</h2>
              <p className="mt-1 text-sm text-slate-500">
                Amazon-style production tracking with clear statuses, timestamps, and handoff progress.
              </p>
            </div>
            <div className="min-w-[180px]">
              <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-500">
                <span>Overall Progress</span>
                <span>{project.completion}%</span>
              </div>
              <Progress value={project.completion} className="h-2.5 bg-slate-200" />
            </div>
          </div>

          <div className="mt-8 space-y-0">
            {project.timeline.map((step, index) => (
              <TimelineStepCard
                key={step.id}
                step={step}
                isLast={index === project.timeline.length - 1}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-soft rounded-[1.75rem] p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-800">Current Update</h2>
            <div className="mt-4 rounded-[1.4rem] bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-700">{currentStep?.label}</p>
              <p className="mt-2 text-sm leading-7 text-slate-500">{currentStep?.description}</p>
              <p className="mt-3 text-sm font-medium text-violet-600">{currentStep?.time}</p>
            </div>
          </div>

          <div className="card-soft rounded-[1.75rem] p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-800">Project Summary</h2>
            <div className="mt-5 space-y-4">
              <SummaryRow label="Client" value={project.clientName} />
              <SummaryRow label="Project Type" value={project.projectType} />
              <SummaryRow label="Status" value={statusUi[project.status].label} />
              <SummaryRow label="Priority" value={project.priority} />
              <SummaryRow label="Deliverables" value={project.deliverables} />
            </div>
          </div>

          <div className="card-soft rounded-[1.75rem] p-6 shadow-xl">
            <h2 className="text-lg font-bold text-slate-800">Internal Notes</h2>
            <p className="mt-4 text-sm leading-7 text-slate-500">{project.notes}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-800">
                <Download className="mr-2 h-4 w-4" />
                Export Summary
              </Button>
              <Button variant="outline" className="rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
                <Truck className="mr-2 h-4 w-4" />
                Delivery Notes
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DetailStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof CalendarDays;
}) {
  return (
    <div className="rounded-[1.4rem] border border-white/70 bg-white/75 p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function TimelineStepCard({ step, isLast }: { step: ProjectTimelineStep; isLast: boolean }) {
  const icon =
    step.status === "completed" ? (
      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
    ) : step.status === "current" ? (
      <Clock3 className="h-5 w-5 text-violet-600" />
    ) : (
      <Circle className="h-5 w-5 text-slate-300" />
    );

  const lineColor =
    step.status === "completed"
      ? "bg-emerald-300"
      : step.status === "current"
        ? "bg-violet-200"
        : "bg-slate-200";

  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      <div className="relative flex w-8 flex-col items-center">
        <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
          {icon}
        </div>
        {!isLast && <div className={`mt-2 h-full w-0.5 ${lineColor}`} />}
      </div>

      <div
        className={`flex-1 rounded-[1.35rem] border p-5 shadow-sm ${
          step.status === "current"
            ? "border-violet-200 bg-violet-50/70"
            : step.status === "completed"
              ? "border-emerald-200 bg-emerald-50/60"
              : "border-slate-200 bg-white/80"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-slate-800">{step.label}</p>
            <p className="mt-2 text-sm leading-7 text-slate-500">{step.description}</p>
          </div>
          <Badge
            variant="outline"
            className={
              step.status === "completed"
                ? "border-emerald-200 bg-white text-emerald-700"
                : step.status === "current"
                  ? "border-violet-200 bg-white text-violet-700"
                  : "border-slate-200 bg-white text-slate-500"
            }
          >
            {step.status === "completed" ? "Completed" : step.status === "current" ? "Current" : "Upcoming"}
          </Badge>
        </div>
        <p className="mt-4 text-sm font-medium text-slate-600">{step.time}</p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="max-w-[60%] text-right text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}
