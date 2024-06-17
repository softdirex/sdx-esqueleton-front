export class Product {
  id: number;
  name: string;
  description: string;
  location_desc: string;
  location_id: number;
  category: string;
  image: string;
  price: number;
  init_price: number;
  code: string;
  bar_code: string;
  stock: number;
  stock_min: number;
  stock_max: number;
  due_date: Date;
  status: number;

  constructor(data: any) {
    this.id = data.id || 0;
    this.name = data.name || '';
    this.description = data.description || '';
    this.location_desc = data.location_desc || '';
    this.location_id = data.location_id || 0;
    this.category = data.category || '';
    this.image = data.image || '';
    this.price = data.price || 0;
    this.init_price = data.init_price || 0;
    this.code = data.code || '';
    this.bar_code = data.bar_code || '';
    this.stock = data.stock || 0;
    this.stock_min = data.stock_min || 0;
    this.stock_max = data.stock_max || 0;
    this.due_date = data.due_date || undefined;
    this.status = data.status || 1;
  }
}
