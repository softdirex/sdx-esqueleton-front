import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Commons } from '../shared/Commons';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    storageUrl: string = environment.productBackendEndpoint + '/storage'

    constructor(private http: HttpClient) { }

    getImage(fileName: string) {
        const options = {
            headers: new HttpHeaders({
                'Accept': 'image/webp,*/*',
                Authorization: 'Basic ' + Commons.sessionCredentials()
            }),
            responseType: 'blob' as 'json'
        }
        return this.http.get<Blob>(this.storageUrl + '?filename=' + fileName, options)
    }

    getProductImage(fileName: string) {
        const options = {
            headers: new HttpHeaders({
                'Accept': 'image/webp,*/*'
            }),
            responseType: 'blob' as 'json'
        }
        return this.http.get<Blob>(this.storageUrl + '/product?filename=' + fileName, options)
    }

}
