import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";
import { Address } from './address.model';

@Injectable()
export class AddressListService {

    constructor(private http: Http,
                public constService:ConstService) {
    }

    getAddressList(customerId){
        //http://www.bizztofly.com/api/addresses?ws_key=P67RDX29JM5ITD4JA5A56GZJSIXGXBKL&output_format=JSON&filter[id_customer]=55&filter[deleted]=0
        var urlDir = this.constService.baseDir+this.constService.adresses+this.constService.keyDir+this.constService.formatDir+this.constService.filterIdCustomer+customerId+this.constService.filterDeleted+"0";
        const headers = new Headers();
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response) => data.json()|| {})
    }

    getAddress(addressId){
        var urlDir = this.constService.baseDir + this.constService.adresses + "/" + addressId + this.constService.keyDir + this.constService.formatDir;
        const headers = new Headers();
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response) => data.json() || {})
    }

    deleteAddress(addressId){
        var urlDir = this.constService.baseDir + this.constService.adresses + "/" + addressId + this.constService.keyDir + this.constService.formatDir;
        const headers = new Headers();
        return this.http.delete(urlDir, {
            headers: headers
        })
    }

    putCart(cartId, body){
        const headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.cartDir + "/" + cartId + this.constService.keyDir + this.constService.formatDir;
        return this.http.put(urlDir, body, {
            headers: headers
        }).map((data: Response) => data.json() || {})
     }


   /* getAddressList():Observable<Address[]> {
         const headers = new Headers();
         let authtoken = localStorage.getItem('token');
         headers.append('Authorization', authtoken);
        return this.http.get(this.constService.base_url+'api/addresses/user', {
            headers: headers
        })
            .map((data: Response)=> data.json()|| {})
          // .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }*/

   /* getAddress(){
        //Exemple url pour récupérer les adresses liées à un client
    }

     getAvailablePincodes() {
         const headers = new Headers();
         let authtoken = localStorage.getItem('token');
         headers.append('Authorization', authtoken);
        return this.http.get(this.constService.base_url+'api/pincodes', {
            headers: headers
        })
            .map((data: Response)=> data.json()|| {})
          // .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getLoyaltyStatus() {
         const headers = new Headers();
         let authtoken = localStorage.getItem('token');
         headers.append('Authorization', authtoken);
        return this.http.get(this.constService.base_url+'api/settings', {
            headers: headers
        })
            .map((data: Response)=> data.json()|| {})
          // .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }*/
 

 

   
    
}