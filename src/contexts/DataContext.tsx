import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  get,
  onValue,
  push,
  ref,
  set,
  update,
} from "firebase/database";
import { rtdb } from "@/firebase/config";
import { useAuth } from "./AuthContext";

export interface Client {
  recordId?: string;
  name: string;
  email: string;
  phone: string;
  sessions: number;
  totalSpent: string;
  lastSession: string;
  status: "active" | "inactive" | "new";
}

export interface Booking {
  recordId?: string;
  id: number;
  client: string;
  type: string;
  date: string;
  time: string;
  location: string;
  status: "confirmed" | "pending" | "completed";
  amount: string;
}

export type ProjectStatus = "editing" | "in-progress" | "exporting" | "packing" | "delivered";

export interface ProjectTimelineStep {
  id: string;
  label: string;
  description: string;
  time: string;
  status: "completed" | "current" | "upcoming";
}

export interface Project {
  recordId?: string;
  id: number;
  clientName: string;
  projectName: string;
  projectType: string;
  dueDate: string;
  status: ProjectStatus;
  completion: number;
  priority: "High" | "Medium" | "Low";
  deliverables: string;
  notes: string;
  timeline: ProjectTimelineStep[];
}

export interface AlbumPhoto {
  id: string;
  url: string;
  label: string;
  selected: boolean;
}

export interface Album {
  recordId?: string;
  albumId: string;
  title: string;
  clientName: string;
  projectId?: number;
  passcode: string;
  cover: string;
  status: "uploaded" | "selection-in-progress" | "selected" | "editing";
  photos: AlbumPhoto[];
  selectedPhotoIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface DataContextType {
  clients: Client[];
  bookings: Booking[];
  projects: Project[];
  albums: Album[];
  addBooking: (booking: Omit<Booking, "id" | "recordId">) => Promise<void>;
  addClient: (client: Omit<Client, "recordId">) => Promise<void>;
  updateClient: (clientName: string, updates: Partial<Client>) => Promise<void>;
  updateProjectStatus: (projectId: number, status: ProjectStatus) => Promise<void>;
  createAlbum: (input: { title: string; clientName: string; photoCount: number; projectId?: number }) => Promise<{ albumId: string; passcode: string }>;
  unlockAlbumByPasscode: (passcode: string) => Album | null;
  toggleAlbumPhotoSelection: (albumRecordId: string, photoId: string) => Promise<void>;
  startAlbumEditing: (albumRecordId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const DATA_ROOT = "studioData";

const initialClients: Client[] = [
  { name: "Mara Jensen", email: "mara@email.com", phone: "+1 (415) 234-8901", sessions: 6, totalSpent: "Rs.4,200", lastSession: "Mar 28", status: "active" },
  { name: "Leo Tran", email: "leo.tran@email.com", phone: "+1 (628) 555-0147", sessions: 3, totalSpent: "Rs.1,050", lastSession: "Mar 15", status: "active" },
  { name: "Ava Mitchell", email: "ava.m@email.com", phone: "+1 (510) 982-3344", sessions: 8, totalSpent: "Rs.6,400", lastSession: "Mar 20", status: "active" },
  { name: "Noah Caldwell", email: "noah.c@email.com", phone: "+1 (650) 771-2280", sessions: 2, totalSpent: "Rs.3,200", lastSession: "Feb 14", status: "inactive" },
  { name: "Iris Nakamura", email: "iris.n@email.com", phone: "+1 (408) 643-9912", sessions: 5, totalSpent: "Rs.2,250", lastSession: "Apr 8", status: "active" },
  { name: "Ravi Patel", email: "ravi.p@email.com", phone: "+1 (925) 338-5567", sessions: 1, totalSpent: "Rs.2075", lastSession: "Apr 10", status: "new" },
];

const initialBookings: Booking[] = [
  { id: 1, client: "Mara Jensen", type: "Wedding", date: "Mar 28, 2026", time: "10:00 AM", location: "Riverside Gardens", status: "confirmed", amount: "Rs.2,400" },
  { id: 2, client: "Leo Tran", type: "Portrait Session", date: "Mar 30, 2026", time: "2:00 PM", location: "Studio A", status: "pending", amount: "Rs.350" },
  { id: 3, client: "Ava Mitchell", type: "Product Shoot", date: "Apr 2, 2026", time: "9:00 AM", location: "Studio B", status: "confirmed", amount: "Rs.800" },
  { id: 4, client: "Noah Caldwell", type: "Corporate Event", date: "Apr 5, 2026", time: "6:00 PM", location: "Grand Ballroom", status: "pending", amount: "Rs.1,600" },
  { id: 5, client: "Iris Nakamura", type: "Family Portrait", date: "Apr 8, 2026", time: "11:00 AM", location: "Maple Park", status: "completed", amount: "Rs.450" },
  { id: 6, client: "Ravi Patel", type: "Headshots", date: "Apr 10, 2026", time: "3:00 PM", location: "Studio A", status: "confirmed", amount: "Rs.275" },
];

const projectStatusMeta: Record<
  ProjectStatus,
  {
    completion: number;
    timelineIndex: number;
  }
> = {
  editing: { completion: 24, timelineIndex: 1 },
  "in-progress": { completion: 48, timelineIndex: 2 },
  exporting: { completion: 72, timelineIndex: 3 },
  packing: { completion: 88, timelineIndex: 4 },
  delivered: { completion: 100, timelineIndex: 5 },
};

function createTimeline(currentStatus: ProjectStatus): ProjectTimelineStep[] {
  const stageIndex = projectStatusMeta[currentStatus].timelineIndex;

  return [
    {
      id: "assets-received",
      label: "Assets Received",
      description: "Raw files, creative brief, and selection notes are uploaded to the project workspace.",
      time: "Today, 08:30 AM",
      status: "completed",
    },
    {
      id: "editing-started",
      label: "Editing Started",
      description: "Color correction and primary retouching have started.",
      time: stageIndex >= 1 ? "Today, 09:15 AM" : "Pending",
      status: stageIndex > 1 ? "completed" : stageIndex === 1 ? "current" : "upcoming",
    },
    {
      id: "in-progress",
      label: "In Progress",
      description: "The project is actively moving through retouching and refinement.",
      time: stageIndex >= 2 ? "Today, 11:40 AM" : "Pending",
      status: stageIndex > 2 ? "completed" : stageIndex === 2 ? "current" : "upcoming",
    },
    {
      id: "exporting",
      label: "Exporting",
      description: "Final approved files are being exported in web and print-ready formats.",
      time: stageIndex >= 3 ? "Today, 02:20 PM" : "Pending",
      status: stageIndex > 3 ? "completed" : stageIndex === 3 ? "current" : "upcoming",
    },
    {
      id: "packing",
      label: "Packing",
      description: "Gallery links, ZIP archives, and handoff notes are being prepared.",
      time: stageIndex >= 4 ? "Today, 04:10 PM" : "Pending",
      status: stageIndex > 4 ? "completed" : stageIndex === 4 ? "current" : "upcoming",
    },
    {
      id: "delivered",
      label: "Delivered",
      description: "The client has received the final gallery and download package.",
      time: stageIndex >= 5 ? "Today, 06:00 PM" : "Pending",
      status: stageIndex === 5 ? "current" : "upcoming",
    },
  ];
}

const initialProjects: Project[] = [
  {
    id: 101,
    clientName: "Mara Jensen",
    projectName: "Jensen Wedding Gallery",
    projectType: "Wedding Delivery",
    dueDate: "Mar 28, 2026",
    status: "editing",
    completion: projectStatusMeta.editing.completion,
    priority: "High",
    deliverables: "420 edited photos, cinematic highlights reel, online gallery",
    notes: "Prioritize ceremony portraits and family selects before album exports.",
    timeline: createTimeline("editing"),
  },
  {
    id: 102,
    clientName: "Ava Mitchell",
    projectName: "Aura Skincare Product Launch",
    projectType: "Commercial Campaign",
    dueDate: "Apr 2, 2026",
    status: "in-progress",
    completion: projectStatusMeta["in-progress"].completion,
    priority: "High",
    deliverables: "24 hero images, 12 crop variants, campaign banner set",
    notes: "Client requested brighter skin tones and softer shadow rolloff on packaging shots.",
    timeline: createTimeline("in-progress"),
  },
  {
    id: 103,
    clientName: "Ravi Patel",
    projectName: "Executive Headshots",
    projectType: "Corporate Portraits",
    dueDate: "Apr 10, 2026",
    status: "exporting",
    completion: projectStatusMeta.exporting.completion,
    priority: "Medium",
    deliverables: "18 retouched portraits, web crop pack, LinkedIn banner",
    notes: "Keep exports balanced across neutral and warm backgrounds.",
    timeline: createTimeline("exporting"),
  },
  {
    id: 104,
    clientName: "Noah Caldwell",
    projectName: "Caldwell Gala Delivery",
    projectType: "Event Coverage",
    dueDate: "Apr 5, 2026",
    status: "packing",
    completion: projectStatusMeta.packing.completion,
    priority: "Medium",
    deliverables: "312 event images, download archive, gallery share link",
    notes: "Final package needs sponsor folder naming before delivery.",
    timeline: createTimeline("packing"),
  },
  {
    id: 105,
    clientName: "Iris Nakamura",
    projectName: "Spring Family Portraits",
    projectType: "Portrait Delivery",
    dueDate: "Apr 8, 2026",
    status: "delivered",
    completion: projectStatusMeta.delivered.completion,
    priority: "Low",
    deliverables: "86 edited portraits, print release, family mini album preview",
    notes: "Client already confirmed favorites and delivery email was sent.",
    timeline: createTimeline("delivered"),
  },
];

const initialAlbums: Album[] = [
  {
    albumId: "ALB-1001",
    title: "Jensen Wedding Shortlist",
    clientName: "Mara Jensen",
    projectId: 101,
    passcode: "MARA28",
    cover: "hsl(262, 52%, 88%)",
    status: "selection-in-progress",
    selectedPhotoIds: ["photo-1", "photo-3"],
    photos: [
      { id: "photo-1", url: "hsl(262, 52%, 88%)", label: "Ceremony Portrait 01", selected: true },
      { id: "photo-2", url: "hsl(210, 70%, 88%)", label: "Ceremony Portrait 02", selected: false },
      { id: "photo-3", url: "hsl(162, 48%, 85%)", label: "Family Frame 03", selected: true },
      { id: "photo-4", url: "hsl(18, 85%, 88%)", label: "Reception Detail 04", selected: false },
    ],
  },
  {
    albumId: "ALB-1002",
    title: "Aura Product Review",
    clientName: "Ava Mitchell",
    projectId: 102,
    passcode: "AURA42",
    cover: "hsl(18, 85%, 88%)",
    status: "uploaded",
    selectedPhotoIds: [],
    photos: [
      { id: "photo-1", url: "hsl(18, 85%, 88%)", label: "Hero Bottle 01", selected: false },
      { id: "photo-2", url: "hsl(210, 60%, 90%)", label: "Lifestyle Flatlay 02", selected: false },
      { id: "photo-3", url: "hsl(262, 40%, 90%)", label: "Texture Detail 03", selected: false },
    ],
  },
];

const normalizeName = (value: string) => value.trim().toLowerCase();

const normalizeAmount = (value: string) => {
  const numericAmount = parseInt(value.replace(/[^\d]/g, ""), 10) || 0;
  return `Rs.${numericAmount.toLocaleString("en-IN")}`;
};

const formatLastSession = (value: string) => value.split(", ").slice(0, 1).join("") || value;

function mapCollection<T>(value: Record<string, T> | null | undefined) {
  return Object.entries(value || {}).map(([recordId, item]) => ({
    ...item,
    recordId,
  }));
}

function normalizeAlbum(album: Partial<Album> & { recordId?: string }): Album {
  const normalizedPhotos = (album.photos || []).map((photo, index) => ({
    id: photo.id || `photo-${index + 1}`,
    url: photo.url || "hsl(262, 52%, 88%)",
    label: photo.label || `Photo ${index + 1}`,
    selected: Boolean(photo.selected),
  }));

  const selectedPhotoIds = album.selectedPhotoIds
    || normalizedPhotos.filter((photo) => photo.selected).map((photo) => photo.id);

  const normalizedStatus = album.status
    || (selectedPhotoIds.length ? "selected" : "uploaded");

  return {
    recordId: album.recordId,
    albumId: album.albumId || `ALB-${album.recordId || "0000"}`,
    title: album.title || "Untitled Album",
    clientName: album.clientName || "Unknown Client",
    projectId: album.projectId,
    passcode: album.passcode || "PASSCODE",
    cover: album.cover || normalizedPhotos[0]?.url || "hsl(262, 52%, 88%)",
    status: normalizedStatus,
    photos: normalizedPhotos,
    selectedPhotoIds,
    createdAt: album.createdAt,
    updatedAt: album.updatedAt,
  };
}

async function seedSharedStudioData() {
  const [metaSnapshot, clientsSnapshot, bookingsSnapshot, projectsSnapshot, albumsSnapshot] = await Promise.all([
    get(ref(rtdb, `${DATA_ROOT}/meta/seed`)),
    get(ref(rtdb, `${DATA_ROOT}/clients`)),
    get(ref(rtdb, `${DATA_ROOT}/bookings`)),
    get(ref(rtdb, `${DATA_ROOT}/projects`)),
    get(ref(rtdb, `${DATA_ROOT}/albums`)),
  ]);

  const existingClients = mapCollection<Client>(clientsSnapshot.val());
  const existingBookings = mapCollection<Booking>(bookingsSnapshot.val());
  const existingProjects = mapCollection<Project>(projectsSnapshot.val());
  const existingAlbums = mapCollection<Album>(albumsSnapshot.val()).map(normalizeAlbum);

  const existingClientNames = new Set(existingClients.map((client) => normalizeName(client.name)));
  const existingBookingIds = new Set(existingBookings.map((booking) => Number(booking.id)));
  const existingProjectIds = new Set(existingProjects.map((project) => Number(project.id)));
  const existingAlbumIds = new Set(existingAlbums.map((album) => album.albumId));

  const missingClients = initialClients.filter((client) => !existingClientNames.has(normalizeName(client.name)));
  const missingBookings = initialBookings.filter((booking) => !existingBookingIds.has(booking.id));
  const missingProjects = initialProjects.filter((project) => !existingProjectIds.has(project.id));
  const missingAlbums = initialAlbums.filter((album) => !existingAlbumIds.has(album.albumId));

  if (metaSnapshot.exists() && !missingClients.length && !missingBookings.length && !missingProjects.length && !missingAlbums.length) {
    return;
  }

  const updates: Record<string, unknown> = {};
  const now = new Date().toISOString();

  missingClients.forEach((client) => {
    const recordId = push(ref(rtdb, `${DATA_ROOT}/clients`)).key;
    if (recordId) {
      updates[`${DATA_ROOT}/clients/${recordId}`] = {
        ...client,
        createdAt: now,
        updatedAt: now,
      };
    }
  });

  missingBookings.forEach((booking) => {
    const recordId = push(ref(rtdb, `${DATA_ROOT}/bookings`)).key;
    if (recordId) {
      updates[`${DATA_ROOT}/bookings/${recordId}`] = {
        ...booking,
        createdAt: now,
        updatedAt: now,
      };
    }
  });

  missingProjects.forEach((project) => {
    const recordId = push(ref(rtdb, `${DATA_ROOT}/projects`)).key;
    if (recordId) {
      updates[`${DATA_ROOT}/projects/${recordId}`] = {
        ...project,
        createdAt: now,
        updatedAt: now,
      };
    }
  });

  missingAlbums.forEach((album) => {
    const recordId = push(ref(rtdb, `${DATA_ROOT}/albums`)).key;
    if (recordId) {
      updates[`${DATA_ROOT}/albums/${recordId}`] = {
        ...album,
        createdAt: now,
        updatedAt: now,
      };
    }
  });

  updates[`${DATA_ROOT}/meta/seed`] = {
    seededAt: now,
    version: 3,
    counts: {
      clients: initialClients.length,
      bookings: initialBookings.length,
      projects: initialProjects.length,
      albums: initialAlbums.length,
    },
  };

  await update(ref(rtdb), updates);
}

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setClients([]);
      setBookings([]);
      setProjects([]);
      setAlbums([]);
      return;
    }

    let unsubscribeClients = () => undefined;
    let unsubscribeBookings = () => undefined;
    let unsubscribeProjects = () => undefined;
    let unsubscribeAlbums = () => undefined;

    const setup = async () => {
      try {
        await seedSharedStudioData();
      } catch (error) {
        console.error("Error seeding initial realtime data:", error);
      }

      unsubscribeClients = onValue(ref(rtdb, `${DATA_ROOT}/clients`), (snapshot) => {
        const clientsData = mapCollection<Client>(snapshot.val()).sort((a, b) => a.name.localeCompare(b.name));
        setClients(clientsData);
      });

      unsubscribeBookings = onValue(ref(rtdb, `${DATA_ROOT}/bookings`), (snapshot) => {
        const bookingsData = mapCollection<Booking>(snapshot.val())
          .map((booking) => ({
            ...booking,
            id: Number(booking.id),
          }))
          .sort((a, b) => b.id - a.id);
        setBookings(bookingsData);
      });

      unsubscribeProjects = onValue(ref(rtdb, `${DATA_ROOT}/projects`), (snapshot) => {
        const projectsData = mapCollection<Project>(snapshot.val())
          .map((project) => ({
            ...project,
            id: Number(project.id),
          }))
          .sort((a, b) => b.id - a.id);
        setProjects(projectsData);
      });

      unsubscribeAlbums = onValue(ref(rtdb, `${DATA_ROOT}/albums`), (snapshot) => {
        const albumsData = mapCollection<Album>(snapshot.val())
          .map(normalizeAlbum)
          .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
        setAlbums(albumsData);
      });
    };

    void setup();

    return () => {
      unsubscribeClients();
      unsubscribeBookings();
      unsubscribeProjects();
      unsubscribeAlbums();
    };
  }, [user]);

  const addClient = async (clientData: Omit<Client, "recordId">) => {
    if (!user) return;

    const normalizedClientName = normalizeName(clientData.name);
    const existingClient = clients.find((client) => normalizeName(client.name) === normalizedClientName);
    const now = new Date().toISOString();
    const payload = {
      ...clientData,
      totalSpent: normalizeAmount(clientData.totalSpent),
      updatedAt: now,
    };

    if (existingClient?.recordId) {
      await update(ref(rtdb, `${DATA_ROOT}/clients/${existingClient.recordId}`), payload);
      return;
    }

    const newClientRef = push(ref(rtdb, `${DATA_ROOT}/clients`));
    await set(newClientRef, {
      ...payload,
      createdAt: now,
    });
  };

  const updateClient = async (clientName: string, updates: Partial<Client>) => {
    if (!user) return;

    const matchedClient = clients.find((client) => normalizeName(client.name) === normalizeName(clientName));
    if (!matchedClient?.recordId) {
      return;
    }

    await update(ref(rtdb, `${DATA_ROOT}/clients/${matchedClient.recordId}`), {
      ...updates,
      ...(updates.totalSpent ? { totalSpent: normalizeAmount(updates.totalSpent) } : {}),
      updatedAt: new Date().toISOString(),
    });
  };

  const addBooking = async (bookingData: Omit<Booking, "id" | "recordId">) => {
    if (!user) return;

    const newNumericId = bookings.length ? Math.max(...bookings.map((booking) => booking.id)) + 1 : 1;
    const now = new Date().toISOString();
    const newBookingRef = push(ref(rtdb, `${DATA_ROOT}/bookings`));

    await set(newBookingRef, {
      ...bookingData,
      id: newNumericId,
      createdAt: now,
      updatedAt: now,
    });

    const existingClient = clients.find(
      (client) => normalizeName(client.name) === normalizeName(bookingData.client),
    );

    if (!existingClient) {
      const emailName = bookingData.client.toLowerCase().trim().replace(/\s+/g, ".");
      await addClient({
        name: bookingData.client,
        email: `${emailName}@email.com`,
        phone: "+1 (555) 000-0000",
        sessions: 1,
        totalSpent: normalizeAmount(bookingData.amount),
        lastSession: formatLastSession(bookingData.date),
        status: "new",
      });
      return;
    }

    const currentSpent = parseInt(existingClient.totalSpent.replace(/[^\d]/g, ""), 10) || 0;
    const bookingAmount = parseInt(bookingData.amount.replace(/[^\d]/g, ""), 10) || 0;

    await updateClient(existingClient.name, {
      sessions: existingClient.sessions + 1,
      totalSpent: normalizeAmount(String(currentSpent + bookingAmount)),
      lastSession: formatLastSession(bookingData.date),
      status: existingClient.status === "new" ? "active" : existingClient.status,
    });
  };

  const updateProjectStatus = async (projectId: number, status: ProjectStatus) => {
    if (!user) return;

    const matchedProject = projects.find((project) => project.id === projectId);
    if (!matchedProject?.recordId) {
      return;
    }

    await update(ref(rtdb, `${DATA_ROOT}/projects/${matchedProject.recordId}`), {
      status,
      completion: projectStatusMeta[status].completion,
      timeline: createTimeline(status),
      updatedAt: new Date().toISOString(),
    });
  };

  const createAlbum = async ({
    title,
    clientName,
    photoCount,
    projectId,
  }: {
    title: string;
    clientName: string;
    photoCount: number;
    projectId?: number;
  }) => {
    const now = new Date().toISOString();
    const albumNumber = albums.length + 1001;
    const albumId = `ALB-${albumNumber}`;
    const passcode = `${clientName.split(" ")[0].toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4)}${String(albumNumber).slice(-2)}`;
    const tones = [
      "hsl(262, 52%, 88%)",
      "hsl(210, 70%, 88%)",
      "hsl(162, 48%, 85%)",
      "hsl(18, 85%, 88%)",
      "hsl(210, 60%, 90%)",
    ];

    const photos: AlbumPhoto[] = Array.from({ length: Math.max(1, photoCount) }, (_, index) => ({
      id: `photo-${index + 1}`,
      url: tones[index % tones.length],
      label: `${title} ${String(index + 1).padStart(2, "0")}`,
      selected: false,
    }));

    const newAlbumRef = push(ref(rtdb, `${DATA_ROOT}/albums`));
    await set(newAlbumRef, {
      albumId,
      title,
      clientName,
      projectId: projectId || null,
      passcode,
      cover: tones[0],
      status: "uploaded",
      selectedPhotoIds: [],
      photos,
      createdAt: now,
      updatedAt: now,
    });

    return { albumId, passcode };
  };

  const unlockAlbumByPasscode = (passcode: string) => {
    const normalizedPasscode = passcode.trim().toUpperCase();
    return albums.find((album) => album.passcode.toUpperCase() === normalizedPasscode) || null;
  };

  const toggleAlbumPhotoSelection = async (albumRecordId: string, photoId: string) => {
    const album = albums.find((item) => item.recordId === albumRecordId);
    if (!album) {
      return;
    }

    const nextPhotos = album.photos.map((photo) =>
      photo.id === photoId ? { ...photo, selected: !photo.selected } : photo,
    );
    const selectedPhotoIds = nextPhotos.filter((photo) => photo.selected).map((photo) => photo.id);
    const status: Album["status"] = selectedPhotoIds.length ? "selected" : "selection-in-progress";

    await update(ref(rtdb, `${DATA_ROOT}/albums/${albumRecordId}`), {
      photos: nextPhotos,
      selectedPhotoIds,
      status,
      updatedAt: new Date().toISOString(),
    });
  };

  const startAlbumEditing = async (albumRecordId: string) => {
    const album = albums.find((item) => item.recordId === albumRecordId);
    if (!album) {
      return;
    }

    await update(ref(rtdb, `${DATA_ROOT}/albums/${albumRecordId}`), {
      status: "editing",
      updatedAt: new Date().toISOString(),
    });

    if (album.projectId) {
      await updateProjectStatus(album.projectId, "editing");
    }
  };

  return (
    <DataContext.Provider
      value={{
        clients,
        bookings,
        projects,
        albums,
        addBooking,
        addClient,
        updateClient,
        updateProjectStatus,
        createAlbum,
        unlockAlbumByPasscode,
        toggleAlbumPhotoSelection,
        startAlbumEditing,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
