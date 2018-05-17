import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";

@Injectable()
export class RegistrationService {

    constructor(private http: Http,
                public constService: ConstService) {
    }


    createUser(user: any) {
        const body = JSON.stringify(user);
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.constService.base_url + 'api/users', body, {
            headers: headers
        })
            .map((data: Response) => data.json() || {})
            //.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    postCustomer(body){
        const headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.customerDir + this.constService.keyDir + this.constService.formatDir;
        return this.http.post(urlDir, body, {
            headers: headers
        }).map((data: Response) => data.json() || {})
    }

}
