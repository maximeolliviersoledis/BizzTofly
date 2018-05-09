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

    addToFavourite(productId) {
        let productInfo: any = {};
        productInfo.menuItem = productId;
        productInfo.userReaction = 'LIKE';
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authtoken = localStorage.getItem('token');
        headers.append('Authorization', authtoken);
        return this.http.post(this.constService.base_url + 'api/favourites', productInfo, {
            headers: headers
        })
            .map((data: Response) => data.json() || {})
           // .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    removeToFavourite(productId) {
        let productInfo: any = {};
        productInfo.menuItem = productId;
        productInfo.userReaction = 'DISLIKE';
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authtoken = localStorage.getItem('token');
        headers.append('Authorization', authtoken);
        return this.http.post(this.constService.base_url + 'api/favourites/delete/', productInfo, {
            headers: headers
        })
            .map((data: Response) => data.json() || {})
           // .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    checkFavourite(productId) {
        let productInfo: any = {};
        productInfo.menuItem = productId;
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authtoken = localStorage.getItem('token');
        headers.append('Authorization', authtoken);
        return this.http.post(this.constService.base_url + 'api/favourites/check', productInfo, {
            headers: headers
        })
            .map((data: Response) => data.json() || {})
            //.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

}
