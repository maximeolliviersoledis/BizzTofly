import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";

@Injectable()

export class CategoryService {
    constructor(public http: Http, public constService: ConstService) {

    }

    /*getCategories() {
        const headers = new Headers();
        return this.http.get(this.constService.base_url + 'api/categories', {
            headers: headers
        })

            .map((data: Response) => data.json())
    }*/
    getCategories() {
        const headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.categoriesListing + "/0" + this.constService.keyDir + this.constService.formatDir;
        //alert(this.constService.categoryDir);
       // var urlDir = "http://www.bizztofly.com/api-soledis/categories_listing/0?&filter[user]=0";
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response)=> data.json());
    }

    getAllCategories() {
        const headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.categoryDir + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response) => data.json() || {})
    }

    getCategory(id){
        const headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.categoryDir + "/" + id +this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response) => data.json() || {})
    }

    getImageForCategory(categoryId){
        //http://www.bizztofly.com/api/images/categories/3?ws_key=P67RDX29JM5ITD4JA5A56GZJSIXGXBKL
        const headers = new Headers();
        var urlDir = this.constService.baseDir + "/images" + this.constService.categoryDir + "/" + categoryId + this.constService.keyDir;
        return this.http.get(urlDir, {
            headers: headers
        })
    }

    getUrlForImage(categoryId){
        return this.constService.baseDir + "/images" + this.constService.categoryDir + "/" + categoryId + this.constService.keyDir;
    }

}
