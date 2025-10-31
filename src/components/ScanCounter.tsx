import { Package } from "lucide-react";
import { Customer } from "@/types/delivery";

interface ScanCounterProps {
  customer: Customer | null;
}

export const ScanCounter = ({ customer }: ScanCounterProps) => {
  if (!customer) return null;

  const scanned = customer.scannedParcels || 0;
  const total = customer.parcels;
  const progress = (scanned / total) * 100;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4">
      <div className="bg-card border-2 border-primary shadow-2xl rounded-2xl p-6 min-w-[280px]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Scan en cours</p>
            <p className="font-semibold">{customer.name}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Progression</span>
            <span className="text-2xl font-bold text-primary">
              {scanned}/{total}
            </span>
          </div>
          
          <div className="relative h-3 bg-secondary/20 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {scanned < total && (
            <p className="text-xs text-center text-muted-foreground animate-pulse">
              Scannez le prochain colis...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
