import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Commons } from '../shared/Commons';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    storageUrl: string = environment.coreBackendEndpoint + '/storage'

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

    getDocument(fileName: string) {
        const options = {
            headers: new HttpHeaders({
                'Accept': '*/*',
                Authorization: 'Basic ' + Commons.sessionCredentials()
            }),
            responseType: 'blob' as 'json'
        }
        return this.http.get<Blob>(this.storageUrl + '?filename=' + fileName, options)
    }

    attachFile(fileToUpload: File){
        var data = new FormData();
        data.append('attachment', fileToUpload);
        const sessionObject = Commons.sessionObject()
        const customerSign = {id:sessionObject.customer.id}
        const sign = Commons.encryptDataGlobal(customerSign)

        const options = {
            headers: new HttpHeaders({
                'Accept': 'image/webp,*/*',
                'sign': sign,
                Authorization: 'Basic ' + Commons.sessionCredentials()
            }),
        }
        
        return this.http.post<any>(this.storageUrl, data, options)
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
