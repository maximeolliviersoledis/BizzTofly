import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";

@Injectable()

export class ReductionListService {
    constructor(public http: Http, public constService: ConstService) {

    }

     getCustomerReductions(customerId){
         const headers = new Headers();
         var urlDir = this.constService.baseDirApiSoledis + this.constService.reductionDir + "/" +  customerId + this.constService.keyDir + this.constService.formatDir + this.constService.idCart + null;
         return this.http.get(urlDir, {
             headers: headers
         }).map((data: Response)=> data.json() || {})
     }

}