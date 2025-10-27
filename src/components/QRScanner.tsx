import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";

interface QRScannerProps {
  onScan: (code: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const QRScanner = ({ onScan, isOpen, onClose }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (isOpen && !isScanning) {
      startScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isOpen]);

  const startScanning = async () => {
    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScan(decodedText);
          toast.success(`QR Code scanné: ${decodedText}`);
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

  const stopScanning = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
        setIsScanning(false);
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
          <h3 className="text-lg font-semibold">Scanner QR Code</h3>
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
        <div
          id="qr-reader"
          className="w-full rounded-lg overflow-hidden border-2 border-primary"
        ></div>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Placez le QR code dans le cadre pour le scanner
        </p>
      </Card>
    </div>
  );
};
