import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { StatsCard } from "@/components/StatsCard";
import { QRScanner } from "@/components/QRScanner";
import { CustomerList } from "@/components/CustomerList";
import { ScanResultModal } from "@/components/ScanResultModal";
import { ScanCounter } from "@/components/ScanCounter";
import { Button } from "@/components/ui/button";
import { Camera, Users, Package, Scan, Keyboard } from "lucide-react";
import { Customer, DeliveryData } from "@/types/delivery";
import { toast } from "sonner";

const Index = () => {
  const [deliveryData, setDeliveryData] = useState<DeliveryData>({
    customers: [],
    totalCustomers: 0,
    totalParcels: 0,
    scannedParcels: 0,
  });
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isManualInputOpen, setIsManualInputOpen] = useState(false);
  const [scanResultOpen, setScanResultOpen] = useState(false);
  const [scannedCustomer, setScannedCustomer] = useState<Customer | null>(null);
  const [currentScanningCustomer, setCurrentScanningCustomer] = useState<Customer | null>(null);

  const handleDataLoaded = (customers: Customer[]) => {
    const totalParcels = customers.reduce((sum, c) => sum + c.parcels, 0);
    setDeliveryData({
      customers,
      totalCustomers: customers.length,
      totalParcels,
      scannedParcels: 0,
    });
  };

  const handleQRScan = (rawCode: string) => {
    const normalize = (s: string) =>
      s?.toString().trim().toLowerCase().replace(/[\s\-_/]/g, "");

    const code = normalize(rawCode);

    const foundCustomer = deliveryData.customers.find((customer) => {
      const wb = normalize(customer.waybillNumber || "");
      const id = normalize(customer.id || "");
      const name = (customer.name || "").toLowerCase().trim();
      return wb === code || id === code || name.includes(rawCode.trim().toLowerCase());
    });

    if (!foundCustomer) {
      toast.error("Waybill Number non trouvé");
      return;
    }

    const updatedCustomers = deliveryData.customers.map((customer) => {
      if (customer.id === foundCustomer.id) {
        const newScannedParcels = Math.min(customer.parcels, (customer.scannedParcels || 0) + 1);
        const isComplete = newScannedParcels >= customer.parcels;
        
        const updatedCustomer = {
          ...customer,
          scanned: isComplete,
          scannedParcels: newScannedParcels,
          scanTime: new Date(),
        };
        
        // Update current scanning customer for the counter display
        setCurrentScanningCustomer(updatedCustomer);
        
        toast.success(
          isComplete 
            ? `${customer.name} - Toutes les pièces scannées!` 
            : `Colis ${newScannedParcels}/${customer.parcels} scanné`
        );
        
        return updatedCustomer;
      }
      return customer;
    });

    const scannedParcels = updatedCustomers.reduce((sum, c) => sum + (c.scannedParcels || 0), 0);

    setDeliveryData({
      ...deliveryData,
      customers: updatedCustomers,
      scannedParcels,
    });

    // Keep scanner open for continuous scanning
    // Only close scanner when all parcels for this customer are scanned
    const updatedCustomer = updatedCustomers.find((c) => c.id === foundCustomer.id);
    if (updatedCustomer && updatedCustomer.scannedParcels === updatedCustomer.parcels) {
      setScannedCustomer(updatedCustomer);
      setScanResultOpen(true);
      setIsScannerOpen(false);
      setIsManualInputOpen(false);
      setCurrentScanningCustomer(null);
    }
    // Scanner stays open for next scan
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ARAMEX Delivery
                </h1>
                <p className="text-sm text-muted-foreground">
                  Gestion des Livraisons
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="lg"
                onClick={() => setIsScannerOpen(true)}
                disabled={deliveryData.customers.length === 0}
                className="gap-2"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">Scanner Code-Barres</span>
                <span className="sm:hidden">Scanner</span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsManualInputOpen(true)}
                disabled={deliveryData.customers.length === 0}
                className="gap-2"
              >
                <Keyboard className="w-4 h-4" />
                <span className="hidden sm:inline">Saisie Manuelle</span>
                <span className="sm:hidden">Saisir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Upload Section */}
          {deliveryData.customers.length === 0 && (
            <div className="max-w-2xl mx-auto">
              <FileUpload onDataLoaded={handleDataLoaded} />
            </div>
          )}

          {/* Stats Section */}
          {deliveryData.customers.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard
                  title="Total Clients"
                  value={deliveryData.totalCustomers}
                  icon={Users}
                />
                <StatsCard
                  title="Total Colis"
                  value={deliveryData.totalParcels}
                  icon={Package}
                  gradient
                />
                <StatsCard
                  title="Colis Scannés"
                  value={deliveryData.scannedParcels}
                  icon={Scan}
                />
              </div>

              {/* Customer List */}
              <CustomerList customers={deliveryData.customers} />

              {/* Reload Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    setDeliveryData({
                      customers: [],
                      totalCustomers: 0,
                      totalParcels: 0,
                      scannedParcels: 0,
                    })
                  }
                >
                  Charger un nouveau fichier
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleQRScan}
      />

      {/* Manual Input Modal */}
      <QRScanner
        isOpen={isManualInputOpen}
        onClose={() => setIsManualInputOpen(false)}
        onScan={handleQRScan}
        manualMode
      />

      {/* Scan Counter - Shows during active scanning */}
      {(isScannerOpen || isManualInputOpen) && currentScanningCustomer && (
        <ScanCounter customer={currentScanningCustomer} />
      )}

      {/* Scan Result Modal */}
      <ScanResultModal
        isOpen={scanResultOpen}
        onClose={() => setScanResultOpen(false)}
        customer={scannedCustomer}
      />
    </div>
  );
};

export default Index;
