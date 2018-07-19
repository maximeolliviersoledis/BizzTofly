import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {HttpClient} from '@angular/common/http';

@Injectable()

export class CategoryService {
    constructor(public http: HttpClient, public constService: ConstService) {

    }

    getCategories() : any{
        var urlDir = this.constService.baseDirApiSoledis + this.constService.categoriesListing + "/0" + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir);
    }

    getAllCategories() : any{
        var urlDir = this.constService.baseDir + this.constService.categoryDir + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir);
    }

    getCategory(id) : any{
        var urlDir = this.constService.baseDir + this.constService.categoryDir + "/" + id +this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir);
    }

    getImageForCategory(categoryId) : any{
        var urlDir = this.constService.baseDir + "/images" + this.constService.categoryDir + "/" + categoryId + this.constService.keyDir;
        return this.http.get(urlDir);
    }

    getUrlForImage(categoryId) : any{
        return this.constService.baseDir + "/images" + this.constService.categoryDir + "/" + categoryId + this.constService.keyDir;
    }

}
