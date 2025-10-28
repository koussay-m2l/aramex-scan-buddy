import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Customer } from "@/types/delivery";
import { CheckCircle2, Package, User, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ScanResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export const ScanResultModal = ({ isOpen, onClose, customer }: ScanResultModalProps) => {
  if (!customer) return null;

  const remainingPieces = customer.parcels - (customer.scannedParcels || 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {customer.scanned ? (
              <CheckCircle2 className="w-5 h-5 text-success" />
            ) : (
              <AlertCircle className="w-5 h-5 text-warning" />
            )}
            Résultat du Scan
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
            <User className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Receiver Name</p>
              <p className="font-semibold text-lg">{customer.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg">
            <Package className="w-5 h-5 text-secondary" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Waybill Number</p>
              <p className="font-medium">{customer.waybillNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-card border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Pieces</p>
              <p className="text-2xl font-bold">{customer.parcels}</p>
            </div>
            
            <div className="p-4 bg-card border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Pieces Scannées</p>
              <p className="text-2xl font-bold text-success">{customer.scannedParcels || 0}</p>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Pieces Manquantes</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-warning">{remainingPieces}</p>
              <Badge variant={remainingPieces === 0 ? "default" : "secondary"} className="text-lg px-3 py-1">
                {remainingPieces === 0 ? "Complet ✓" : `${remainingPieces} restantes`}
              </Badge>
            </div>
          </div>

          {customer.scanTime && (
            <p className="text-xs text-center text-muted-foreground">
              Dernier scan : {customer.scanTime.toLocaleString()}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
