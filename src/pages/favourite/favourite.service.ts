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


}
