export class Store {
  name: string;
  address: string;
  description: string;
  areas: any[];
  status: number | null;

  constructor(data: any) {
    this.name = data.name || '';
    this.address = data.address || '';
    this.description = data.description || '';
    this.areas = data.areas || [];
    this.status = null;
  }
}