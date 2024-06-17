import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CdkService {

    cdkUrl: string = environment.productBackendEndpoint + '/trx'

    constructor(private http: HttpClient) { }

    async getTrxDec(trx: string): Promise<any | null> {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'trx': trx
            })
        };

        try {
            const response = await lastValueFrom(this.http.get<any>(this.cdkUrl, options));
            if (response && response.trxDec) {
                return response.trxDec; // Retorna el cuerpo de la respuesta si es un httpStatus 200
            } else {
                return null; // Si no es 200, retorna null
            }
        } catch (error) {
            console.error('Error en la solicitud de getTrxDec:', error);
            return null; // Retorna null en caso de error
        }
    }

    async postTrxEnc(request: any): Promise<any | null> {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        try {
            const response = await lastValueFrom(this.http.post<any>(this.cdkUrl, request, options));
            if (response && response.trxEnc) {
                return response.trxEnc; // Retorna el cuerpo de la respuesta si es un httpStatus 200
            } else {
                return null; // Si no es 200, retorna null
            }
        } catch (error) {
            console.error('Error en la solicitud de postTrxEnc:', error);
            return null; // Retorna null en caso de error
        }
    }
}