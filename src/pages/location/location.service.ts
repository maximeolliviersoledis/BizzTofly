import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";

@Injectable()

export class LocationService {
    constructor(public http: Http, public constService: ConstService) {

    }

    getShops(){
    	var urlDir = this.constService.baseDirApiSoledis + this.constService.storesDir + "/0" + this.constService.keyDir + this.constService.formatDir;
    	return this.http.get(urlDir).map((data:Response) => data.json() || {})
    }
}
