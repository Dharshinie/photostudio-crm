import { useState } from "react";
import { Plus } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formatAmount = (value: string) => {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) {
    return "";
  }

  return `Rs.${Number(digits).toLocaleString("en-IN")}`;
};

export const NewBookingDialog = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    client: "",
    type: "",
    date: "",
    time: "",
    location: "",
    amount: "",
  });
  const { addBooking } = useData();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.client || !formData.type || !formData.date || !formData.time || !formData.location || !formData.amount) {
      return;
    }

    await addBooking({
      client: formData.client.trim(),
      type: formData.type,
      date: formData.date.trim(),
      time: formData.time.trim(),
      location: formData.location.trim(),
      status: "pending",
      amount: formatAmount(formData.amount),
    });

    setFormData({
      client: "",
      type: "",
      date: "",
      time: "",
      location: "",
      amount: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Booking</DialogTitle>
          <DialogDescription>
            Add a new booking session. If the client doesn&apos;t exist, they&apos;ll be added to your client list in Firebase.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client">Client Name</Label>
            <Input
              id="client"
              name="client"
              type="text"
              placeholder="Enter client name"
              value={formData.client}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Session Type</Label>
            <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select session type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Wedding">Wedding</SelectItem>
                <SelectItem value="Portrait Session">Portrait Session</SelectItem>
                <SelectItem value="Product Shoot">Product Shoot</SelectItem>
                <SelectItem value="Corporate Event">Corporate Event</SelectItem>
                <SelectItem value="Family Portrait">Family Portrait</SelectItem>
                <SelectItem value="Headshots">Headshots</SelectItem>
                <SelectItem value="Event">Event</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="text"
                placeholder="e.g., Apr 15, 2026"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                type="text"
                placeholder="e.g., 2:00 PM"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              type="text"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="text"
              placeholder="e.g., Rs.500"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Booking</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
