import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
//import  "rxjs/Rx";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";

@Injectable()

export class HomeService {
    constructor(public http: Http, public constService: ConstService) {

    }

    getCategories() {
        const headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.categoriesListing + "/0" + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response)=> data.json()|| {});
    }


    getImageUrlForCategory(categoryId){
        return this.constService.baseDir + this.constService.imageDir + this.constService.categoryDir + "/" + categoryId + this.constService.keyDir;
    }

    getSlideCategorie(customerId){
        const headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.categoriesListing + "/14" + this.constService.keyDir + this.constService.formatDir + this.constService.filterUser + customerId;
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response) => data.json() || {})
    }

    getAccueilProduct(customerId){
        const headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.categoriesListing + "/15" + this.constService.keyDir + this.constService.formatDir + this.constService.filterUser + customerId;
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response) => data.json() || {})
    }

}
