import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";

@Injectable()
export class ContactService {
    constructor(public http: Http, public constService: ConstService) {

    }

    postMessage(body){
        const headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.contactDir + "/0" + this.constService.keyDir + this.constService.formatDir + this.constService.action + "message";
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response)=> data.json() || {})
    }

    getAllContacts(){
    	const headers = new Headers();
    	var urlDir = this.constService.baseDirApiSoledis + this.constService.contactDir + "/0" + this.constService.keyDir + this.constService.formatDir;
    	return this.http.get(urlDir, {
    		headers: headers
    	}).map((data: Response)=> data.json() || {})
    }

    getFormContact(){
        const headers = new Headers();
        var urlDir = "http://www.bizztofly.com/themes/default-bootstrap/js/contact-form.js";
        return this.http.get(urlDir, {
            headers: headers
        })
    }
}