export class Area {
  name: string;
  area_lvl: number | null;
  area_id: number | null;
  store_id: number | null;
  items: any[];
  subareas: any[];
  status: number | null;
  

  constructor(data: any) {
    this.name = data.name || '';
    this.area_lvl = null;
    this.area_id = null;
    this.store_id = null;
    this.items = data.items || [];
    this.subareas = data.subareas || [];
    this.status = null;
  }
}