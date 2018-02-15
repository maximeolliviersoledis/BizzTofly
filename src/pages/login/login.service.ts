import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";

@Injectable()
export class LoginService {

    constructor(private http: Http,
                public constService: ConstService) {
    }


    login(user: any) {
        const body = JSON.stringify(user);
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.constService.base_url + 'auth/local', body, {
            headers: headers
        })
            .map((data: Response) => data.json() || {})
            //.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

}
