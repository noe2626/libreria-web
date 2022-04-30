export class Purchase {
  id?: number;
  cantidad: number;
  libro_id: number;
  factura_id: number;
  total: number;
  descuento: number;
}


export class FilterPurchases{
  id?: number;
  libro: string;
  cantidad: number;
  total: number;
  proveedor: string;
  fecha: string;
}
