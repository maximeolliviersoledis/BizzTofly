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

    getNotification(uuId, Token){
        var urlDir = this.constService.notificationDir + this.constService.keyDir + this.constService.formatDir + this.constService.uuid + uuId + this.constService.fcm + Token;
        return this.http.get(urlDir).map((data:Response) => data.json() || {})
    }

    enableNotification(uuId, enable){
        var urlDir = this.constService.notificationDir + this.constService.keyDir + this.constService.formatDir + this.constService.uuid + uuId + this.constService.enable  + enable;
        return this.http.get(urlDir).map((data:Response) => data.json() || {})
    }

    updateCustomerNotificationUuid(uuId, customerId){
        var urlDir = this.constService.notificationDir + this.constService.keyDir + this.constService.formatDir + this.constService.uuid + uuId + this.constService.idCustomer + customerId;
      //  return this.http.get(urlDir).map((data:Response) => data.json() || {})
      return this.http.get(urlDir);
    }

    getAppliSettings(){
        var urlDir = this.constService.baseDirApiSoledis + this.constService.appliSettingsDir + "/0" + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir).map((data:Response) => data.json() || {})
    }

}





