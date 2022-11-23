import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Commons } from '../shared/Commons';

@Injectable({
    providedIn: 'root'
})
export class CompaniesService {
    myCompanyUrl: string = environment.productBackendEndpoint + '/mycompany'

    constructor(private http: HttpClient) { }


    updateConfig(request:any) {
        const url = this.myCompanyUrl + '/config'
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Commons.sessionCredentials()
            })
        }
        return this.http.post<any>(url, request, options)
    }

}
