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
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";

const statusColorMap: Record<string, string> = {
  completed: "text-emerald-600",
  current: "text-indigo-600",
  upcoming: "text-orange-500",
};

const badgeColorMap: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  current: "bg-indigo-50 text-indigo-700 border-indigo-200",
  upcoming: "bg-orange-50 text-orange-700 border-orange-200",
};

const statusIconMap: Record<string, ReactNode> = {
  completed: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
  current: <Clock3 className="h-5 w-5 text-indigo-600" />,
  upcoming: <XCircle className="h-5 w-5 text-orange-500" />,
};

const ClientDashboard = () => {
  const [showGalleryDetails, setShowGalleryDetails] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [albumError, setAlbumError] = useState("");
  const [unlockedAlbumId, setUnlockedAlbumId] = useState<string | null>(null);
  const { bookings, projects, albums, unlockAlbumByPasscode, toggleAlbumPhotoSelection } = useData();
  const { user } = useAuth();

  const activeBooking = bookings[0] || null;
  const unlockedAlbum = useMemo(() => {
    if (unlockedAlbumId) {
      return albums.find((album) => album.recordId === unlockedAlbumId) || null;
    }

    if (!activeBooking) {
      return null;
    }

    return albums.find((album) => album.clientName === activeBooking.client) || null;
  }, [activeBooking, albums, unlockedAlbumId]);

  const activeProject = useMemo(() => {
    if (unlockedAlbum?.projectId) {
      return projects.find((project) => project.id === unlockedAlbum.projectId) || null;
    }

    if (!activeBooking) {
      return null;
    }

    return projects.find((project) => project.clientName === activeBooking.client) || projects[0] || null;
  }, [activeBooking, projects, unlockedAlbum]);

  const progressSteps = activeProject?.timeline || [];
  const completedSteps = progressSteps.filter((item) => item.status === "completed").length;
  const currentSteps = progressSteps.filter((item) => item.status === "current").length * 0.5;

  const progressValue = useMemo(() => {
    if (!progressSteps.length) {
      return 0;
    }

    return Math.round(((completedSteps + currentSteps) / progressSteps.length) * 100);
  }, [completedSteps, currentSteps, progressSteps]);

  const galleryDetails = useMemo(() => ({
    title: unlockedAlbum?.title || activeProject?.projectName || "No Gallery Ready Yet",
    description: unlockedAlbum
      ? "Select your favorite photos from this passcode-protected album. Your photographer will see each selection instantly."
      : activeProject
        ? `Your ${activeProject.projectType.toLowerCase()} is being prepared and synced from Firebase.`
        : "Your session details will appear here as soon as a booking is created in Firebase.",
    deliveryDate: activeProject?.dueDate || "TBD",
    access: unlockedAlbum ? "Passcode protected album" : "Private link with download access",
    photosReady: unlockedAlbum?.photos.length || (activeProject ? Math.max(12, Math.round(activeProject.completion * 1.2)) : 0),
    packageName: unlockedAlbum?.title || activeProject?.projectType || "Pending Package",
    highlights: unlockedAlbum
      ? [
          `Album ID: ${unlockedAlbum.albumId}`,
          `Passcode shared successfully for ${unlockedAlbum.clientName}`,
          `${unlockedAlbum.selectedPhotoIds.length} images selected`,
        ]
      : [
          "Live booking details from Firebase",
          "Progress synced with your project timeline",
          "Private client portal access",
        ],
    previewCards: unlockedAlbum
      ? unlockedAlbum.photos.slice(0, 3).map((photo) => ({
          label: photo.label,
          count: photo.selected ? "Picked" : "Open",
          tone: photo.url,
        }))
      : [
          { label: "Gallery Progress", count: String(Math.max(progressValue, 0)), tone: "from-violet-200 via-white to-sky-100" },
          { label: "Bookings", count: String(bookings.length), tone: "from-sky-200 via-white to-cyan-100" },
          { label: "Projects", count: String(projects.length), tone: "from-emerald-100 via-white to-teal-100" },
        ],
  }), [activeProject, bookings.length, progressValue, projects.length, unlockedAlbum]);

  const bookingStatus = useMemo(() => ({
    id: activeBooking ? `BK-${String(activeBooking.id).padStart(4, "0")}` : "Pending",
    date: activeBooking?.date || "TBD",
    type: activeBooking?.type || "No booking yet",
    status: activeBooking ? `${activeBooking.status.charAt(0).toUpperCase()}${activeBooking.status.slice(1)}` : "Waiting",
    venue: activeBooking?.location || "Will be shared soon",
    photographer: activeProject?.clientName ? "Bloom Studio Team" : "Assigned after confirmation",
  }), [activeBooking, activeProject?.clientName]);

  const paymentStatus = useMemo(() => ({
    amount: activeBooking?.amount || "Rs.0",
    status: activeBooking?.status === "completed" || activeBooking?.status === "confirmed" ? "Paid" : "Pending",
    method: "Saved in hard drive",
    due: activeBooking?.status === "completed" || activeBooking?.status === "confirmed" ? "Rs.0 balance remaining" : "Balance pending",
  }), [activeBooking]);

  const clientName = user?.displayName || user?.email?.split("@")[0] || "Client";

  const handleUnlockAlbum = () => {
    const matchedAlbum = unlockAlbumByPasscode(passcode);
    if (!matchedAlbum?.recordId) {
      setAlbumError("Passcode not found. Please check the code shared by your photographer.");
      return;
    }

    setUnlockedAlbumId(matchedAlbum.recordId);
    setPasscode(matchedAlbum.passcode);
    setAlbumError("");
    setShowGalleryDetails(true);
  };

  if (!activeBooking && !activeProject && !unlockedAlbum) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-light via-white to-mint-light px-4 py-6 md:px-8">
        <div className="mx-auto max-w-4xl">
          <Card className="glass rounded-[2rem] border-white/70 shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-slate-800">Client Dashboard</CardTitle>
              <CardDescription className="text-slate-600">
                Your account is connected. Enter an album passcode to start selecting photos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/70 p-6 text-sm leading-7 text-slate-600">
                Signed in as {clientName}. No bookings or project records were found yet for this account.
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input value={passcode} onChange={(e) => setPasscode(e.target.value.toUpperCase())} placeholder="Enter album passcode" />
                <Button onClick={handleUnlockAlbum}>Open Album</Button>
              </div>
              {albumError ? <p className="text-xs text-rose-600">{albumError}</p> : null}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                    Welcome, {clientName}
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                    Enter your album passcode, select your favorite images, and let the studio start editing right away.
                  </p>
                </div>

                <div className="max-w-xl rounded-[1.5rem] border border-white/70 bg-white/70 p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-800">Open your album with a passcode</p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <Input
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                      placeholder="Enter album passcode"
                      className="bg-white"
                    />
                    <Button onClick={handleUnlockAlbum} className="sm:min-w-32">Open Album</Button>
                  </div>
                  {albumError ? <p className="mt-2 text-xs text-rose-600">{albumError}</p> : null}
                  {unlockedAlbum ? (
                    <p className="mt-2 text-xs text-slate-500">
                      Album unlocked: {unlockedAlbum.title} ({unlockedAlbum.albumId})
                    </p>
                  ) : null}
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
                  <p className="mt-1 text-sm text-slate-500">Available inside your album</p>
                </div>
                <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Your Picks</p>
                  <p className="mt-2 text-3xl font-bold text-emerald-600">{unlockedAlbum?.selectedPhotoIds.length || 0}</p>
                  <p className="mt-1 text-sm text-slate-500">Selections synced to admin review</p>
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
                  <div key={item.id} className="flex gap-4 rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm">
                    <div className="mt-0.5 shrink-0">{statusIconMap[item.status]}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className={`font-semibold ${statusColorMap[item.status]}`}>{item.label}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
                        </div>
                        <Badge variant="outline" className={badgeColorMap[item.status]}>
                          {item.time}
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
                  Open your album, select favorite images, and review what the admin shared.
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
                  <MiniStat label="Balance" value={paymentStatus.due} />
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
        <DialogContent className="max-h-[92vh] max-w-5xl overflow-hidden rounded-[2rem] border-white/70 bg-white/95 p-0 shadow-2xl">
          <div className="grid max-h-[92vh] gap-0 md:grid-cols-[1.2fr_0.8fr]">
            <div className="max-h-[92vh] overflow-y-auto border-b border-slate-200 bg-gradient-to-br from-indigo-100 via-white to-sky-100 p-6 md:border-b-0 md:border-r">
              <DialogHeader className="text-left">
                <DialogTitle className="text-2xl font-bold text-slate-800">{galleryDetails.title}</DialogTitle>
                <DialogDescription className="text-slate-600">
                  {galleryDetails.description}
                </DialogDescription>
              </DialogHeader>

              {unlockedAlbum ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {unlockedAlbum.photos.map((photo) => (
                    <button
                      key={photo.id}
                      onClick={async () => {
                        if (unlockedAlbum.recordId) {
                          await toggleAlbumPhotoSelection(unlockedAlbum.recordId, photo.id);
                        }
                      }}
                      className={`rounded-[1.5rem] border p-4 text-left shadow-sm transition-colors ${
                        photo.selected
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-white/70 bg-white/80 hover:border-indigo-200"
                      }`}
                    >
                      <div className="flex h-32 items-end justify-between rounded-[1rem] border border-white/60 bg-white/50 p-4" style={{ backgroundColor: photo.url }}>
                        <p className="text-sm font-semibold text-slate-700">{photo.label}</p>
                        <p className="rounded-full bg-white/85 px-2 py-1 text-xs font-bold text-slate-800">
                          {photo.selected ? "Selected" : "Tap to select"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-600">
                  Enter the album passcode above to unlock photo selection.
                </div>
              )}

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

            <div className="max-h-[92vh] overflow-y-auto p-6">
              <div className="space-y-5">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-700">Required Details</p>
                  <div className="mt-4 space-y-4">
                    <DetailRow label="Client" value={clientName} />
                    <DetailRow label="Booking ID" value={bookingStatus.id} />
                    <DetailRow label="Package" value={galleryDetails.packageName} />
                    <DetailRow label="Access Type" value={galleryDetails.access} />
                    <DetailRow label="Delivery Date" value={galleryDetails.deliveryDate} />
                    <DetailRow label="Selected Images" value={String(unlockedAlbum?.selectedPhotoIds.length || 0)} />
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-indigo-100 bg-indigo-50/70 p-5">
                  <p className="text-sm font-semibold text-slate-700">What you can do here</p>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <p>Open your album with the passcode shared by the admin.</p>
                    <p>Select the images you want edited or delivered first.</p>
                    <p>Your selections sync instantly so editing can begin.</p>
                  </div>
                </div>

                <Button className="h-12 w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 font-semibold text-white shadow-lg shadow-indigo-500/25 hover:opacity-95">
                  <Download className="mr-2 h-4 w-4" />
                  {unlockedAlbum ? `Selected ${unlockedAlbum.selectedPhotoIds.length} Photos` : "Enter Passcode to Continue"}
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
