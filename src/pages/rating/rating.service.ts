import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";


@Injectable()
export class RatingService {

    constructor(private http: Http,
                public constService:ConstService) {
    }

    submitReview(body){
         const headers = new Headers();
         headers.append('Content-Type', 'application/json');
         let authtoken = localStorage.getItem('token');
         headers.append('Authorization', authtoken);
        return this.http.post(this.constService.base_url+'api/ratings',body,{
            headers: headers
        })
            .map((data: Response)=> data.json()|| {})
          //  .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
}