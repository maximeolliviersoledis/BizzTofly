import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";


@Injectable()
export class OfferService {

    constructor(private http: Http,
                public constService: ConstService) {
    }


   /* getMenuItems() {
        const headers = new Headers();
        let authtoken = localStorage.getItem('token');
        headers.append('Authorization', authtoken);
        return this.http.get(this.constService.base_url + 'api/menuItems/', {
            headers: headers
        })
            .map((data: Response) => data.json() || {})
           // .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }*/

    getAllProducts(customerId = null){
        var urlDir = this.constService.baseDirApiSoledis + this.constService.productsInPromoDir + "/0" + this.constService.keyDir + this.constService.formatDir + this.constService.filterIdCustomer + customerId;
        return this.http.get(urlDir).map((data:Response) => data.json() || {})
    }

    


}
