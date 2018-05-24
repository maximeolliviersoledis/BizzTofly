import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";


@Injectable()
export class FavouriteService {

    constructor(private http: Http,
                public constService: ConstService) {
    }

    getProduct(productId){
        const headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.productDetail + "/" + productId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response) => data.json() || {})
    }

    getFavourite(customerId){
        const headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.favouriteDir + "/0" + this.constService.keyDir + this.constService.formatDir + 
        this.constService.idCustomer + customerId;
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response) => data.json() || {})
    }

    removeFromFavourite(productId, productAttributeId, customerId){
        const headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.favouriteDir + "/0" + this.constService.keyDir + this.constService.formatDir +
        this.constService.idProduct + productId + this.constService.idProductAttribute + productAttributeId + this.constService.idCustomer + customerId +
        this.constService.action + "remove";
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response)=> data.json() || {})
    }
}
