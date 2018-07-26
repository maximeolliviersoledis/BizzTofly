import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()

export class ProductDetailsService {
    constructor(public http: HttpClient, public constService: ConstService) {}

    getProductDetails(productId, customerId = null) : any{
        var urlDir = this.constService.baseDirApiSoledis + this.constService.productDetail + "/" + productId + this.constService.keyDir + this.constService.formatDir + this.constService.filterUser + customerId + this.constService.filterIdCurrency + this.constService.currency.id;
        return this.http.get(urlDir);
    }

    getDeclinaisons(declinaisonId) : any{
        var urlDir = this.constService.baseDir+this.constService.combinationDir+"/"+declinaisonId+this.constService.keyDir+this.constService.formatDir;
        return this.http.get(urlDir);
    }

    addToFavourite(productId, attributeProductId, customerId, quantity) : any{
        var urlDir = this.constService.baseDirApiSoledis + this.constService.favouriteDir + "/0" + this.constService.keyDir + this.constService.formatDir
        + this.constService.idProduct + productId + this.constService.idProductAttribute + attributeProductId + this.constService.idCustomer + customerId + 
        this.constService.quantity + quantity + this.constService.action + "add";
        return this.http.get(urlDir).retryWhen(error => {
            return error.flatMap((error:any) => {
                if(error.status === 401){
                    return Observable.of(error.status).delay(this.constService.delayOfRetry);
                }
                return Observable.throw({error: 'No retry'});
            }).take(this.constService.nbOfRetry).concat(Observable.throw({error: 'Sorry, there was an error after 5 retries'}));
        });
    }

    removeFromFavourite(productId, productAttributeId, customerId) : any{
        var urlDir = this.constService.baseDirApiSoledis + this.constService.favouriteDir + "/0" + this.constService.keyDir + this.constService.formatDir +
        this.constService.idProduct + productId + this.constService.idProductAttribute + productAttributeId + this.constService.idCustomer + customerId +
        this.constService.action + "remove";
        return this.http.get(urlDir).retryWhen(error => {
            return error.flatMap((error:any) => {
                if(error.status === 401){
                    return Observable.of(error.status).delay(this.constService.delayOfRetry);
                }
                return Observable.throw({error: 'No retry'});
            }).take(this.constService.nbOfRetry).concat(Observable.throw({error: 'Sorry, there was an error after 5 retries'}));
        });
    }

    getFavouriteList(customerId) : any{
        var urlDir = this.constService.baseDirApiSoledis + this.constService.favouriteDir + "/0" + this.constService.keyDir + this.constService.formatDir + 
        this.constService.idCustomer + customerId + this.constService.token + this.constService.accessToken;
        return this.http.get(urlDir).retryWhen(error => {
            return error.flatMap((error:any) => {
                if(error.status === 401){
                    return Observable.of(error.status).delay(this.constService.delayOfRetry);
                }
                return Observable.throw({error: 'No retry'});
            }).take(this.constService.nbOfRetry).concat(Observable.throw({error: 'Sorry, there was an error after 5 retries'}));
        });
    }

    postCart(body) : any{
         var urlDir = this.constService.baseDir + this.constService.cartDir + this.constService.keyDir + this.constService.formatDir;
         return this.http.post(urlDir, body);
     }

     putCart(cartId, body) : any{
         var urlDir = this.constService.baseDir + this.constService.cartDir + "/" + cartId + this.constService.keyDir + this.constService.formatDir;
         return this.http.put(urlDir, body);
     }

     getImageUrl(productId, imageId) : any{
         var urlDir = this.constService.baseDir + this.constService.imageDir + this.constService.productDir + "/" + productId + "/" + imageId + this.constService.keyDir;
         return urlDir;
     }


     getFamilyProducts(productId) : any{
         var urlDir = this.constService.baseDirApiSoledis + this.constService.familyProductDir + "/" + productId + this.constService.keyDir + this.constService.formatDir 
         + this.constService.filterIdCurrency + this.constService.currency.id;
         return this.http.get(urlDir);
     }

}
