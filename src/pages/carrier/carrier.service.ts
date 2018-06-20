import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {ConstService} from "../../providers/const-service";


@Injectable()
export class CarrierService {

    constructor(private http: Http,
                public constService:ConstService) {
    }

   /* getAllCarriers(){
        const headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.carrierDir + this.constService.keyDir + this.constService.formatDir + this.constService.filterDeleted + "0" + this.constService.filterNeedRange + "0";
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response) => data.json() || {})
    }*/

    getAllCarriers(customerId, cartId){
        const headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.carrierDetailsDir + "/0" + this.constService.keyDir + this.constService.formatDir + this.constService.idCustomer + customerId + this.constService.idCart + cartId;
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response) => data.json() || {})
    }

    getCarrierById(carrierId){
        var urlDir = this.constService.baseDir + this.constService.carrierDir + "/" + carrierId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir).map((data: Response) => data.json() || {})
    }

    getCarrierImageUrl(carrierUrl){
        return "http://www.bizztofly.com/" + carrierUrl + this.constService.keyDir;
    }
    
    putCart(cartId, body){
         const headers = new Headers();
         var urlDir = this.constService.baseDir + this.constService.cartDir + this.constService.keyDir + this.constService.formatDir;

         return this.http.put(urlDir, body, {
             headers: headers
         }).map((data: Response) => data.json() || {})
     }
}