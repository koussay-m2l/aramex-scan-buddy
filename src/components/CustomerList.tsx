import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Customer } from "@/types/delivery";
import { CheckCircle2, Package } from "lucide-react";

interface CustomerListProps {
  customers: Customer[];
}

export const CustomerList = ({ customers }: CustomerListProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-primary" />
        Liste des Clients
      </h3>
      <div className="space-y-3">
        {customers.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Aucun client chargé. Importez un fichier Excel pour commencer.
          </p>
        ) : (
          customers.map((customer) => (
            <div
              key={customer.id}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                customer.scanned
                  ? "bg-success/10 border-success"
                  : "bg-card border-border hover:border-primary"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {customer.scanned && (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  )}
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    {customer.scanTime && (
                      <p className="text-xs text-muted-foreground">
                        Scanné à {customer.scanTime.toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant={customer.scanned ? "default" : "secondary"}>
                  {customer.parcels} colis
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
