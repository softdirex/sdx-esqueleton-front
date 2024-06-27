import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { Commons } from "src/app/shared/Commons"
import { environment } from "src/environments/environment"


@Injectable({
    providedIn: 'root'
})
export class InventoryService {
    url: string = environment.productBackendEndpoint + '/inventory'
    urlStores: string = this.url + '/stores'
    urlAreas: string = this.url + '/areas'
    urlItems: string = this.url + '/items'
    urlProviders: string = this.url + '/providers'
    urlUsers: string = this.url + '/users'
    urlHistory: string = this.url + '/history'
    urlReports: string = this.url + '/reports'

    constructor(private http: HttpClient) { }

    getStores(credentials: string, status: string | null, filters: string | null, limit: number | null, page: number | null): any | null {
        let params = (status != null) ? `?status=${status}` : ''
        params = (filters) ? ((params === '') ? `?filters=${filters}` : params + `&filters=${filters}`) : params
        params = (limit) ? ((params === '') ? `?limit=${limit}` : params + `&limit=${limit}`) : params
        params = (page) ? ((params === '') ? `?page=${filters}` : params + `&page=${page}`) : params
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.get<any>(`${this.urlStores}${params}`, options)
    }

    bulkloadDownload(storeId: number, credentials: string) {
        let url = this.urlItems + '/bulkload/' + storeId + '/template'
        const options = {
            headers: new HttpHeaders({
                Authorization: 'Basic ' + credentials
            }),
            responseType: 'blob' as const
        };

        return this.http.get(url, options);
    }

    importExcel(storeId: number, file: File, credentials: string): Observable<any> {
        let url = `${this.urlItems}/bulkload/${storeId}`;
        const formData = new FormData();
        formData.append('attachment', file, file.name);
        const options = {
            headers: new HttpHeaders({
                Authorization: 'Basic ' + credentials
            }),
            responseType: 'json' as const
        };

        return this.http.post(url, formData, options);
    }

    getStore(storeid: number, credentials: string): Observable<any> {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }

        return this.http.get<any>(`${this.urlStores}/${storeid}`, options);
    }

    createStore(store: any, credentials: string) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.post<any>(`${this.urlStores}`, store, options)
    }

    updateStore(store: any, credentials: string) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.put<any>(`${this.urlStores}/${store.id}`, store, options)
    }

    deleteSore(storeId: number, credentials: string) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.delete<any>(`${this.urlStores}/${storeId}`, options)
    }

    updateProvider(provider: any, credentials: string) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.put<any>(`${this.urlProviders}/${provider.id}`, provider, options)
    }

    getProviders(credentials: string, status: string | null, filters: string | null, limit: number | null, page: number | null): any | null {
        let params = (status != null) ? `?status=${status}` : ''
        params = (filters) ? ((params === '') ? `?filters=${filters}` : params + `&filters=${filters}`) : params
        params = (limit) ? ((params === '') ? `?limit=${limit}` : params + `&limit=${limit}`) : params
        params = (page) ? ((params === '') ? `?page=${page}` : params + `&page=${page}`) : params
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.get<any>(`${this.urlProviders}${params}`, options)
    }

    deleteProvider(providerId: number, credentials: string) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.delete<any>(`${this.urlProviders}/${providerId}`, options)
    }

    createProvider(provider: any, credentials: string) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.post<any>(`${this.urlProviders}`, provider, options)
    }

    deleteArea(areaId: number, credentials: string) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.delete<any>(`${this.urlAreas}/${areaId}`, options)
    }

    deleteItem(areaId: number, credentials: string) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.delete<any>(`${this.urlItems}/${areaId}`, options)
    }



    getAreas(credentials: string, filters: string | null, store_id: number | null, area_id: number | null, limit: number | null, page: number | null): any | null {
        let params = (filters != null) ? `?filters=${filters}` : ''
        params = (store_id) ? ((params === '') ? `?store_id=${store_id}` : params + `&store_id=${store_id}`) : params
        params = (area_id) ? ((params === '') ? `?area_id=${area_id}` : params + `&area_id=${area_id}`) : params
        params = (limit) ? ((params === '') ? `?limit=${limit}` : params + `&limit=${limit}`) : params
        params = (page) ? ((params === '') ? `?page=${page}` : params + `&page=${page}`) : params
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.get<any>(`${this.urlAreas}${params}`, options)
    }

    getItems(credentials: string, filters: string | null, store_id: number | null, area_id: number | null, limit: number | null, page: number | null, status: number | null): any | null {
        let params = (filters != null) ? `?filters=${filters}` : ''
        params = (store_id) ? ((params === '') ? `?store_id=${store_id}` : params + `&store_id=${store_id}`) : params
        params = (area_id) ? ((params === '') ? `?area_id=${area_id}` : params + `&area_id=${area_id}`) : params
        params = (limit) ? ((params === '') ? `?limit=${limit}` : params + `&limit=${limit}`) : params
        params = (page) ? ((params === '') ? `?page=${page}` : params + `&page=${page}`) : params
        params = (status) ? ((params === '') ? `?status=${status}` : params + `&status=${status}`) : params
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.get<any>(`${this.urlItems}${params}`, options)
    }

    createArea(area: any, credentials: string, store_id: number | null, area_id: number | null) {
        let params = (store_id) ? `?store_id=${store_id}` : ''
        params = (area_id) ? `?area_id=${area_id}` : params
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.post<any>(`${this.urlAreas}${params}`, area, options)
    }

    getArea(areaid: number, credentials: string) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.get<any>(`${this.urlAreas}/${areaid}`, options);
    }

    updateArea(area: any, credentials: string, storeId: number | null, areaId: number | null) {
        let params = (storeId) ? `?store_id=${storeId}` : ''
        params = (areaId) ? `?area_id=${areaId}` : params
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }

        return this.http.put<any>(`${this.urlAreas}/${area.id}${params}`, area, options);
    }

    createItem(product: FormData, credentials: string, location_id: number): Observable<any> {
        const params = location_id ? `?location_id=${location_id}` : '';
        const options = {
            headers: new HttpHeaders({
                Authorization: 'Basic ' + credentials,
            })
        };
        return this.http.post<any>(`${this.urlItems}${params}`, product, options);
    }

    updateItem(product: FormData, credentials: string) {
        const options = {
            headers: new HttpHeaders({
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.put<any>(`${this.urlItems}/${product.get('id')}`, product, options)
    }

    updateStock(id: number, option: any, quantity: number, note: string, credentials: string) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.get<any>(`${this.urlItems}/${id}/stock/${option == Commons.INCREASE ? 'increase' : 'decrease'}/${quantity}?detail=${note}`, options)
    }

    getUsers(credentials: string, filters: string | null, limit: number | null, page: number | null, status: number | null) {
        let params = (filters != null) ? `?filters=${filters}` : ''
        params = (limit) ? ((params === '') ? `?limit=${limit}` : params + `&limit=${limit}`) : params
        params = (page) ? ((params === '') ? `?page=${page}` : params + `&page=${page}`) : params
        params = (status != null) ? ((params === '') ? `?status=${status}` : params + `&status=${status}`) : params
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.get<any>(`${this.urlUsers}${params}`, options);
    }

    updateUser(user: any, credentials: string) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.put<any>(`${this.urlUsers}/${user.id}`, user, options)
    }

    deleteUser(userId: number, credentials: string) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.delete<any>(`${this.urlUsers}/${userId}`, options)
    }

    getHistory(credentials: string, userId: number, filters: string | null, limit: number | null, page: number | null, status: number | null) {
        let params = (filters != null) ? `?filters=${filters}` : ''
        params = (limit) ? ((params === '') ? `?limit=${limit}` : params + `&limit=${limit}`) : params
        params = (page) ? ((params === '') ? `?page=${page}` : params + `&page=${page}`) : params
        params = (status != null) ? ((params === '') ? `?status=${status}` : params + `&status=${status}`) : params
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.get<any>(`${this.urlHistory}/${userId}${params}`, options);
    }

    getExport(credentials: string, userId: number, formato: string | null) {
        const params = formato ? `export/${formato}` : '';
        const url = `${this.urlHistory}/${userId}/${params}`;
        const options = {
            headers: new HttpHeaders({
                Authorization: 'Basic ' + credentials,
            }),
            responseType: 'blob' as const // Indica que esperamos una respuesta binaria (archivo)
        };

        return this.http.get(url, options);
    }

    getReportsQuote(credentials: string, limit: number | null, page: number | null, status: number | null) {
        let params = (limit != null) ? `?limit=${limit}` : ''
        params = (page) ? ((params === '') ? `?page=${page}` : params + `&page=${page}`) : params
        params = (status != null) ? ((params === '') ? `?status=${status}` : params + `&status=${status}`) : params
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.get<any>(`${this.urlReports}/quote${params}`, options);
    }

    sendQuote(request: any, credentials: string) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.post<any>(`${this.urlItems}/quote/sent`, request, options)
    }

    exportQuote(request: any, type: string, credentials: string): Observable<Blob> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + credentials
        });

        return this.http.post(`${this.urlItems}/quote/download/${type}`, request, { headers, responseType: 'blob' });
    }

    getStoreReport(credentials: string, storeId: number) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.get<any>(`${this.urlItems}/reports/${storeId}`, options);
    }

    getAllStoresReport(credentials: string,limit: number | null, page: number | null) {
        let params = (limit != null) ? `?limit=${limit}` : ''
        params = (page) ? ((params === '') ? `?page=${page}` : params + `&page=${page}`) : params
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.get<any>(`${this.urlItems}/allreports${params}`, options);
    }

    exportReport(storeId:number,request: any, type: string,date:string, credentials: string): Observable<Blob> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + credentials
        });

        return this.http.post(`${this.urlItems}/reports/${storeId}/export/${type}?date=${date}`, request, { headers, responseType: 'blob' });
    }

    printBarcode(credentials:string,size:string,product_name:string,bar_code:string){
        const request = {
            size: size,
            bar_code: bar_code,
            product_name: product_name
        }
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + credentials,
            })
        }
        return this.http.post<any>(`${this.urlItems}/print`, request,options);
    }
}