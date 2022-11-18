import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Commons } from '../shared/Commons';

@Injectable({
    providedIn: 'root'
})
export class LicencesService {
    licencesUrl: string = environment.coreBackendEndpoint + '/licences'
    mylicencesUrl: string = environment.coreBackendEndpoint + '/mylicences'

    constructor(private http: HttpClient) { }

    getIndexMyLicence(status: number | null, page: number, limit: number, filters: string | null) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Commons.sessionCredentials(),
                'view': 'basic'
            })
        }
        var params = '?'
        if (status != null) {
            params = params + 'status=' + status + '&'
        }
        params = params + 'page=' + page + '&limit=' + limit
        if (filters != null) {
            params = params + '&filters=' + filters

        }
        // add slash to avoid block by cors
        return this.http.get<any>(this.mylicencesUrl + '/' + params, options)
    }

    getIndexFullMyLicence(status: number | null, page: number, limit: number, filters: string | null) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Commons.sessionCredentials(),
                'view': 'full'
            })
        }
        var params = '?'
        if (status != null) {
            params = params + 'status=' + status + '&'
        }
        params = params + 'page=' + page + '&limit=' + limit
        if (filters != null) {
            params = params + '&filters=' + filters

        }
        // add slash to avoid block by cors
        return this.http.get<any>(this.mylicencesUrl + '/' + params, options)
    }

    getIndexFullLicence(status: number | null, page: number, limit: number, filters: string | null) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Commons.sessionCredentials(),
                'view': 'full'
            })
        }
        var params = '?'
        if (status != null) {
            params = params + 'status=' + status + '&'
        }
        params = params + 'page=' + page + '&limit=' + limit
        if (filters != null) {
            params = params + '&filters=' + filters

        }
        // add slash to avoid block by cors
        return this.http.get<any>(this.licencesUrl + '/' + params, options)
    }

    getFullLicence(resourceId: number) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Commons.sessionCredentials(),
                'view': 'full'
            })
        }
        // add slash to avoid block by cors
        return this.http.get<any>(this.licencesUrl + '/' + resourceId, options)
    }

    delete(resourceId: number) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Commons.sessionCredentials()
            })
        }
        return this.http.delete<any>(this.licencesUrl + '/' + resourceId, options)
    }

    deleteMyLicence(resourceId: number) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Commons.sessionCredentials()
            })
        }
        return this.http.delete<any>(this.mylicencesUrl + '/' + resourceId, options)
    }

    getLicenceDetailHistory(statusString: string | null, page: number, limit: number,filters:any) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Commons.sessionCredentials()
            })
        }
        var params = '?'
        if (statusString != null) {
            params = params + 'status=' + statusString + '&'
        }
        params = params + 'page=' + page + '&limit=' + limit
        if (filters != null) {
            params = params + '&filters=' + filters

        }
        return this.http.get<any>(this.licencesUrl + '/detail/history/' + params, options)
    }

    getMyLicenceDetailHistory(page: number, limit: number) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Commons.sessionCredentials()
            })
        }
        var params = '?page=' + page + '&limit=' + limit
        return this.http.get<any>(this.mylicencesUrl + '/detail/history/' + params, options)
    }

}
