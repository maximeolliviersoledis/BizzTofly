import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ContactService {
    constructor(public http: HttpClient, public constService: ConstService) {

    }

    postMessage(email, message, contactId, orderId = null, productId = null) : any{
        var urlDir= this.constService.baseDirApiSoledis + this.constService.contactDir + "/0" + this.constService.keyDir + this.constService.formatDir +
        this.constService.email + email + this.constService.idContact + contactId + this.constService.message + message + this.constService.idOrder + orderId 
        + this.constService.idProduct + productId + this.constService.action + "message";
        return this.http.get(urlDir);
    }

    getAllContacts(customerId) : any{
    	var urlDir = this.constService.baseDirApiSoledis + this.constService.contactDir + "/0" + this.constService.keyDir + this.constService.formatDir + this.constService.idCustomer + customerId;
    	return this.http.get(urlDir);
    }

    getProductsForOrder(orderId) : any{
        var urlDir = this.constService.baseDirApiSoledis + this.constService.contactDir + "/0" +this.constService.keyDir + this.constService.formatDir + this.constService.idOrder + orderId + this.constService.action + "products";
        return this.http.get(urlDir);
    }
    
}