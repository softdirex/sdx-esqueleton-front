import { Company } from "./Company"
import { Owner } from "./Owner"
import { PersonalData } from "./PersonalData"

export class Customer {
    id: number = 0
    avatar: string = ''
    company: Company | null = null
    email: string = ''
    lang: string = ''
    personal_data: PersonalData | null = null
    rol: string = ''
    status: number = 0
    type: string = ''
    owner: Owner | null = null
}