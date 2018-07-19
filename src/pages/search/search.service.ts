import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {HttpClient} from '@angular/common/http';

@Injectable()
export class SearchService {
    constructor(public http: HttpClient, public constService: ConstService) {

    }

    getProduct(productId) : any{
        var urlDir = this.constService.baseDirApiSoledis + this.constService.productDetail + "/" + productId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir);
    }
}
