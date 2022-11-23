import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PublicResourcesService {
    url: string = environment.productBackendEndpoint

    constructor(private http: HttpClient) { }

    getTerms(ownerId:number) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        return this.http.get<any>(this.url + '/mycompany/terms/'+ownerId, options)
    }

}
