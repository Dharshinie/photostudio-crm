import { Download, Eye, Grid3X3, KeyRound, List, Plus, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { useData, type Album } from "@/contexts/DataContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const statusColors: Record<string, string> = {
  uploaded: "bg-sky-light text-sky",
  "selection-in-progress": "bg-peach-light text-peach",
  selected: "bg-mint-light text-mint",
  editing: "bg-lavender-light text-lavender",
};

export default function Gallery() {
  const { albums, projects, createAlbum, startAlbumEditing } = useData();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [open, setOpen] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [createdAlbum, setCreatedAlbum] = useState<{ albumId: string; passcode: string } | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    clientName: "",
    photoCount: "12",
    projectId: "",
  });

  const totalSelected = useMemo(
    () => albums.reduce((sum, album) => sum + album.selectedPhotoIds.length, 0),
    [albums],
  );
  const selectedAlbum = useMemo(
    () => albums.find((album) => album.recordId === selectedAlbumId) || null,
    [albums, selectedAlbumId],
  );

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createAlbum({
      title: formData.title.trim(),
      clientName: formData.clientName.trim(),
      photoCount: Number(formData.photoCount) || 1,
      projectId: formData.projectId ? Number(formData.projectId) : undefined,
    });

    setCreatedAlbum(result);
    setFormData({
      title: "",
      clientName: "",
      photoCount: "12",
      projectId: "",
    });
  };

  return (
    <>
      <div className="space-y-6 max-w-7xl">
        <div className="flex items-center justify-between animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground" style={{ lineHeight: "1.1" }}>Albums</h1>
            <p className="mt-1 text-sm text-muted-foreground">Upload photos, generate passcodes, track client picks, and start editing.</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={(nextOpen) => {
              setOpen(nextOpen);
              if (!nextOpen) {
                setCreatedAlbum(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Album
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                  <DialogTitle>Create Album</DialogTitle>
                  <DialogDescription>
                    Simulate an admin upload. The system will generate an album ID and client passcode automatically.
                  </DialogDescription>
                </DialogHeader>

                {!createdAlbum ? (
                  <form onSubmit={handleCreateAlbum} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Album Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Client Name</Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, clientName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="photoCount">Photo Count</Label>
                        <Input
                          id="photoCount"
                          type="number"
                          min="1"
                          value={formData.photoCount}
                          onChange={(e) => setFormData((prev) => ({ ...prev, photoCount: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="projectId">Linked Project ID</Label>
                        <Input
                          id="projectId"
                          placeholder="Optional"
                          value={formData.projectId}
                          onChange={(e) => setFormData((prev) => ({ ...prev, projectId: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Create Album</Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                    <p className="text-sm font-semibold text-emerald-800">Album created successfully</p>
                    <InfoRow label="Album ID" value={createdAlbum.albumId} />
                    <InfoRow label="Passcode" value={createdAlbum.passcode} />
                    <p className="text-sm text-emerald-700">
                      Share this passcode with the client so they can open the album and select photos.
                    </p>
                    <div className="flex justify-end">
                      <Button onClick={() => setOpen(false)}>Done</Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="icon" className={view === "grid" ? "bg-accent" : ""} onClick={() => setView("grid")}>
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className={view === "list" ? "bg-accent" : ""} onClick={() => setView("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Albums" value={String(albums.length)} helper="Shared across all logged-in users" />
          <MetricCard label="Selections" value={String(totalSelected)} helper="Client-picked images waiting for review" />
          <MetricCard label="Editing Started" value={String(albums.filter((album) => album.status === "editing").length)} helper="Albums moved into retouching" />
        </div>

        <div className={`grid gap-4 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
          {albums.map((album, i) => (
            <div
              key={album.recordId || album.albumId}
              className="card-soft overflow-hidden animate-fade-in-up group"
              style={{ animationDelay: `${(i + 1) * 80}ms` }}
            >
              <div
                className="h-40 w-full relative flex items-center justify-center"
                style={{ backgroundColor: album.cover }}
              >
                <span className="text-4xl font-bold opacity-20">{album.photos.length}</span>
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-foreground/10">
                  <Button variant="secondary" size="sm" className="gap-1.5 text-xs" onClick={() => setSelectedAlbumId(album.recordId || null)}>
                    <Eye className="h-3.5 w-3.5" /> Open
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-foreground truncate">{album.title}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${statusColors[album.status]}`}>
                    {album.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{album.clientName} · {album.photos.length} photos · {album.albumId}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600">
                  <div className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="font-semibold text-slate-800">Passcode</p>
                    <p className="mt-1">{album.passcode}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="font-semibold text-slate-800">Selections</p>
                    <p className="mt-1">{album.selectedPhotoIds.length}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={Boolean(selectedAlbum)} onOpenChange={(nextOpen) => !nextOpen && setSelectedAlbumId(null)}>
        <DialogContent className="max-h-[92vh] max-w-5xl overflow-hidden">
          {selectedAlbum && (
            <div className="max-h-[92vh] space-y-6 overflow-y-auto pr-1">
              <DialogHeader>
                <DialogTitle>{selectedAlbum.title}</DialogTitle>
                <DialogDescription>
                  Album ID {selectedAlbum.albumId}. Share passcode <span className="font-semibold">{selectedAlbum.passcode}</span> with {selectedAlbum.clientName}.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 md:grid-cols-4">
                <InfoTile icon={<KeyRound className="h-4 w-4" />} label="Passcode" value={selectedAlbum.passcode} />
                <InfoTile icon={<Download className="h-4 w-4" />} label="Photos" value={String(selectedAlbum.photos.length)} />
                <InfoTile icon={<Eye className="h-4 w-4" />} label="Selections" value={String(selectedAlbum.selectedPhotoIds.length)} />
                <InfoTile icon={<WandSparkles className="h-4 w-4" />} label="Linked Project" value={selectedAlbum.projectId ? String(selectedAlbum.projectId) : "None"} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {selectedAlbum.photos.map((photo) => (
                  <div key={photo.id} className={`rounded-2xl border p-3 ${photo.selected ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white"}`}>
                    <div className="flex h-28 items-center justify-center rounded-xl" style={{ backgroundColor: photo.url }}>
                      <span className="text-xs font-bold text-slate-700/70">{photo.label}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-slate-700">{photo.label}</span>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${photo.selected ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        {photo.selected ? "Selected" : "Open"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Admin review</p>
                  <p className="text-sm text-slate-500">
                    {selectedAlbum.selectedPhotoIds.length
                      ? `${selectedAlbum.selectedPhotoIds.length} client selections received. You can start editing now.`
                      : "Waiting for the client to select images."}
                  </p>
                </div>
                <div className="flex gap-2">
                  {selectedAlbum.projectId && (
                    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                      Linked project: {projects.find((project) => project.id === selectedAlbum.projectId)?.projectName || selectedAlbum.projectId}
                    </div>
                  )}
                  <Button
                    onClick={async () => {
                      if (selectedAlbum.recordId) {
                        await startAlbumEditing(selectedAlbum.recordId);
                        setSelectedAlbumId(null);
                      }
                    }}
                    disabled={!selectedAlbum.recordId || !selectedAlbum.selectedPhotoIds.length}
                    className="gap-2"
                  >
                    <WandSparkles className="h-4 w-4" />
                    Start Editing
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/70 bg-white/75 p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{helper}</p>
    </div>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-base font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}
