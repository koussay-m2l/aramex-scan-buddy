import { useRef } from "react";
import { Upload, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { Customer } from "@/types/delivery";

interface FileUploadProps {
  onDataLoaded: (customers: Customer[]) => void;
}

export const FileUpload = ({ onDataLoaded }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const customers: Customer[] = jsonData.map((row: any, index) => ({
          id: `${index + 1}`,
          name: row.client || row.Client || row.nom || row.Nom || row.name || row.Name || "Client sans nom",
          parcels: parseInt(row.colis || row.Colis || row.parcels || row.Parcels || row.nombre || row.Nombre || "0"),
          scanned: false,
        }));

        if (customers.length === 0) {
          toast.error("Aucune donnée trouvée dans le fichier");
          return;
        }

        onDataLoaded(customers);
        toast.success(`${customers.length} clients chargés avec succès`);
      } catch (error) {
        console.error("Error parsing Excel:", error);
        toast.error("Erreur lors de la lecture du fichier Excel");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Card className="p-8 border-2 border-dashed border-border hover:border-primary transition-all duration-300 cursor-pointer group">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        className="hidden"
      />
      <div
        className="flex flex-col items-center gap-4 text-center"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <FileSpreadsheet className="w-12 h-12 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Importer le fichier Excel</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Glissez votre fichier Excel ici ou cliquez pour sélectionner
          </p>
          <p className="text-xs text-muted-foreground">
            Le fichier doit contenir les colonnes : Client/Nom et Colis/Nombre
          </p>
        </div>
        <Button className="mt-2">
          <Upload className="w-4 h-4 mr-2" />
          Sélectionner un fichier
        </Button>
      </div>
    </Card>
  );
};
