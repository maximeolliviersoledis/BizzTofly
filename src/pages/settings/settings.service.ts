import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";

@Injectable()

export class SettingsService {
    constructor(public http: Http, public constService: ConstService) {

    }

     /*updateUserInfo(userId,userInfo){  
         let body=userInfo;   
         const headers = new Headers();
         let authtoken = localStorage.getItem('token');
         headers.append('Authorization', authtoken);
         headers.append('Content-Type', 'application/json');
        return this.http.put(this.constService.base_url+'api/users/'+userId,body,{
            headers: headers
        })
            .map((data: Response)=> data.json()|| {})
           // .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }*/

    getUser(userId){
        const headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.customerDir + "/" + userId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response) => data.json() || {})
    }

    putUser(userId, userInfo){
        const headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.customerDir + "/" + userId + this.constService.keyDir + this.constService.formatDir;
        return this.http.put(urlDir, userInfo, {
            headers: headers
        }).map((data: Response) => data.json() || {})
    }

}
