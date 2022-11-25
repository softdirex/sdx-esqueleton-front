import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Commons } from '../shared/Commons';
import { CustomerRequest } from '../shared/interfaces/core/customer-request';
import { ServiceResponse } from '../shared/interfaces/core/service-response';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  myCustomerLoginUrl: string = environment.productBackendEndpoint + '/customers/login/'
  customersUrl: string = environment.productBackendEndpoint + '/customers'

  constructor(private http: HttpClient) { }

  sendPasswordRecoveryRequest(email: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'product-id': environment.productId + ''
      })
    }
    return this.http.get<ServiceResponse>(this.customersUrl + '/changepassword/' + email, options)
  }

  postCustomerSigned(flow: string, id: number, lang: string, sign: string, pwd: string | null) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'product-id': environment.productId + ''
      })
    }
    var request
    if (pwd != null) {
      request = {
        flow: flow,
        id: id,
        lang: lang,
        sign: sign,
        pwd: pwd
      }
    } else {
      request = {
        flow: flow,
        id: id,
        lang: lang,
        sign: sign
      }
    }

    return this.http.post<any>(this.customersUrl + '/verify', request, options)
  }

  loginCustomer(email: string, credentials: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + credentials,
        'product-id': environment.productId + '',
        'owner-id': environment.ownerId + ''
      })
    }
    return this.http.get<any>(this.myCustomerLoginUrl + email, options)
  }

  registerCustomer(body: CustomerRequest) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post<any>(this.customersUrl + '/register', body, options)
  }

  getBasicPersonalData(type: string, value: string, country: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'product-id': environment.productId + ''
      })
    }
    return this.http.get<any>(this.customersUrl + '/basic/' + type + '/' + value + '/' + country, options)
  }

  getIndexFull(type: string, status: number, page: number, limit: number, filters: string | null) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'view': 'full',
        Authorization: 'Basic ' + Commons.sessionCredentials(),
        'product-id': environment.productId + ''
      })
    }
    if (filters != null) {
      return this.http.get<any>(this.customersUrl + '?status=' + status + '&type=' + type + '&page=' + page + '&limit=' + limit + '&filters=' + filters, options)
    } else {
      return this.http.get<any>(this.customersUrl + '?status=' + status + '&type=' + type + '&page=' + page + '&limit=' + limit, options)
    }
  }

  get(customerId: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Commons.sessionCredentials(),
        'product-id': environment.productId + ''
      })
    }
    return this.http.get<any>(this.customersUrl + '/' + customerId, options)
  }

  getMyCustomer() {
    const customerId = Commons.sessionObject().customer.id
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Commons.sessionCredentials(),
        'product-id': environment.productId + ''
      })
    }
    return this.http.get<any>(this.customersUrl + '/myprofile/' + customerId, options)
  }

  store(request: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Commons.sessionCredentials(),
        'product-id': environment.productId + ''
      })
    }
    return this.http.post<any>(this.customersUrl, request, options)
  }

  update(itemId: number, request: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Commons.sessionCredentials(),
        'product-id': environment.productId + ''
      })
    }
    return this.http.put<any>(this.customersUrl + '/' + itemId, request, options)
  }

  updateMyCustomer(itemId: number, request: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Commons.sessionCredentials(),
        'product-id': environment.productId + ''
      })
    }
    return this.http.put<any>(this.customersUrl + '/updateprofile/' + itemId, request, options)
  }

}
