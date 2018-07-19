import {Injectable} from '@angular/core';
//import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AddressService {

    constructor(private http: HttpClient,
                public constService:ConstService) {
    }

    addAddress(data){
        var urlDir = this.constService.baseDir + this.constService.adresses + this.constService.keyDir + this.constService.formatDir;
        return this.http.post(urlDir, data);
    }

    putAddress(addressId, body){
        var urlDir = this.constService.baseDir + this.constService.adresses + "/" + addressId + this.constService.keyDir + this.constService.formatDir;
        return this.http.put(urlDir, body);
    }
}