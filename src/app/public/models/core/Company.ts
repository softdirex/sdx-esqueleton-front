import { ContactData } from "./ContactData"
import { DocumentData } from "./DocumentData"

export class Company {
    id: number = 0
    doc_number: string = ''
    name: string = ''
    description: string = ''
    logo: string = ''
    commercial_business: string = ''
    phone1: string = ''
    phone2: string = ''
    email: string = ''
    web: string = ''
    address: string = ''
    city: string = ''
    province_type: string = ''
    province_value: string = ''
    country: string = ''
    status: number = 0
    created_at: string = ''
    updated_at: string = ''
}