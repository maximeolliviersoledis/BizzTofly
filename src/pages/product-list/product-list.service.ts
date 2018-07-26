import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {HttpClient} from '@angular/common/http';

@Injectable()

export class ProductListService {
    constructor(public http: HttpClient, public constService: ConstService) {

    }

    getMenuItems(categoryId, customerId = 0) : any{
        var urlDir = this.constService.baseDirApiSoledis+this.constService.categoriesListing+"/"+categoryId+ this.constService.keyDir+ this.constService.formatDir + this.constService.filterUser + customerId 
        + this.constService.filterIdCurrency + this.constService.currency.id;
        return this.http.get(urlDir);
    }

    getProduct(productId, customerId = 0) : any{
        var urlDir = this.constService.baseDirApiSoledis + this.constService.productDetail + "/" + productId + this.constService.keyDir + this.constService.formatDir +  this.constService.filterUser + customerId 
        + this.constService.filterIdCurrency + this.constService.currency.id;
        return this.http.get(urlDir);
    }

    getCategory(categoryId) : any{
        var urlDir = this.constService.baseDir + this.constService.categoryDir + "/" + categoryId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir);
    }
}
