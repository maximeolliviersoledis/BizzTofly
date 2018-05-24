import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";

@Injectable()

export class ProductDetailsService {
    constructor(public http: Http, public constService: ConstService) {

    }

    /*getMenuItemDetails(menuItemId) {
        const headers = new Headers();
        return this.http.get(this.constService.base_url + 'api/menuItems/' + menuItemId, {
            headers: headers
        })

            .map((data: Response) => data.json() || {})
        //.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }*/

    getMenuItemDetails(menuItemId) {
        const headers = new Headers();
       // var urlDir = this.constService.baseDirApiSoledis + this.constService.productDetail + "/" + menuItemId + this.constService.keyDir + this.constService.formatDir + this.constService.filterUser + user_id;;
        var urlDir = this.constService.baseDirApiSoledis + this.constService.productDetail + "/" + menuItemId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        })

            .map((data: Response) => data.json() || {})
        //.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getDeclinaisons(declinaisonId){
        const headers = new Headers();
        var urlDir = this.constService.baseDir+this.constService.combinationDir+"/"+declinaisonId+this.constService.keyDir+this.constService.formatDir;
        //var urlDir = "http://www.bizztofly.com/api/combinations/"+declinaisonId+"?ws_key=P67RDX29JM5ITD4JA5A56GZJSIXGXBKL&output_format=JSON";
        return this.http.get(urlDir,{
            headers: headers
        }).map((data: Response) => data.json() || {})
    }

   /* addToFavourite(productId, productAttributeId, quantity, token){
        const headers = new Headers();
        var urlDir = "http://www.bizztofly.com/modules/blockwishlist/cart.php?action=add&id_product="+productId+"&quantity="+quantity+"&token="+token+"&id_product_attribute="+productAttributeId+"&id_wishlist=undefined&_=1526561392412"
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response) => data.json() || {})
    }*/

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

}
