import { PersonalData } from "./personal-data";

export interface CustomerRequest {
    lang: string
    email: string
    status: any
    personal_data: any
    type: any
    rol: any
    password: string,
    avatar: string
}
