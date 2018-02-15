import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map';
import {ConstService} from "../../providers/const-service";

@Injectable()
export class BookTableService {

    constructor(private http: Http,
                public constService: ConstService) {
    }


    bookTable(tableInfo: any) {
        const body = JSON.stringify(tableInfo);
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authtoken = localStorage.getItem('token');
         headers.append('Authorization', authtoken);
        return this.http.post(this.constService.base_url + 'api/booktables', body, {
            headers: headers
        })
            .map((data: Response) => data.json() || {})
            //.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

}
