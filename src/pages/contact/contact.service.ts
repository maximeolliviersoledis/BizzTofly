import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";

@Injectable()
export class ContactService {
    constructor(public http: Http, public constService: ConstService) {

    }

    postMessage(email, message, contactId, orderId = null, productId = null){
        const headers = new Headers();
        //var urlDir = this.constService.baseDirApiSoledis + this.constService.contactDir + "/0" + this.constService.keyDir + this.constService.formatDir + this.constService.action + "message" + this.constService.idCustomer + this.constService.idOrder + orderId;
        var urlDir= this.constService.baseDirApiSoledis + this.constService.contactDir + "/0" + this.constService.keyDir + this.constService.formatDir +
        this.constService.email + email + this.constService.idContact + contactId + this.constService.message + message + this.constService.idOrder + orderId 
        + this.constService.idProduct + productId + this.constService.action + "message";
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response)=> data.json() || {})
    }

    getAllContacts(customerId){
    	const headers = new Headers();
    	var urlDir = this.constService.baseDirApiSoledis + this.constService.contactDir + "/0" + this.constService.keyDir + this.constService.formatDir + this.constService.idCustomer + customerId;
    	return this.http.get(urlDir, {
    		headers: headers
    	}).map((data: Response)=> data.json() || {})
    }


   /* getOrders(customerId) {
        const headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.orderDir + this.constService.keyDir + this.constService.formatDir + this.constService.filterIdCustomer + customerId + this.constService.sortIdDesc;
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response) => data.json() || {})
    }*/

    getProductsForOrder(orderId){
        var urlDir = this.constService.baseDirApiSoledis + this.constService.contactDir + "/0" +this.constService.keyDir + this.constService.formatDir + this.constService.idOrder + orderId + this.constService.action + "products";
        return this.http.get(urlDir).map((data: Response) => data.json() || {})
    }
    
}