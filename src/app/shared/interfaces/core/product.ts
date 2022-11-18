import { AppRQ } from "./app-request"

export interface Product {
    id: any
    name: string
    description: string
    logo: string
    access_link: string
    type: any
    html_color: string
    html_color2: string
    html_colorlink: string
    status: any
    created_at: any
    updated_at: any
    benefits:any
    usages:any
    attachments:any
    app:AppRQ|null
    plans:any
}