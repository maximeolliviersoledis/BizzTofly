import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {HttpClient} from '@angular/common/http';


@Injectable()
export class OrdersService {

    constructor(private http: HttpClient,
                public constService: ConstService) {
    }

    getOrders(customerId) : any{
        var urlDir = this.constService.baseDir + this.constService.orderDir + this.constService.keyDir + this.constService.formatDir + this.constService.filterIdCustomer + customerId + this.constService.sortIdDesc;
        return this.http.get(urlDir);
    }

    getOrderById(orderId) : any{
        var urlDir = this.constService.baseDir + this.constService.orderDir + "/" + orderId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir);
    }
}
