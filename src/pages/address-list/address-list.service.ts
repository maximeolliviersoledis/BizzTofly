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


    getAddressList():Observable<Address[]> {
         const headers = new Headers();
         let authtoken = localStorage.getItem('token');
         headers.append('Authorization', authtoken);
        return this.http.get(this.constService.base_url+'api/addresses/user', {
            headers: headers
        })
            .map((data: Response)=> data.json()|| {})
          // .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
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
    }
 

 

   
    
}