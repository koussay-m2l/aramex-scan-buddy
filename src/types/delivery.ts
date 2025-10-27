export interface Customer {
  id: string;
  name: string;
  parcels: number;
  scanned?: boolean;
  scanTime?: Date;
}

export interface DeliveryData {
  customers: Customer[];
  totalCustomers: number;
  totalParcels: number;
  scannedParcels: number;
}
