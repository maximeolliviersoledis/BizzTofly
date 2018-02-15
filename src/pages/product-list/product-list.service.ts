import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";

@Injectable()

export class ProductListService {
    constructor(public http: Http, public constService: ConstService) {

    }

    getMenuItems(categoryId) {
        const headers = new Headers();
        return this.http.get(this.constService.base_url + 'api/menuItems/by/category/' + categoryId, {
            headers: headers
        })

            .map((data: Response) => data.json() || {})
        //.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

}
