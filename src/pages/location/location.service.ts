import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {HttpClient} from '@angular/common/http';

@Injectable()

export class LocationService {
    constructor(public http: HttpClient, public constService: ConstService) {}

    getShops() : any{
    	var urlDir = this.constService.baseDirApiSoledis + this.constService.storesDir + "/0" + this.constService.keyDir + this.constService.formatDir;
    	return this.http.get(urlDir);
    }

    getImageUrl(imageId){
    	var urlDir = this.constService.baseDir + this.constService.imageDir + this.constService.storesDir + "/" + imageId +this.constService.keyDir + this.constService.formatDir;
    	return urlDir;
    }

    getShop(shopId): any {
    	var urlDir = this.constService.baseDirApiSoledis + this.constService.storesDir + "/" + shopId + this.constService.keyDir + this.constService.formatDir;
    	return this.http.get(urlDir);
    }
}
