import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";


@Injectable()
export class CartService {

    constructor(private http: Http,
                public constService:ConstService) {
    }

    //équivalent dans prestashopo ?????
    getCoupons() {
         const headers = new Headers();
        return this.http.get(this.constService.base_url+'api/coupons', {
            headers: headers
        })
            .map((data: Response)=> data.json()|| {})
           //.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }


    getSpecificPrices(specificPriceId){
        const headers = new Headers();
        var urlDir = this.constService.baseDir+this.constService.specificPriceDir+"/"+specificPriceId+this.constService.keyDir+this.constService.formatDir;
        return this.http.get(urlDir,{
            headers: headers
        }).map((data: Response) => data.json() || {})
     }

     getSpecificPriceRules(specificPriceRuleId){
        const headers = new Headers();
        var urlDir = this.constService.baseDir+this.constService.specificPriceRulesDir+"/"+specificPriceRuleId+this.constService.keyDir+this.constService.formatDir;
        return this.http.get(urlDir,{
            headers: headers
        }).map((data: Response) => data.json() || {})
     }

     postCart(body){
         const headers = new Headers();
         var urlDir = this.constService.baseDir + this.constService.cartDir + this.constService.keyDir + this.constService.formatDir;
         return this.http.post(urlDir, body, {
             headers: headers
         }).map((data: Response) => data.json() || {})
     }

     putCart(cartId, body){
         const headers = new Headers();
         var urlDir = this.constService.baseDir + this.constService.cartDir + "/" + cartId + this.constService.keyDir + this.constService.formatDir;
         return this.http.put(urlDir, body, {
             headers: headers
         }).map((data: Response) => data.json() || {})
     }
    
}