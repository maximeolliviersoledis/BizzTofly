import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {Md5} from 'ts-md5/dist/md5';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class RegistrationService {

    constructor(private http: HttpClient,
                public constService: ConstService) {
    }

    postCustomer(body) : any{
        var urlDir = this.constService.baseDir + this.constService.customerDir + this.constService.keyDir + this.constService.formatDir;
        return this.http.post(urlDir, body);
    }

    postUser(body, key) : any{
        var data = "email="+body.email+"&firstname="+body.firstname+"&lastname="+body.lastname+"&pwd="+Md5.hashStr(key+body.passwd)+"&gender="+body.id_gender+"&newsletter="+body.newsletter+"&option="+body.optin;
        var urlDir = this.constService.baseDirApiSoledis + "/registration/0" + this.constService.keyDir + this.constService.formatDir;
        return this.http.post(urlDir, data, {
            headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
        });
    }

    getKey() : any{
        var urlDir = this.constService.baseDirApiSoledis + "/get_key/0" + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir);
    }

    getWebServiceToken(customerId) : any{
        var urlDir = this.constService.baseDirApiSoledis + this.constService.getAccessToken + "/" + customerId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir);
    }
}
