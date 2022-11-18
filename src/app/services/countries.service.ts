import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CountriesService {
    countriesUrl: string = environment.coreBackendEndpoint + '/countries/'

    constructor(private http: HttpClient) { }

    getCountries(name: string) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        return this.http.get<any>(this.countriesUrl + 'name/' + name, options)
    }

    getAllCountries() {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        return this.http.get<any>(this.countriesUrl + '?page=1&limit=500', options)
    }

}
