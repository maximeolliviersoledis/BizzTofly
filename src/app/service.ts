import {Injectable} from '@angular/core';
import {ConstService} from "../providers/const-service";
import {HttpClient, HttpResponse, HttpHeaders, HttpRequest} from '@angular/common/http';

@Injectable()
export class Service {
    constructor(public constService: ConstService, private httpClient: HttpClient) {
    }

    search(searchQuery) : any{
        var urlDir = this.constService.baseDir + this.constService.search + this.constService.keyDir + "&" + searchQuery + this.constService.formatDir;
        return this.httpClient.get(urlDir);
    }

    getNotification(uuId, Token, osType) : any{
        var urlDir = this.constService.notificationDir + this.constService.keyDir + this.constService.formatDir + this.constService.uuid + uuId + this.constService.fcm + Token + this.constService.osType + osType;
        return this.httpClient.get(urlDir);
    }

    enableNotification(uuId, enable) : any{
        var urlDir = this.constService.notificationDir + this.constService.keyDir + this.constService.formatDir + this.constService.uuid + uuId + this.constService.enable  + enable;
        return this.httpClient.get(urlDir);
    }

    updateCustomerNotificationUuid(uuId, customerId) : any{
        var urlDir = this.constService.notificationDir + this.constService.keyDir + this.constService.formatDir + this.constService.uuid + uuId + this.constService.idCustomer + customerId
      return this.httpClient.get(urlDir);
    }

    getAppliSettings() : any{
        var urlDir = this.constService.settingsModuleDir;
       return this.httpClient.get(urlDir);
    }

    getImageData(url) : any{
         return this.httpClient.get(url);
    }

    getWebServiceToken(customerId) : any{
        var urlDir = this.constService.baseDirApiSoledis + this.constService.getAccessToken + "/" + customerId + this.constService.keyDir + this.constService.formatDir;
        return this.httpClient.get(urlDir);
    }

    getRequest(request: HttpRequest<any>){
        return this.httpClient.request(request);
    }
}