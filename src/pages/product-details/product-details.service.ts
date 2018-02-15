import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";

@Injectable()

export class ProductDetailsService {
    constructor(public http: Http, public constService: ConstService) {

    }

    getMenuItemDetails(menuItemId) {
        const headers = new Headers();
        return this.http.get(this.constService.base_url + 'api/menuItems/' + menuItemId, {
            headers: headers
        })

            .map((data: Response) => data.json() || {})
        //.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
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
