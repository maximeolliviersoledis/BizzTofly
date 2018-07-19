import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {HttpClient} from '@angular/common/http';


@Injectable()
export class OrderDetailsService {

    constructor(private http: HttpClient,
                public constService: ConstService) {
    }

    getImageUrlForProduct(productId, combinationId) : any{
        return this.constService.baseDir + this.constService.imageDir + this.constService.productDir + "/" + productId + "/" + combinationId + this.constService.keyDir;
    }

    getProductInfo(productId) : any{
        var urlDir = this.constService.baseDirApiSoledis + this.constService.productDetail + "/" + productId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir);
    }

    getCombination(combinationId) : any{
        var urlDir = this.constService.baseDir+this.constService.combinationDir+"/"+combinationId+this.constService.keyDir+this.constService.formatDir;
        return this.http.get(urlDir);
    }
}
