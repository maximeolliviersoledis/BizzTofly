import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'


@Injectable()
export class Service {
    constructor(private http: Http) {
    }
    getData() {
       return this.http.get('assets/json/restaurantAppJson.json')
          .map((response: Response) => response.json());
    }

}

//local-path-->'assets/json/restaurantAppJson.json'
//remote -->'https://s3-us-west-2.amazonaws.com/ionicfirebaseapp.com/restaurantAppJson.json'





