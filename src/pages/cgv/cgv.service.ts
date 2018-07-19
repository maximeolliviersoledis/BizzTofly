import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {HttpClient} from '@angular/common/http';

@Injectable()
export class CgvService {

    constructor(private http: HttpClient,
                public constService:ConstService) {
    }
    
    getCgv() : any{
        var urlDir = "http://www.bizztofly.com/fr/content/3-conditions-utilisation?content_only=1";
        return this.http.get(urlDir, {
        	responseType: 'text'
        });
    }
}