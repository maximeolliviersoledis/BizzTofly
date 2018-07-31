import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {Md5} from 'ts-md5/dist/md5';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()

export class SettingsService {
    constructor(public http: HttpClient, public constService: ConstService) {

    }

    getUser(userId) : any{
        var urlDir = this.constService.baseDir + this.constService.customerDir + "/" + userId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir);
    }

    putUser(userId, userInfo) : any{
        var urlDir = this.constService.baseDir + this.constService.customerDir + "/" + userId + this.constService.keyDir + this.constService.formatDir;
        return this.http.put(urlDir, userInfo);
    }

    modifyUser(userId, userInfo, key) : any{
        var urlDir = this.constService.baseDirApiSoledis + this.constService.modifyUserDir + "/" + userId + this.constService.keyDir + this.constService.formatDir;
        if(userInfo.password && userInfo.passwordConfirmation)
            userInfo.passwd = Md5.hashStr(key + userInfo.password);
        delete userInfo.password;
        delete userInfo.passwordConfirmation;
        var data = this.formatData(userInfo);
        return this.http.post(urlDir, data, {
            headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
        }).retryWhen(error => {
            return error.flatMap((error:any) => {
                if(error.status === 401){
                    return Observable.of(error.status).delay(this.constService.delayOfRetry);
                }
                return Observable.throw({error: 'No retry'});
            }).take(this.constService.nbOfRetry).concat(Observable.throw({error: 'Sorry, there was an error after 5 retries'}));
        });
    }

    getKey() : any{
        var urlDir = this.constService.baseDirApiSoledis + "/get_key/0" + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir);
    }

    getUserInfo(userId) : any{
        var urlDir = this.constService.baseDirApiSoledis + "/get_user_info/"+userId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir).retryWhen(error => {
            return error.flatMap((error:any) => {
                if(error.status === 401){
                    return Observable.of(error.status).delay(this.constService.delayOfRetry);
                }
                return Observable.throw({error: 'No retry'});
            }).take(this.constService.nbOfRetry).concat(Observable.throw({error: 'Sorry, there was an error after 5 retries'}));
        });
    }

    getCountries(idCountry = false): any{
        let urlDir;
        if(idCountry)
            urlDir = "http://www.bizztofly.com/api/countries/"+idCountry+"?ws_key=P67RDX29JM5ITD4JA5A56GZJSIXGXBKL&output_format=JSON";
        else
            urlDir = "http://www.bizztofly.com/api/countries?ws_key=P67RDX29JM5ITD4JA5A56GZJSIXGXBKL&output_format=JSON&filter[active]=1";

        return this.http.get(urlDir);
    }

    private formatData(data) : any{
        let item = Object.keys(data);
        let ret = '';
        for(var i = 0; i < item.length; i++){
            if(data[item[i]] != null){
                ret += item[i].toLowerCase() + "=" + data[item[i]];

                if(i != item.length -1)
                    ret += "&";
            }
        }
        return ret;
    }
}
