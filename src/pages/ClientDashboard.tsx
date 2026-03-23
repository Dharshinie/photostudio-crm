import { useMemo, useState, type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Camera,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  Image,
  MapPin,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const bookingStatus = {
  id: "BK-2024-001",
  date: "March 25, 2024",
  type: "Portrait Session",
  status: "Confirmed",
  venue: "Bloom Studio, Downtown",
  photographer: "Ava Wilson",
};

const progressSteps = [
  { step: "Booking Confirmed", status: "completed", date: "Mar 20", detail: "Session request approved and deposit received." },
  { step: "Shoot Scheduled", status: "completed", date: "Mar 22", detail: "Time slot locked for 10:00 AM with styling notes attached." },
  { step: "Photo Shoot", status: "current", date: "Mar 25", detail: "Shoot day is active and the team is preparing your set." },
  { step: "Editing", status: "pending", date: "TBD", detail: "Retouching starts after the shoot is wrapped." },
  { step: "Delivery", status: "pending", date: "TBD", detail: "Final images will be shared in your private gallery." },
];

const paymentStatus = {
  amount: "$150",
  status: "Paid",
  method: "Credit Card",
  due: "$0 balance remaining",
};

const galleryDetails = {
  title: "Portrait Session Gallery",
  description: "A private online gallery with edited portraits, color-corrected images, and downloadable high-resolution files.",
  deliveryDate: "March 29, 2024",
  access: "Private link with download access",
  photosReady: 48,
  packageName: "Signature Portrait Collection",
  highlights: ["Retouched hero portraits", "Web + print-ready downloads", "Mobile friendly preview link"],
  previewCards: [
    { label: "Hero Portraits", count: 12, tone: "from-violet-200 via-white to-sky-100" },
    { label: "Studio Looks", count: 18, tone: "from-sky-200 via-white to-cyan-100" },
    { label: "Close-Up Frames", count: 18, tone: "from-emerald-100 via-white to-teal-100" },
  ],
};

const statusColorMap: Record<string, string> = {
  completed: "text-emerald-600",
  current: "text-indigo-600",
  pending: "text-orange-500",
};

const badgeColorMap: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  current: "bg-indigo-50 text-indigo-700 border-indigo-200",
  pending: "bg-orange-50 text-orange-700 border-orange-200",
};

const statusIconMap: Record<string, ReactNode> = {
  completed: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
  current: <Clock3 className="h-5 w-5 text-indigo-600" />,
  pending: <XCircle className="h-5 w-5 text-orange-500" />,
};

const ClientDashboard = () => {
  const [showGalleryDetails, setShowGalleryDetails] = useState(false);

  const progressValue = useMemo(() => {
    const completedSteps = progressSteps.filter((item) => item.status === "completed").length;
    const currentSteps = progressSteps.filter((item) => item.status === "current").length * 0.5;
    return Math.round(((completedSteps + currentSteps) / progressSteps.length) * 100);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-sky-light via-white to-mint-light px-4 py-6 md:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="glass overflow-hidden rounded-[2rem] border border-white/70 px-6 py-8 shadow-2xl md:px-10">
            <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
              <div className="space-y-5">
                <Badge className="w-fit border-0 bg-indigo-100 px-4 py-1 text-indigo-700 hover:bg-indigo-100">
                  Client Dashboard
                </Badge>
                <div className="space-y-3">
                  <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-slate-800 md:text-5xl">
                    Welcome to Bloom Studio
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                    Track your session, review delivery progress, and open your private gallery from one polished client portal.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => setShowGalleryDetails(true)}
                    className="h-11 rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 px-6 font-semibold text-white shadow-lg shadow-indigo-500/25 hover:opacity-95"
                  >
                    <Image className="mr-2 h-4 w-4" />
                    View Gallery
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11 rounded-full border-white/70 bg-white/75 px-6 font-semibold text-slate-700 hover:bg-white"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Session Timeline
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Gallery Progress</p>
                  <p className="mt-2 text-3xl font-bold text-slate-800">{progressValue}%</p>
                  <p className="mt-1 text-sm text-slate-500">Editing pipeline completed</p>
                </div>
                <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Images Included</p>
                  <p className="mt-2 text-3xl font-bold text-slate-800">{galleryDetails.photosReady}</p>
                  <p className="mt-1 text-sm text-slate-500">Curated and delivery-ready files</p>
                </div>
                <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Balance</p>
                  <p className="mt-2 text-3xl font-bold text-emerald-600">{paymentStatus.due}</p>
                  <p className="mt-1 text-sm text-slate-500">Your booking is fully paid</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_1.6fr]">
            <Card className="glass rounded-[1.75rem] border-white/70 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  Booking Status
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Your confirmed session details at a glance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <InfoBlock label="Booking ID" value={bookingStatus.id} />
                  <InfoBlock label="Session Date" value={bookingStatus.date} />
                  <InfoBlock label="Session Type" value={bookingStatus.type} />
                  <InfoBlock label="Photographer" value={bookingStatus.photographer} />
                </div>

                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/80 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Status</p>
                      <p className="mt-1 text-lg font-bold text-slate-800">{bookingStatus.status}</p>
                    </div>
                    <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                      {bookingStatus.status}
                    </Badge>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-indigo-500" />
                    {bookingStatus.venue}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass rounded-[1.75rem] border-white/70 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <Camera className="h-5 w-5 text-emerald-600" />
                      Progress Tracker
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                      Follow each step from booking to gallery delivery.
                    </CardDescription>
                  </div>
                  <div className="w-full max-w-xs space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-600">Overall progress</span>
                      <span className="font-semibold text-indigo-600">{progressValue}%</span>
                    </div>
                    <Progress value={progressValue} className="h-2.5 bg-slate-200" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {progressSteps.map((item) => (
                  <div key={item.step} className="flex gap-4 rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm">
                    <div className="mt-0.5 shrink-0">{statusIconMap[item.status]}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className={`font-semibold ${statusColorMap[item.status]}`}>{item.step}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-500">{item.detail}</p>
                        </div>
                        <Badge variant="outline" className={badgeColorMap[item.status]}>
                          {item.date}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass rounded-[1.75rem] border-white/70 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <Image className="h-5 w-5 text-sky-600" />
                  Gallery Access
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Open your edited images, package details, and download access.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-[1.5rem] bg-gradient-to-br from-indigo-100 via-white to-sky-100 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Private Gallery</p>
                      <h3 className="mt-1 text-xl font-bold text-slate-800">{galleryDetails.title}</h3>
                    </div>
                    <Sparkles className="h-5 w-5 text-indigo-500" />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{galleryDetails.description}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <MiniStat label="Ready Photos" value={`${galleryDetails.photosReady}`} />
                    <MiniStat label="Delivery Date" value={galleryDetails.deliveryDate} />
                  </div>
                </div>
                <Button
                  onClick={() => setShowGalleryDetails(true)}
                  className="h-12 w-full rounded-2xl bg-sky-500 font-semibold text-white shadow-md shadow-sky-500/20 hover:bg-sky-600"
                >
                  View Gallery
                </Button>
              </CardContent>
            </Card>

            <Card className="glass rounded-[1.75rem] border-white/70 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <CreditCard className="h-5 w-5 text-orange-500" />
                  Payment Status
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Billing and payment confirmation for your session package.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <MiniStat label="Amount Paid" value={paymentStatus.amount} />
                  <MiniStat label="Method" value={paymentStatus.method} />
                  <MiniStat label="Balance" value="$0" />
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="font-semibold text-emerald-700">{paymentStatus.status}</p>
                      <p className="text-sm text-emerald-600">{paymentStatus.due}</p>
                    </div>
                  </div>
                  <Badge className="border-emerald-200 bg-white text-emerald-700 hover:bg-white">
                    Receipt Sent
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showGalleryDetails} onOpenChange={setShowGalleryDetails}>
        <DialogContent className="max-w-4xl rounded-[2rem] border-white/70 bg-white/95 p-0 shadow-2xl">
          <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
            <div className="border-b border-slate-200 bg-gradient-to-br from-indigo-100 via-white to-sky-100 p-6 md:border-b-0 md:border-r">
              <DialogHeader className="text-left">
                <DialogTitle className="text-2xl font-bold text-slate-800">{galleryDetails.title}</DialogTitle>
                <DialogDescription className="text-slate-600">
                  {galleryDetails.description}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {galleryDetails.previewCards.map((item) => (
                  <div
                    key={item.label}
                    className={`rounded-[1.5rem] border border-white/70 bg-gradient-to-br ${item.tone} p-4 shadow-sm`}
                  >
                    <div className="flex h-28 items-end justify-between rounded-[1rem] border border-white/60 bg-white/50 p-4">
                      <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                      <p className="text-2xl font-bold text-slate-800">{item.count}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/70 bg-white/70 p-5">
                <p className="text-sm font-semibold text-slate-700">Gallery Highlights</p>
                <div className="mt-3 space-y-3">
                  {galleryDetails.highlights.map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-5">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-700">Required Details</p>
                  <div className="mt-4 space-y-4">
                    <DetailRow label="Client" value="Sarah Johnson" />
                    <DetailRow label="Booking ID" value={bookingStatus.id} />
                    <DetailRow label="Package" value={galleryDetails.packageName} />
                    <DetailRow label="Access Type" value={galleryDetails.access} />
                    <DetailRow label="Delivery Date" value={galleryDetails.deliveryDate} />
                    <DetailRow label="Download Size" value="High resolution + web format" />
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-indigo-100 bg-indigo-50/70 p-5">
                  <p className="text-sm font-semibold text-slate-700">What you can do here</p>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <p>Preview edited photos before downloading.</p>
                    <p>Access all final images in one private delivery link.</p>
                    <p>Download high-resolution files for print and sharing.</p>
                  </div>
                </div>

                <Button className="h-12 w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 font-semibold text-white shadow-lg shadow-indigo-500/25 hover:opacity-95">
                  <Download className="mr-2 h-4 w-4" />
                  Download Gallery
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/75 p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-right text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

export default ClientDashboard;
