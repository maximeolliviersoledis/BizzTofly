import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {HttpClient} from '@angular/common/http';

@Injectable()

export class OrderStatusService {
    constructor(public http: HttpClient, public constService: ConstService) {

    }

    getAllStatus(): any{
        var urlDir = this.constService.baseDir + this.constService.orderStates + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir);
    }

    getStatusById(statusId): any{
        var urlDir = this.constService.baseDir + this.constService.orderStates + '/' + statusId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir);
    }

}
