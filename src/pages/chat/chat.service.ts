import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";

@Injectable()

export class ChatService {
    constructor(public http: Http, public constService: ConstService) {

    }

    getChatList(sellerId) {
        const headers = new Headers();
        let authtoken = localStorage.getItem('token');
        headers.append('Authorization', authtoken);
        return this.http.get(this.constService.base_url + 'api/messages/user/' + sellerId, {
            headers: headers
        })
            .map((data: Response) => data.json())
    }

    sendMessage(chatData) {
        const body = JSON.stringify(chatData);
        console.log("body" + body);
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authtoken = localStorage.getItem('token');
        headers.append('Authorization', authtoken);
        return this.http.post(this.constService.base_url + 'api/messages/', body, {
            headers: headers
        })
            .map((data: Response) => data.json())
    }

    getRestaurantInfo() {
        const headers = new Headers();
        let authtoken = localStorage.getItem('token');
        headers.append('Authorization', authtoken);
        return this.http.get(this.constService.base_url + 'api/users/store/info', {
            headers: headers
        })
            .map((data: Response) => data.json())
    }

}
