import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class CartService {

    constructor(private http: HttpClient,
                public constService:ConstService) {
    }

    getSpecificPrices(specificPriceId) : any{
        var urlDir = this.constService.baseDir+this.constService.specificPriceDir+"/"+specificPriceId+this.constService.keyDir+this.constService.formatDir;
        return this.http.get(urlDir);
     }

     getSpecificPriceRules(specificPriceRuleId) : any{
        var urlDir = this.constService.baseDir+this.constService.specificPriceRulesDir+"/"+specificPriceRuleId+this.constService.keyDir+this.constService.formatDir;
        return this.http.get(urlDir);
     }

     postCart(body) : any{
         var urlDir = this.constService.baseDir + this.constService.cartDir + this.constService.keyDir + this.constService.formatDir;
         return this.http.post(urlDir, body);
     }

     putCart(cartId, body) : any{
         var urlDir = this.constService.baseDir + this.constService.cartDir + "/" + cartId + this.constService.keyDir + this.constService.formatDir;
         return this.http.put(urlDir, body);
     }

     getReduction(customerId, cartId = null) : any{
         var urlDir = this.constService.baseDirApiSoledis + this.constService.reductionDir + "/" +  customerId + this.constService.keyDir + this.constService.formatDir + this.constService.idCart + cartId;
         return this.http.get(urlDir).retryWhen(error => {
            return error.flatMap((error:any) => {
                if(error.status === 401){
                    return Observable.of(error.status).delay(this.constService.delayOfRetry);
                }
                return Observable.throw({error: 'No retry'});
            }).take(this.constService.nbOfRetry).concat(Observable.throw({error: 'Sorry, there was an error after 5 retries'}));
        });
     }

    applyReduction(customerId, cartId, cartRuleId) : any{
         var urlDir = this.constService.baseDirApiSoledis + this.constService.reductionDir + "/" + customerId + this.constService.keyDir + this.constService.formatDir
         + this.constService.idCart + cartId + this.constService.idCartRule + cartRuleId + this.constService.action + "apply";
         return this.http.get(urlDir).retryWhen(error => {
            return error.flatMap((error:any) => {
                if(error.status === 401){
                    return Observable.of(error.status).delay(this.constService.delayOfRetry);
                }
                return Observable.throw({error: 'No retry'});
            }).take(this.constService.nbOfRetry).concat(Observable.throw({error: 'Sorry, there was an error after 5 retries'}));
        });
    }

    getImageUrl(productId, imageId) : any{
        var urlDir = this.constService.baseDir + this.constService.imageDir + this.constService.productDir + "/" + productId + "/" + imageId + this.constService.keyDir;
        return urlDir;
    }
}