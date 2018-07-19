import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {HttpClient} from '@angular/common/http';


@Injectable()
export class OfferService {

    constructor(private http: HttpClient,
                public constService: ConstService) {
    }

    getAllProducts(customerId = null) : any{
        var urlDir = this.constService.baseDirApiSoledis + this.constService.productsInPromoDir + "/0" + this.constService.keyDir + this.constService.formatDir + this.constService.filterIdCustomer + customerId;
        return this.http.get(urlDir);
    }

    


}
