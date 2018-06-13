import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";

@Injectable()

export class ProductDetailsService {
    constructor(public http: Http, public constService: ConstService) {}

    getProductDetails(productId, customerId = null) {
        const headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.productDetail + "/" + productId + this.constService.keyDir + this.constService.formatDir + this.constService.filterUser + customerId;
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response) => data.json() || {})
    }

    getDeclinaisons(declinaisonId){
        const headers = new Headers();
        var urlDir = this.constService.baseDir+this.constService.combinationDir+"/"+declinaisonId+this.constService.keyDir+this.constService.formatDir;
        //var urlDir = "http://www.bizztofly.com/api/combinations/"+declinaisonId+"?ws_key=P67RDX29JM5ITD4JA5A56GZJSIXGXBKL&output_format=JSON";
        return this.http.get(urlDir,{
            headers: headers
        }).map((data: Response) => data.json() || {})
    }

    addToFavourite(productId, attributeProductId, customerId, quantity){
        const headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.favouriteDir + "/0" + this.constService.keyDir + this.constService.formatDir
        + this.constService.idProduct + productId + this.constService.idProductAttribute + attributeProductId + this.constService.idCustomer + customerId + 
        this.constService.quantity + quantity + this.constService.action + "add";
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

    getFavouriteList(customerId){
        const headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.favouriteDir + "/0" + this.constService.keyDir + this.constService.formatDir + 
        this.constService.idCustomer + customerId;
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response)=> data.json() || {})
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

     getImageUrl(productId, imageId){
         var urlDir = this.constService.baseDir + this.constService.imageDir + this.constService.productDir + "/" + productId + "/" + imageId + this.constService.keyDir;
         return urlDir;
     }


     getFamilyProducts(productId){
         var urlDir = this.constService.baseDirApiSoledis + this.constService.familyProductDir + "/" + productId + this.constService.keyDir + this.constService.formatDir;
         return this.http.get(urlDir).map((data:Response) => data.json() || {})
     }

}
