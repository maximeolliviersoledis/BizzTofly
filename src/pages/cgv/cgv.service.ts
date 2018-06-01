import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {ConstService} from "../../providers/const-service";


@Injectable()
export class CgvService {

    constructor(private http: Http,
                public constService:ConstService) {
    }
    
    getCgv(){
        var urlDir = "http://www.bizztofly.com/fr/content/3-conditions-utilisation?content_only=1";
        return this.http.get(urlDir).map((data: Response) => data.text());
    }
}