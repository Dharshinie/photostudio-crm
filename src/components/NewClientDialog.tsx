import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/contexts/DataContext";

export function NewClientDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    sessions: "0",
    totalSpent: "Rs.0",
    lastSession: "New",
    status: "new" as "active" | "inactive" | "new",
  });
  const { addClient } = useData();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addClient({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      sessions: Number(formData.sessions) || 0,
      totalSpent: formData.totalSpent,
      lastSession: formData.lastSession,
      status: formData.status,
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      sessions: "0",
      totalSpent: "Rs.0",
      lastSession: "New",
      status: "new",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>Create a client record and save it directly to Firebase.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="sessions">Sessions</Label>
              <Input id="sessions" name="sessions" type="number" min="0" value={formData.sessions} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalSpent">Total Spent</Label>
              <Input id="totalSpent" name="totalSpent" value={formData.totalSpent} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastSession">Last Session</Label>
              <Input id="lastSession" name="lastSession" value={formData.lastSession} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value: "active" | "inactive" | "new") => setFormData((prev) => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Client</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
