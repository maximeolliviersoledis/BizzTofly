import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class CarrierService {

    constructor(private http: HttpClient,
                public constService:ConstService) {
    }

    getAllCarriers(customerId, cartId) : any{
        var urlDir = this.constService.baseDirApiSoledis + this.constService.carrierDetailsDir + "/0" + this.constService.keyDir + this.constService.formatDir + this.constService.idCustomer + customerId + this.constService.idCart + cartId;
        return this.http.get(urlDir).retryWhen(error => {
            return error.flatMap((error:any) => {
                if(error.status === 401){
                    return Observable.of(error.status).delay(this.constService.delayOfRetry);
                }
                return Observable.throw({error: 'No retry'});
            }).take(this.constService.nbOfRetry).concat(Observable.throw({error: 'Sorry, there was an error after 5 retries'}));
        });
    }

    getCarrierById(carrierId) : any{
        var urlDir = this.constService.baseDir + this.constService.carrierDir + "/" + carrierId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir);
    }

    getCarrierImageUrl(carrierUrl) : any{
        return "http://www.bizztofly.com/" + carrierUrl + this.constService.keyDir;
    }
    
    putCart(cartId, body) : any{
         var urlDir = this.constService.baseDir + this.constService.cartDir + this.constService.keyDir + this.constService.formatDir;
         return this.http.put(urlDir, body);
     }
}