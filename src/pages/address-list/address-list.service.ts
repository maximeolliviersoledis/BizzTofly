import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AddressListService {

    constructor(private http: HttpClient,
                public constService:ConstService) {
    }

    getAddressList(customerId) : any{
        var urlDir = this.constService.baseDir+this.constService.adresses+this.constService.keyDir+this.constService.formatDir+this.constService.filterIdCustomer+customerId+this.constService.filterDeleted+"0";
        return this.http.get(urlDir);
    }

    getAddress(addressId) : any{
        var urlDir = this.constService.baseDir + this.constService.adresses + "/" + addressId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir);
    }

    deleteAddress(addressId){
        var urlDir = this.constService.baseDir + this.constService.adresses + "/" + addressId + this.constService.keyDir + this.constService.formatDir;
        return this.http.delete(urlDir, {
            responseType: 'text' //Nécessaire car sinon la réponse est vide et cela provoque une erreur
        });
    }

    putCart(cartId, body) : any{
        var urlDir = this.constService.baseDir + this.constService.cartDir + "/" + cartId + this.constService.keyDir + this.constService.formatDir;
        return this.http.put(urlDir, body);
     }
}