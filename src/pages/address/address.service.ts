import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";


@Injectable()
export class AddressService {

    constructor(private http: Http,
                public constService:ConstService) {
    }


    addAddress(body) {
        console.log("body-"+body);
         const headers = new Headers();
         headers.append('Content-Type', 'application/json');
         let authtoken = localStorage.getItem('token');
         headers.append('Authorization', authtoken);
        return this.http.post(this.constService.base_url+'api/addresses/',body, {
            headers: headers
        })
            .map((data: Response)=> data.json()|| {})
          // .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    updateAddress(addressId,address){
         console.log("addressId-"+addressId);
         const body =address;
         console.log("body-"+JSON.stringify(body));
         const headers = new Headers();
         headers.append('Content-Type', 'application/json');
         let authtoken = localStorage.getItem('token');
         headers.append('Authorization', authtoken);
        return this.http.put(this.constService.base_url+'api/addresses/'+addressId+'/',body, {
            headers: headers
        })
            .map((data: Response)=> data.json()|| {})
          // .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getAddressById(addressId){
       console.log("addressId-"+addressId);
         const headers = new Headers();
         let authtoken = localStorage.getItem('token');
         headers.append('Authorization', authtoken);
        return this.http.get(this.constService.base_url+'api/addresses/'+ addressId, {
            headers: headers
        })
            .map((data: Response)=> data.json()|| {})
           //.catch((error:any) => Observable.throw(error.json().error || 'Server error')); 
    }
 

 

   
    
}