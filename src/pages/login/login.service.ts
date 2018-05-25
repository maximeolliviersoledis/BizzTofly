import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";

@Injectable()
export class LoginService {

    constructor(public http: Http,
                public constService: ConstService) {
    }


    /*login(user: any) {
        const body = JSON.stringify(user);
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.constService.base_url + 'auth/local', body, {
            headers: headers
        })
            .map((data: Response) => data.json() || {})
            //.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }*/


    login(user: any) {
        //http://www.bizztofly.com/modules/sld_notification/mobile-notification.php?ws_key=P67RDX29JM5ITD4JA5A56GZJSIXGXBKL&output_format=JSON&login=0&email=undefined&passwd=undefined
        const body = JSON.stringify(user);
        const headers = new Headers();

        headers.append('Content-Type', 'application/json');
        return this.http.post(this.constService.notificationDir + this.constService.keyDir + this.constService.formatDir+ '&login=0' + '&email=' + user.email + '&passwd=' + user.password, body, {
            headers: headers
        })
            .map((data: Response) => data.json() || {})
            //.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    getCartForCustomer(customerId){
        var urlDir = this.constService.baseDir + this.constService.cartDir + this.constService.keyDir + this.constService.formatDir + this.constService.filterIdCustomer + customerId + this.constService.sortIdDesc + this.constService.limitQuery + 1 ;
        const headers = new Headers();
        console.log(urlDir);
        return this.http.get(urlDir, {
            headers: headers
        })
            .map((data: Response) => data.json() || {})
    }

    getCart(cartId){
        var urlDir = this.constService.baseDir + this.constService.cartDir + "/" + cartId + this.constService.keyDir + this.constService.formatDir;
        const headers = new Headers();
        return this.http.get(urlDir, {
            headers: headers
        })
            .map((data: Response) => data.json() || {});
    }

    getMenuItemDetails(menuItemId) {
        const headers = new Headers();
       // var urlDir = this.constService.baseDirApiSoledis + this.constService.productDetail + "/" + menuItemId + this.constService.keyDir + this.constService.formatDir + this.constService.filterUser + user_id;;
        var urlDir = this.constService.baseDirApiSoledis + this.constService.productDetail + "/" + menuItemId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response) => data.json() || {})
        //.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getDeclinaisons(declinaisonId){
        const headers = new Headers();
        var urlDir = this.constService.baseDir+this.constService.combinationDir+"/"+declinaisonId+this.constService.keyDir+this.constService.formatDir;
        //var urlDir = "http://www.bizztofly.com/api/combinations/"+declinaisonId+"?ws_key=P67RDX29JM5ITD4JA5A56GZJSIXGXBKL&output_format=JSON";
        return this.http.get(urlDir,{
            headers: headers
        }).map((data: Response) => data.json() || {})

    }

    resetPassword(email){
        const headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.resetPasswordDir + "/0" + this.constService.keyDir + this.constService.formatDir + this.constService.email + email;
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response)=> data.json() || {}) 
    }

}
