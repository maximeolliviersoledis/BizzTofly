import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AboutUsService {

    constructor(private http: HttpClient,
                public constService:ConstService) {
    }
    
   /* getCgv() : any{
        var urlDir = "http://www.bizztofly.com/fr/content/3-conditions-utilisation?content_only=1";
        return this.http.get(urlDir, {
        	responseType: 'text'
        });
    }*/

    getAboutUs(): any{
		//var urlDir = "http://www.bizztofly.com/fr/content/4-a-propos?content-only=1";
		var urlDir = "http://www.bizztofly.com/api/content_management_system/4?ws_key=P67RDX29JM5ITD4JA5A56GZJSIXGXBKL&output_format=JSON";
		return this.http.get(urlDir);
    }
}