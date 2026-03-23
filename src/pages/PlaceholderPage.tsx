import { AppLayout } from "@/components/AppLayout";

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="animate-fade-in-up">
    <h1 className="text-2xl font-bold tracking-tight text-foreground" style={{ lineHeight: "1.1" }}>{title}</h1>
    <p className="mt-1 text-sm text-muted-foreground">Coming soon.</p>
  </div>
);

export default PlaceholderPage;
