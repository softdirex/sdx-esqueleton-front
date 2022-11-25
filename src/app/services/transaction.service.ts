import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Commons } from '../shared/Commons';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  apiCoreMyLicencesUrl: string = environment.productBackendEndpoint + '/mycompany/licence'

  constructor(private http: HttpClient) { }

  postMyLicence(planId: any, companyId: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Commons.sessionCredentials()
      })
    }
    var request = {
      plan: { id: planId },
      company: { id: companyId },
      status: 2
    }

    return this.http.post<any>(this.apiCoreMyLicencesUrl, request, options)
  }
}
