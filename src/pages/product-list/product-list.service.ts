import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";

@Injectable()

export class ProductListService {
    constructor(public http: Http, public constService: ConstService) {

    }

   /* getMenuItems(categoryId) {
        const headers = new Headers();
        return this.http.get(this.constService.base_url + 'api/menuItems/by/category/' + categoryId, {
            headers: headers
        })

            .map((data: Response) => data.json() || {})
        //.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }*/

       getMenuItems(categoryId, customerId = 0) {
        const headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis+this.constService.categoriesListing+"/"+categoryId+ this.constService.keyDir+ this.constService.formatDir + this.constService.filterUser + customerId;
        return this.http.get(urlDir,{
            headers: headers
        }).map((data: Response) => data.json() || {} )
        /*return this.http.get("http://www.bizztofly.com/api-soledis/categories_listing/"+categoryId+"?&filter[user]=0", {
            headers: headers
        })

            .map((data: Response) => data.json() || {})*/
        //.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getProduct(productId){
        const headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.productDetail + "/" + productId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response) => data.json() || {})
    }

    getCategory(categoryId){
        const headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.categoryDir + "/" + categoryId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response) => data.json() || {})
    }
}
