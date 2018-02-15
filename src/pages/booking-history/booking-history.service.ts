import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map';
import {ConstService} from "../../providers/const-service";

@Injectable()
export class BookingHistoryService {

    constructor(private http: Http,
                public constService: ConstService) {
    }


    getBookingHistory(userId) {
        const headers = new Headers();
        let authtoken = localStorage.getItem('token');
         headers.append('Authorization', authtoken);
        return this.http.get(this.constService.base_url + 'api/booktables/user/{userId}', {
            headers: headers
        })
            .map((data: Response) => data.json() || {})
            //.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

}
