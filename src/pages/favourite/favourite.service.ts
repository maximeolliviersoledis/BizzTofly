import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class FavouriteService {

    constructor(private http: HttpClient,
                public constService: ConstService) {
    }

    getProduct(productId) : any{
        var urlDir = this.constService.baseDirApiSoledis + this.constService.productDetail + "/" + productId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir);
    }

    getFavourite(customerId) : any{
        var urlDir = this.constService.baseDirApiSoledis + this.constService.favouriteDir + "/0" + this.constService.keyDir + this.constService.formatDir + 
        this.constService.idCustomer + customerId + this.constService.token + this.constService.accessToken;
        return this.http.get(urlDir).retryWhen(error => {
            return error.flatMap((error:any) => {
                if(error.status === 401){
                    return Observable.of(error.status).delay(this.constService.delayOfRetry);
                }
                return Observable.throw({error: 'No retry'});
            }).take(this.constService.nbOfRetry).concat(Observable.throw({error: 'Sorry, there was an error after 5 retries'}));
        });;
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
        });;
    }
}
