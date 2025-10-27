import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  gradient?: boolean;
}

export const StatsCard = ({ title, value, icon: Icon, gradient }: StatsCardProps) => {
  return (
    <Card
      className={`p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        gradient ? "bg-gradient-to-br from-primary to-primary-dark text-primary-foreground" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${gradient ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
            {title}
          </p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${gradient ? "bg-white/20" : "bg-primary/10"}`}>
          <Icon className={`w-6 h-6 ${gradient ? "text-primary-foreground" : "text-primary"}`} />
        </div>
      </div>
    </Card>
  );
};
