import { ItemsImage } from "./itemsimage"

export class Items {
    id:number = 0
    images: ItemsImage[] = []
    name: string = ''
    description: string = ''
    price: number = 0
    deal: boolean = false
    dealprice: number = 0
    currency:string=''
    sku:string=''
    category:number=0
}