import { Licence } from "./licence"

export interface Transaction {
    id: any
    amount: string
    buy_order: any
    status: any
    transaction_date: any
    type: number
    billing_file_path: any
    licence: Licence
}