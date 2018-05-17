import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map';
import {ConstService} from "../providers/const-service";

@Injectable()
export class Service {
    constructor(private http: Http, public constService: ConstService) {
    }
    getData() {
       return this.http.get('assets/json/restaurantAppJson.json')
          .map((response: Response) => response.json());
    }
    search(searchQuery){
        var urlDir = this.constService.baseDir + this.constService.search + this.constService.keyDir + "&" + searchQuery + this.constService.formatDir;
        return this.http.get(urlDir)
        .map((data: Response) => data.json() || {})
    }

}





