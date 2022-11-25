import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Commons } from '../shared/Commons';

@Injectable({
    providedIn: 'root'
})
export class OwnerConfigService {
    myCompanyUrl: string = environment.productBackendEndpoint + '/mycompany'

    constructor(private http: HttpClient) { }


    updateConfig(request: any) {
        const url = this.myCompanyUrl + '/config'
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Commons.sessionCredentials()
            })
        }
        return this.http.post<any>(url, request, options)
    }

    getConfig() {
        const url = this.myCompanyUrl + '/config/' + environment.ownerId
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Commons.sessionCredentials()
            })
        }
        return this.http.get<any>(url, options)
    }

    sendContactMail(lang: string, names: string, phone: string, email: string, obs: string, receiver: string) {
        const url = this.myCompanyUrl + '/contact'
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'product-id': environment.productId + ''
            })
        }
        const request = {
            trx: Commons.encryptDataGlobal({
                host: environment.baseUrl,
                lang: lang,
                names: names,
                phone: phone,
                email: email,
                obs: obs,
                receiver: receiver
            })
        }
        return this.http.post<any>(url, request, options)
    }

}
