export class Provider {
    phone: string;
    email: string;
    name: string;
    doc_number: string;
    company_core_id: number;
    status: number | null;
    country: string;


    constructor(data: any) {
        this.phone = data.phone || '';
        this.email = data.email || '';
        this.name = data.name || '';
        this.country = data.country || '';
        this.doc_number = data.doc_number || '';
        this.company_core_id = data.company_core_id || 0;
        this.status = null;
    }
}