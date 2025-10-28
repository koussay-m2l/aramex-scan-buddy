export interface Customer {
  id: string;
  waybillNumber: string;
  name: string;
  parcels: number;
  scanned?: boolean;
  scannedParcels?: number;
  scanTime?: Date;
}

export interface DeliveryData {
  customers: Customer[];
  totalCustomers: number;
  totalParcels: number;
  scannedParcels: number;
}
