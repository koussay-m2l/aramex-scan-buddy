import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Keyboard } from "lucide-react";
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";
import { useSunmiScanner } from "@/hooks/useSunmiScanner";

interface QRScannerProps {
  onScan: (code: string) => void;
  isOpen: boolean;
  onClose: () => void;
  manualMode?: boolean;
}

export const QRScanner = ({ onScan, isOpen, onClose, manualMode = false }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isSunmiDevice = Capacitor.getPlatform() === 'android';
  
  // Use Sunmi scanner when on Sunmi device and not in manual mode
  const handleSunmiScan = (code: string) => {
    onScan(code);
    toast.success(`Code-barres scanné: ${code}`);
    onClose();
  };
  
  useSunmiScanner(handleSunmiScan, isOpen && !manualMode && isSunmiDevice);

  useEffect(() => {
    // Only use camera scanner on non-Sunmi devices
    if (isOpen && !manualMode && !isScanning && !isSunmiDevice) {
      startScanning();
    }

    return () => {
      if (!isSunmiDevice) {
        stopScanning();
      }
    };
  }, [isOpen, manualMode, isSunmiDevice]);

  const startScanning = async () => {
    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 150 },
        },
        (decodedText) => {
          onScan(decodedText);
          toast.success(`Code-barres scanné: ${decodedText}`);
          stopScanning();
          onClose();
        },
        (error) => {
          // Ignore errors during scanning
        }
      );

      setIsScanning(true);
    } catch (error) {
      console.error("Error starting scanner:", error);
      toast.error("Impossible d'accéder à la caméra");
    }
  };

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      toast.success(`Code saisi: ${manualCode.trim()}`);
      setManualCode("");
      onClose();
    } else {
      toast.error("Veuillez entrer un code");
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {manualMode ? "Saisie Manuelle" : "Scanner Code-Barres"}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              stopScanning();
              onClose();
            }}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {manualMode ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Entrez le numéro de Waybill
            </p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Waybill Number"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
                className="flex-1"
                autoFocus
              />
              <Button onClick={handleManualSubmit}>
                Valider
              </Button>
            </div>
          </div>
        ) : isSunmiDevice ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-3xl">📱</span>
              </div>
              <p className="text-lg font-semibold text-center mb-2">
                Scanner Prêt
              </p>
              <p className="text-sm text-muted-foreground text-center">
                Utilisez le bouton de scan du terminal Sunmi
              </p>
            </div>
          </div>
        ) : (
          <>
            <div
              id="qr-reader"
              className="w-full rounded-lg overflow-hidden border-2 border-primary"
            ></div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Placez le code-barres dans le cadre pour le scanner
            </p>
          </>
        )}
      </Card>
    </div>
  );
};
