import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Commons } from '../shared/Commons';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    serviceUrl: string = environment.productBackendEndpoint + '/product'

    constructor(private http: HttpClient) { }


    get(viewFull:boolean) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'view': (viewFull)?'full':'basic',
                Authorization: 'Basic ' + Commons.sessionCredentials()
            })
        }
        return this.http.get<any>(this.serviceUrl, options)
    }

}
