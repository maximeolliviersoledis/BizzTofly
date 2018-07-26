import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()

export class HomeService {
    constructor(public http: HttpClient, public constService: ConstService) {

    }

    getCategories() : any{
        var urlDir = this.constService.baseDirApiSoledis + this.constService.categoriesListing + "/0" + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir);
    }


    getImageUrlForCategory(categoryId) : any{
        return this.constService.baseDir + this.constService.imageDir + this.constService.categoryDir + "/" + categoryId + this.constService.keyDir;
    }

    getCategory(categoryId, customerId) : any{
       var currency = this.constService.currency ? this.constService.currency.id : localStorage.getItem('currency')?  JSON.parse(localStorage.getItem('currency')) : 0;
        var urlDir = this.constService.baseDirApiSoledis + this.constService.categoriesListing + "/" + categoryId + this.constService.keyDir + this.constService.formatDir
        + this.constService.filterUser + customerId + this.constService.filterIdCurrency + currency;
        return this.http.get(urlDir);
    }

   /* testJWT(jwt) : any{
        const headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

        var urlDir = "http://www.bizztofly.com/api-soledis/test/1?ws_key=P67RDX29JM5ITD4JA5A56GZJSIXGXBKL&output_format=JSON";
        return this.http.post(urlDir, jwt, {
            headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
        });
    }*/

}
