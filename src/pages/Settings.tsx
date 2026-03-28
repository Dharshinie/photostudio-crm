import { Bell, Camera, Globe, Lock, Palette, Save, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "studio", label: "Studio", icon: Camera },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "appearance", label: "Appearance", icon: Palette },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight text-foreground" style={{ lineHeight: "1.1" }}>
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account and studio preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <nav className="flex lg:flex-col gap-1 lg:w-52 shrink-0 overflow-x-auto animate-fade-in-up" style={{ animationDelay: "80ms" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "glass bg-primary/10 text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4 shrink-0" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "studio" && <StudioSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "appearance" && <AppearanceSettings />}
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <div className="card-soft p-6 space-y-6 animate-fade-in-up" style={{ animationDelay: "160ms" }}>
      <div>
        <h2 className="text-base font-semibold text-foreground">Personal Information</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Update your profile details and photo.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">
          AS
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Admin</p>
          <p className="text-xs text-muted-foreground">Admin@studiocrm.com</p>
          <button className="text-xs text-primary font-medium mt-1 hover:underline">Change photo</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">First Name</label>
          <Input defaultValue="Admin" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Name</label>
          <Input defaultValue="" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</label>
          <Input defaultValue="Admin@studiocrm.com" type="email" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</label>
          <Input defaultValue="+1 (415) 867-5309" type="tel" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bio</label>
        <textarea
          defaultValue="Professional photographer specializing in weddings, portraits, and commercial work. Based in San Francisco."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px] resize-none"
        />
      </div>

      <div className="flex justify-end">
        <Button className="gap-2">
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </div>
    </div>
  );
}

function StudioSettings() {
  return (
    <div className="card-soft p-6 space-y-6 animate-fade-in-up" style={{ animationDelay: "160ms" }}>
      <div>
        <h2 className="text-base font-semibold text-foreground">Studio Details</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Configure your studio information and branding.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Studio Name</label>
          <Input defaultValue="Bloom Studios" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Website</label>
          <div className="flex items-center gap-0">
            <span className="flex h-10 items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
              <Globe className="h-3.5 w-3.5" />
            </span>
            <Input defaultValue="Bloomphotography.com" className="rounded-l-none" />
          </div>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Address</label>
          <Input defaultValue="782 Valencia St,ooty" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Default Session Rate</label>
          <Input defaultValue="Rs.10000" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tax ID</label>
          <Input defaultValue="••••••7842" />
        </div>
      </div>
      <div className="flex justify-end">
        <Button className="gap-2"><Save className="h-4 w-4" /> Save Changes</Button>
      </div>
    </div>
  );
}

function NotificationSettings() {
  const prefs = [
    { label: "New booking requests", description: "Get notified when a client requests a session", enabled: true },
    { label: "Booking confirmations", description: "When a pending booking is confirmed", enabled: true },
    { label: "Client messages", description: "Direct messages from clients", enabled: true },
    { label: "Gallery downloads", description: "When a client downloads their gallery", enabled: false },
    { label: "Review alerts", description: "New reviews and ratings", enabled: true },
    { label: "Storage warnings", description: "When cloud storage usage is high", enabled: false },
  ];

  const [items, setItems] = useState(prefs);
  const toggle = (i: number) => setItems((prev) => prev.map((p, idx) => idx === i ? { ...p, enabled: !p.enabled } : p));

  return (
    <div className="card-soft p-6 space-y-6 animate-fade-in-up" style={{ animationDelay: "160ms" }}>
      <div>
        <h2 className="text-base font-semibold text-foreground">Notification Preferences</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Choose what you'd like to be notified about.</p>
      </div>
      <div className="space-y-1">
        {items.map((pref, i) => (
          <div key={pref.label} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
            <div>
              <p className="text-sm font-medium text-foreground">{pref.label}</p>
              <p className="text-xs text-muted-foreground">{pref.description}</p>
            </div>
            <button
              onClick={() => toggle(i)}
              className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${pref.enabled ? "bg-primary" : "bg-muted"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  pref.enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="card-soft p-6 space-y-6 animate-fade-in-up" style={{ animationDelay: "160ms" }}>
      <div>
        <h2 className="text-base font-semibold text-foreground">Security</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Manage your password and security preferences.</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Current Password</label>
          <Input type="password" placeholder="Enter current password" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">New Password</label>
            <Input type="password" placeholder="Enter new password" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Confirm Password</label>
            <Input type="password" placeholder="Confirm new password" />
          </div>
        </div>
      </div>
      <div className="p-4 rounded-xl bg-muted/50 border border-border/40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
            <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
          </div>
          <Button variant="outline" size="sm" className="text-xs">Enable</Button>
        </div>
      </div>
      <div className="flex justify-end">
        <Button className="gap-2"><Save className="h-4 w-4" /> Update Password</Button>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  return (
    <div className="card-soft p-6 space-y-6 animate-fade-in-up" style={{ animationDelay: "160ms" }}>
      <div>
        <h2 className="text-base font-semibold text-foreground">Appearance</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Customize the look and feel of your dashboard.</p>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground mb-3">Theme</p>
        <div className="flex gap-3">
          {[
            { label: "Light", active: true, bg: "bg-white border-primary", dot: "bg-primary" },
            { label: "Dark", active: false, bg: "bg-foreground/90", dot: "bg-muted" },
            { label: "System", active: false, bg: "bg-gradient-to-r from-white to-foreground/80", dot: "bg-muted-foreground" },
          ].map((theme) => (
            <button
              key={theme.label}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                theme.active ? "border-primary" : "border-border hover:border-muted-foreground/40"
              }`}
            >
              <div className={`h-12 w-20 rounded-lg ${theme.bg} border border-border/40`} />
              <span className="text-xs font-medium text-foreground">{theme.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground mb-3">Accent Color</p>
        <div className="flex gap-2">
          {[
            { color: "bg-lavender", active: true },
            { color: "bg-mint", active: false },
            { color: "bg-peach", active: false },
            { color: "bg-sky", active: false },
          ].map((c, i) => (
            <button
              key={i}
              className={`h-8 w-8 rounded-full ${c.color} transition-transform hover:scale-110 ${
                c.active ? "ring-2 ring-offset-2 ring-primary" : ""
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
