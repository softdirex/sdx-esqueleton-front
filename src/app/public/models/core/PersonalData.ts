import { ContactData } from "./ContactData"
import { DocumentData } from "./DocumentData"

export class PersonalData {
    id: number = 0
    first_name: string = ''
    last_name: string = ''
    address: string = ''
    city: string = ''
    province_type: string = ''
    province_value: string = ''
    country: string = ''
    sex: number = 0
    birthday: string = ''
    status: number = 0
    created_at: string = ''
    updated_at: string = ''
    document_data: DocumentData[] = []
    contact_data: ContactData[] = []
}