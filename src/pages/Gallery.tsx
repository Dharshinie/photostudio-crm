import { Download, Eye, Grid3X3, ImagePlus, KeyRound, List, PencilLine, Plus, RefreshCcw, Save, Upload, WandSparkles, X } from "lucide-react";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
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
import { useData, type Album, type CreateAlbumPhotoInput } from "@/contexts/DataContext";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  uploaded: "bg-sky-light text-sky",
  "selection-in-progress": "bg-peach-light text-peach",
  selected: "bg-mint-light text-mint",
  editing: "bg-lavender-light text-lavender",
};

type UploadedPhoto = CreateAlbumPhotoInput & {
  fileName: string;
  sizeLabel: string;
};

const getPhotoSurfaceStyle = (url: string) => (
  url.startsWith("data:image")
    ? { backgroundImage: `url(${url})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { backgroundColor: url }
);

export default function Gallery() {
  const { albums, projects, createAlbum, updateAlbum, startAlbumEditing } = useData();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [open, setOpen] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [createdAlbum, setCreatedAlbum] = useState<{ albumId: string; passcode: string } | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    clientName: "",
    projectId: "",
  });
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [isEditingAlbum, setIsEditingAlbum] = useState(false);
  const [isSavingAlbum, setIsSavingAlbum] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: "",
    clientName: "",
    projectId: "",
  });
  const [editPhotos, setEditPhotos] = useState<UploadedPhoto[]>([]);

  const totalSelected = useMemo(
    () => albums.reduce((sum, album) => sum + album.selectedPhotoIds.length, 0),
    [albums],
  );
  const selectedAlbum = useMemo(
    () => albums.find((album) => album.recordId === selectedAlbumId) || null,
    [albums, selectedAlbumId],
  );
  const linkedProject = useMemo(
    () => projects.find((project) => String(project.id) === formData.projectId) || null,
    [formData.projectId, projects],
  );
  const editLinkedProject = useMemo(
    () => projects.find((project) => String(project.id) === editFormData.projectId) || null,
    [editFormData.projectId, projects],
  );

  useEffect(() => {
    if (!selectedAlbum) {
      setIsEditingAlbum(false);
      setEditFormData({
        title: "",
        clientName: "",
        projectId: "",
      });
      setEditPhotos([]);
      return;
    }

    setIsEditingAlbum(selectedAlbum.status === "editing");
    setEditFormData({
      title: selectedAlbum.title,
      clientName: selectedAlbum.clientName,
      projectId: selectedAlbum.projectId ? String(selectedAlbum.projectId) : "",
    });
    setEditPhotos(
      selectedAlbum.photos.map((photo, index) => ({
        url: photo.url,
        label: photo.label,
        fileName: photo.label || `Photo ${index + 1}`,
        sizeLabel: photo.url.startsWith("data:image") ? "Uploaded image" : "Placeholder",
      })),
    );
  }, [selectedAlbum]);

  const resetDialogState = () => {
    setCreatedAlbum(null);
    setUploadedPhotos([]);
    setFormData({
      title: "",
      clientName: "",
      projectId: "",
    });
  };

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
          return;
        }

        reject(new Error(`Unable to load ${file.name}`));
      };
      reader.onerror = () => reject(reader.error || new Error(`Unable to load ${file.name}`));
      reader.readAsDataURL(file);
    });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const createUploadedPhotoEntries = async (files: File[], startIndex: number) => Promise.all(
    files.map(async (file, index) => ({
      url: await readFileAsDataUrl(file),
      label: file.name.replace(/\.[^/.]+$/, "") || `Photo ${startIndex + index + 1}`,
      fileName: file.name,
      sizeLabel: formatFileSize(file.size),
    })),
  );

  const handlePhotoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      return;
    }

    const nextPhotos = await createUploadedPhotoEntries(files, uploadedPhotos.length);

    setUploadedPhotos((prev) => [...prev, ...nextPhotos]);
    event.target.value = "";
  };

  const removeUploadedPhoto = (photoIndex: number) => {
    setUploadedPhotos((prev) => prev.filter((_, index) => index !== photoIndex));
  };

  const handleEditPhotoUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    mode: "append" | "replace",
  ) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      return;
    }

    const nextPhotos = await createUploadedPhotoEntries(files, mode === "append" ? editPhotos.length : 0);
    setEditPhotos((prev) => (mode === "append" ? [...prev, ...nextPhotos] : nextPhotos));
    event.target.value = "";
  };

  const removeEditPhoto = (photoIndex: number) => {
    setEditPhotos((prev) => prev.filter((_, index) => index !== photoIndex));
  };

  const handleCreateAlbum = async (e: FormEvent) => {
    e.preventDefault();

    const result = await createAlbum({
      title: formData.title.trim(),
      clientName: formData.clientName.trim(),
      photoCount: uploadedPhotos.length || 1,
      projectId: formData.projectId ? Number(formData.projectId) : undefined,
      photos: uploadedPhotos.map(({ url, label }) => ({ url, label })),
    });

    setCreatedAlbum(result);
    setFormData({
      title: "",
      clientName: "",
      projectId: "",
    });
    setUploadedPhotos([]);
  };

  const handleStartEditing = async () => {
    if (!selectedAlbum?.recordId) {
      return;
    }

    await startAlbumEditing(selectedAlbum.recordId);
    setIsEditingAlbum(true);
  };

  const handleSaveAlbumChanges = async () => {
    if (!selectedAlbum?.recordId) {
      return;
    }

    setIsSavingAlbum(true);
    try {
      await updateAlbum(selectedAlbum.recordId, {
        title: editFormData.title.trim(),
        clientName: editFormData.clientName.trim(),
        projectId: editFormData.projectId ? Number(editFormData.projectId) : undefined,
        photos: editPhotos.map(({ url, label }) => ({ url, label })),
        status: "editing",
      });
      setIsEditingAlbum(false);
    } finally {
      setIsSavingAlbum(false);
    }
  };

  return (
    <>
      <div className="max-w-7xl space-y-6">
        <div className="flex items-center justify-between animate-fade-in-up">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground" style={{ lineHeight: "1.1" }}>Albums</h1>
            <p className="mt-1 text-sm text-muted-foreground">Upload photos, generate passcodes, track client picks, and start editing.</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog
              open={open}
              onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                if (!nextOpen) {
                  resetDialogState();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Album
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-[900px]">
                <DialogHeader>
                  <DialogTitle>Create Album</DialogTitle>
                  <DialogDescription>
                    Add album details, upload photos, and create a client-ready album with a secure passcode.
                  </DialogDescription>
                </DialogHeader>

                {!createdAlbum ? (
                  <form onSubmit={handleCreateAlbum} className="space-y-5">
                    <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                      <div className="space-y-5">
                        <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                          <div className="mb-4">
                            <p className="text-sm font-semibold text-slate-900">Album details</p>
                            <p className="text-xs text-slate-500">Set the title, assign the client, and optionally link the album to an active project.</p>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="title">Album Title</Label>
                              <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                                placeholder="Spring family portraits"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="clientName">Client Name</Label>
                              <Input
                                id="clientName"
                                value={formData.clientName}
                                onChange={(e) => setFormData((prev) => ({ ...prev, clientName: e.target.value }))}
                                placeholder="Ava Mitchell"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="projectId">Linked Project ID</Label>
                              <Input
                                id="projectId"
                                list="gallery-projects"
                                placeholder="Optional"
                                value={formData.projectId}
                                onChange={(e) => setFormData((prev) => ({ ...prev, projectId: e.target.value }))}
                              />
                              <datalist id="gallery-projects">
                                {projects.map((project) => (
                                  <option key={project.id} value={project.id}>
                                    {project.projectName}
                                  </option>
                                ))}
                              </datalist>
                              <p className="text-xs text-slate-500">
                                {linkedProject
                                  ? `Linked to ${linkedProject.projectName}`
                                  : "Use a project ID if this album should flow into an existing delivery."}
                              </p>
                            </div>
                          </div>
                        </section>

                        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-4">
                          <div className="mb-4 flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">Upload photos</p>
                              <p className="text-xs text-slate-500">Choose one or more files to populate the album and preview the client-facing gallery.</p>
                            </div>
                            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                              {uploadedPhotos.length} files
                            </div>
                          </div>

                          <label
                            htmlFor="albumPhotos"
                            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-slate-400 hover:bg-slate-100"
                          >
                            <Upload className="h-5 w-5 text-slate-500" />
                            <p className="mt-3 text-sm font-semibold text-slate-800">Choose album photos</p>
                            <p className="mt-1 text-xs text-slate-500">PNG, JPG, and WEBP files are supported. Add more files anytime before submitting.</p>
                          </label>
                          <Input
                            id="albumPhotos"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(event) => {
                              void handlePhotoUpload(event);
                            }}
                          />

                          {uploadedPhotos.length ? (
                            <div className="mt-4 grid max-h-72 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
                              {uploadedPhotos.map((photo, index) => (
                                <div key={`${photo.fileName}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                                  <div className="h-28 w-full bg-cover bg-center" style={{ backgroundImage: `url(${photo.url})` }} />
                                  <div className="flex items-start justify-between gap-3 p-3">
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-medium text-slate-800">{photo.label}</p>
                                      <p className="mt-1 truncate text-xs text-slate-500">{photo.fileName}</p>
                                      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">{photo.sizeLabel}</p>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 shrink-0 rounded-full"
                                      onClick={() => removeUploadedPhoto(index)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">
                              No photos selected yet. If you create the album now, placeholder thumbnails will be generated automatically.
                            </div>
                          )}
                        </section>
                      </div>

                      <div className="space-y-5">
                        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                          <div className="mb-4 flex items-center gap-2">
                            <ImagePlus className="h-4 w-4 text-slate-500" />
                            <p className="text-sm font-semibold text-slate-900">Album summary</p>
                          </div>
                          <div className="space-y-3">
                            <InfoRow label="Title" value={formData.title.trim() || "Not set"} />
                            <InfoRow label="Client" value={formData.clientName.trim() || "Not set"} />
                            <InfoRow label="Photos" value={String(uploadedPhotos.length || 1)} />
                            <InfoRow label="Project" value={linkedProject ? linkedProject.projectName : formData.projectId || "None"} />
                          </div>
                        </section>

                        <section className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
                          <p className="text-sm font-semibold text-sky-900">What happens next</p>
                          <div className="mt-3 space-y-3 text-sm text-sky-900/80">
                            <div className="rounded-xl bg-white/80 px-3 py-2">The app generates an album ID and client passcode automatically.</div>
                            <div className="rounded-xl bg-white/80 px-3 py-2">Uploaded photos become the selection gallery the client sees after unlocking the album.</div>
                            <div className="rounded-xl bg-white/80 px-3 py-2">Once favorites are selected, the album moves into your editing workflow.</div>
                          </div>
                        </section>

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Album
                          </Button>
                        </div>
                      </div>
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

        <div className={cn("grid gap-4", view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
          {albums.map((album, i) => (
            <div
              key={album.recordId || album.albumId}
              className={cn(
                "card-soft group overflow-hidden animate-fade-in-up",
                view === "list" && "grid gap-0 md:grid-cols-[220px_1fr]",
              )}
              style={{ animationDelay: `${(i + 1) * 80}ms` }}
            >
              <div
                className={cn(
                  "relative flex h-40 w-full items-center justify-center",
                  view === "list" && "md:h-full md:min-h-[188px]",
                )}
                style={getPhotoSurfaceStyle(album.cover)}
              >
                <span className="text-4xl font-bold opacity-20">{album.photos.length}</span>
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Button variant="secondary" size="sm" className="gap-1.5 text-xs" onClick={() => setSelectedAlbumId(album.recordId || null)}>
                    <Eye className="h-3.5 w-3.5" /> Open
                  </Button>
                </div>
              </div>
              <div className="flex flex-col justify-between p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-foreground truncate">{album.title}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusColors[album.status]}`}>
                    {album.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{album.clientName} · {album.photos.length} photos · {album.albumId}</p>
                <div className={cn("mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600", view === "list" && "md:max-w-md")}>
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
            <div className="grid max-h-[92vh] gap-0 lg:grid-cols-[minmax(0,1.45fr)_320px]">
              <div className="overflow-y-auto bg-slate-50/70 p-6">
                <DialogHeader className="text-left">
                  <DialogTitle>{selectedAlbum.title}</DialogTitle>
                  <DialogDescription>
                    Album ID {selectedAlbum.albumId}. Share passcode <span className="font-semibold">{selectedAlbum.passcode}</span> with {selectedAlbum.clientName}.
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  <InfoTile icon={<KeyRound className="h-4 w-4" />} label="Passcode" value={selectedAlbum.passcode} />
                  <InfoTile icon={<Download className="h-4 w-4" />} label="Photos" value={String(isEditingAlbum ? editPhotos.length : selectedAlbum.photos.length)} />
                  <InfoTile icon={<Eye className="h-4 w-4" />} label="Selections" value={String(selectedAlbum.selectedPhotoIds.length)} />
                  <InfoTile icon={<WandSparkles className="h-4 w-4" />} label="Linked Project" value={selectedAlbum.projectId ? String(selectedAlbum.projectId) : "None"} />
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {isEditingAlbum ? "Editing workspace" : "Album gallery"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {isEditingAlbum
                          ? "Re-upload, replace, or remove images before saving the updated album."
                          : "Review the uploaded images exactly as they appear in the client dashboard."}
                      </p>
                    </div>
                    {isEditingAlbum ? (
                      <div className="flex flex-wrap gap-2">
                        <label htmlFor="album-edit-add" className="cursor-pointer">
                          <span className="inline-flex h-10 items-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm">
                            <Upload className="mr-2 h-4 w-4" />
                            Add Photos
                          </span>
                        </label>
                        <label htmlFor="album-edit-replace" className="cursor-pointer">
                          <span className="inline-flex h-10 items-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm">
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Replace All
                          </span>
                        </label>
                        <Input
                          id="album-edit-add"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(event) => {
                            void handleEditPhotoUpload(event, "append");
                          }}
                        />
                        <Input
                          id="album-edit-replace"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(event) => {
                            void handleEditPhotoUpload(event, "replace");
                          }}
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {(isEditingAlbum ? editPhotos : selectedAlbum.photos).map((photo, index) => (
                      <div
                        key={`${photo.label}-${index}`}
                        className={`rounded-2xl border p-3 ${
                          !isEditingAlbum && selectedAlbum.photos[index]?.selected
                            ? "border-emerald-300 bg-emerald-50"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div
                          className="h-44 rounded-xl bg-cover bg-center"
                          style={getPhotoSurfaceStyle(photo.url)}
                        />
                        <div className="mt-3 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <span className="block truncate text-xs font-medium text-slate-700">{photo.label}</span>
                            <span className="mt-1 block text-[11px] text-slate-500">
                              {isEditingAlbum
                                ? photo.fileName
                                : selectedAlbum.photos[index]?.selected
                                  ? "Selected by client"
                                  : "Visible in client gallery"}
                            </span>
                          </div>
                          {isEditingAlbum ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 shrink-0 rounded-full"
                              onClick={() => removeEditPhoto(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          ) : (
                            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${selectedAlbum.photos[index]?.selected ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                              {selectedAlbum.photos[index]?.selected ? "Selected" : "Open"}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto border-t border-slate-200 bg-white p-6 lg:border-l lg:border-t-0">
                <div className="space-y-5">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      <PencilLine className="h-4 w-4 text-slate-500" />
                      <p className="text-sm font-semibold text-slate-900">Album controls</p>
                    </div>
                    <div className="mt-4 space-y-3">
                      <InfoRow label="Status" value={selectedAlbum.status} />
                      <InfoRow label="Client Picks" value={String(selectedAlbum.selectedPhotoIds.length)} />
                      <InfoRow label="Images Ready" value={String(isEditingAlbum ? editPhotos.length : selectedAlbum.photos.length)} />
                    </div>
                  </div>

                  {isEditingAlbum ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-sm font-semibold text-slate-900">Edit album</p>
                      <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-title">Album Title</Label>
                          <Input
                            id="edit-title"
                            value={editFormData.title}
                            onChange={(e) => setEditFormData((prev) => ({ ...prev, title: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-clientName">Client Name</Label>
                          <Input
                            id="edit-clientName"
                            value={editFormData.clientName}
                            onChange={(e) => setEditFormData((prev) => ({ ...prev, clientName: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-projectId">Linked Project ID</Label>
                          <Input
                            id="edit-projectId"
                            list="gallery-projects"
                            value={editFormData.projectId}
                            onChange={(e) => setEditFormData((prev) => ({ ...prev, projectId: e.target.value }))}
                          />
                          <p className="text-xs text-slate-500">
                            {editLinkedProject
                              ? `Linked to ${editLinkedProject.projectName}`
                              : "Use a project ID if this edit should stay connected to a project."}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-sm font-semibold text-slate-900">Admin review</p>
                      <p className="mt-2 text-sm text-slate-500">
                        {selectedAlbum.selectedPhotoIds.length
                          ? `${selectedAlbum.selectedPhotoIds.length} client selections received. Start editing to update or re-upload album images.`
                          : "No client selections yet. You can still start editing to reorganize or replace the uploaded images."}
                      </p>
                      {selectedAlbum.projectId && (
                        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                          Linked project: {projects.find((project) => project.id === selectedAlbum.projectId)?.projectName || selectedAlbum.projectId}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
                    <p className="text-sm font-semibold text-indigo-900">Workflow</p>
                    <div className="mt-3 space-y-2 text-sm text-indigo-900/80">
                      <p>Uploaded photos are visible in the client dashboard right away.</p>
                      <p>Starting editing keeps this album open for admin changes.</p>
                      <p>Saving publishes the refreshed image set back to the client gallery.</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {isEditingAlbum ? (
                      <>
                        <Button onClick={handleSaveAlbumChanges} disabled={!selectedAlbum.recordId || !editPhotos.length || isSavingAlbum} className="gap-2">
                          <Save className="h-4 w-4" />
                          {isSavingAlbum ? "Saving..." : "Save Album Changes"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsEditingAlbum(false)}>
                          Exit Editing
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleStartEditing}
                        disabled={!selectedAlbum.recordId}
                        className="gap-2"
                      >
                        <WandSparkles className="h-4 w-4" />
                        Start Editing
                      </Button>
                    )}
                  </div>
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

function InfoTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
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
      <span className="text-right text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}
