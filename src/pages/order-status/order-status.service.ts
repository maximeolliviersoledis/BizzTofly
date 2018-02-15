import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";

@Injectable()

export class OrderStatusService {
    constructor(public http: Http, public constService: ConstService) {

    }

    getStatus(orderId) {
        const headers = new Headers();
        let authtoken = localStorage.getItem('token');
        headers.append('Authorization', authtoken);
        return this.http.get(this.constService.base_url + 'api/orders/user/status/' + orderId, {
            headers: headers
        })

            .map((data: Response) => data.json() || {})
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

}
