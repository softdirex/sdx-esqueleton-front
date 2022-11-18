import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Commons } from '../shared/Commons';

@Injectable({
    providedIn: 'root'
})
export class CompaniesService {
    companiesUrl: string = environment.coreBackendEndpoint + '/companies'
    myCompanyUrl: string = environment.coreBackendEndpoint + '/mycompany'

    constructor(private http: HttpClient) { }

    getIndexBasic(status: number, page: number, limit: number, filters: string | null) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Commons.sessionCredentials()
            })
        }
        if (filters != null) {
            return this.http.get<any>(this.companiesUrl + '?status=' + status + '&page=' + page + '&limit=' + limit + '&filters=' + filters, options)
        } else {
            return this.http.get<any>(this.companiesUrl + '?status=' + status + '&page=' + page + '&limit=' + limit, options)
        }
    }

    getIndexFull(status: number, page: number, limit: number, filters: string | null) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'view': 'full',
                Authorization: 'Basic ' + Commons.sessionCredentials()
            })
        }
        if (filters != null) {
            return this.http.get<any>(this.companiesUrl + '?status=' + status + '&page=' + page + '&limit=' + limit + '&filters=' + filters, options)
        } else {
            return this.http.get<any>(this.companiesUrl + '?status=' + status + '&page=' + page + '&limit=' + limit, options)
        }
    }

    getFull(companyId: number) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'view':'full',
                Authorization: 'Basic ' + Commons.sessionCredentials()
            })
        }
        return this.http.get<any>(this.companiesUrl + '/' + companyId, options)
    }

    getBasic(companyId: number) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Commons.sessionCredentials()
            })
        }
        return this.http.get<any>(this.companiesUrl + '/' + companyId, options)
    }

    store(request:any) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Commons.sessionCredentials()
            })
        }
        return this.http.post<any>(this.companiesUrl, request, options)
    }

    myCompanyStore(request:any) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Commons.sessionCredentials()
            })
        }
        return this.http.post<any>(this.myCompanyUrl, request, options)
    }

    update(companyId: number,request:any) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Commons.sessionCredentials()
            })
        }
        return this.http.put<any>(this.companiesUrl + '/' + companyId, request, options)
    }

    myCompanyUpdate(companyId: number,request:any) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Commons.sessionCredentials()
            })
        }
        return this.http.put<any>(this.myCompanyUrl + '/' + companyId, request, options)
    }

    delete(companyId: number) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Commons.sessionCredentials()
            })
        }
        return this.http.delete<any>(this.companiesUrl + '/' + companyId, options)
    }

    myCompanyRequestMember(companyId: number) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + Commons.sessionCredentials()
            })
        }
        return this.http.get<any>(this.myCompanyUrl + '/' + companyId + '/members/request', options)
    }

}
