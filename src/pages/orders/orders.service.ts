import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";


@Injectable()
export class OrdersService {

    constructor(private http: Http,
                public constService: ConstService) {
    }


    /*getOrders() {
        const headers = new Headers();
        let authtoken = localStorage.getItem('token');
        headers.append('Authorization', authtoken);
        return this.http.get(this.constService.base_url + 'api/orders/user/allorders', {
            headers: headers
        })
            .map((data: Response) => data.json() || {})
          //  .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }*/

    getOrders(customerId) {
        const headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.orderDir + this.constService.keyDir + this.constService.formatDir + this.constService.filterIdCustomer + customerId + this.constService.sortIdDesc;
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response) => data.json() || {})
    }

    getOrderById(orderId){
        const headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.orderDir + "/" + orderId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response) => data.json() || {})
    }
}
