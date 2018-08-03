import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {Md5} from 'ts-md5/dist/md5';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class LoginService {

    constructor(public http: HttpClient,
                public constService: ConstService) {
    }

    postLogin(user, key) : any{
        var urlDir = this.constService.baseDirApiSoledis + "/login/0" + this.constService.keyDir + this.constService.formatDir;
        var data = "mail="+user.email+"&passwd="+Md5.hashStr(key+user.password);
            return this.http.post(urlDir, data, {
                headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})
            });
    }

    getWebServiceToken(customerId) : any{
        var urlDir = this.constService.baseDirApiSoledis + this.constService.getAccessToken + "/" + customerId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir);
    }

    getKey() : any{
        var urlDir = this.constService.baseDirApiSoledis + this.constService.getKeyDir + "/0" + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir);
    }

    getCartForCustomer(customerId) : any{
        var urlDir = this.constService.baseDir + this.constService.cartDir + this.constService.keyDir + this.constService.formatDir + this.constService.filterIdCustomer + customerId + this.constService.sortIdDesc + this.constService.limitQuery + 1 ;
        return this.http.get(urlDir);
    }

    getCart(cartId) : any{
        var urlDir = this.constService.baseDir + this.constService.cartDir + "/" + cartId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir);
    }

    getLastCart(customerId) : any{
        var urlDir = this.constService.baseDirApiSoledis + "/get_last_cart/" + customerId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir).retryWhen(error => {
            return error.flatMap((error:any) => {
                if(error.status === 401){
                    return Observable.of(error.status).delay(this.constService.delayOfRetry);
                }
                return Observable.throw({error: 'No retry'});
            }).take(this.constService.nbOfRetry).concat(Observable.throw({error: 'Sorry, there was an error after 5 retries'}));
        });
    }

    getMenuItemDetails(menuItemId) : any{
        var urlDir = this.constService.baseDirApiSoledis + this.constService.productDetail + "/" + menuItemId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir);
    }

    getDeclinaisons(declinaisonId) : any{
        var urlDir = this.constService.baseDir+this.constService.combinationDir+"/"+declinaisonId+this.constService.keyDir+this.constService.formatDir;
        return this.http.get(urlDir);

    }

    resetPassword(email) : any{
        var urlDir = this.constService.baseDirApiSoledis + this.constService.resetPasswordDir + "/0" + this.constService.keyDir + this.constService.formatDir + this.constService.email + email;
        return this.http.get(urlDir);
    }

    getImageUrl(productId, imageId) : any{
        var urlDir = this.constService.baseDir + this.constService.imageDir + this.constService.productDir + "/" + productId + "/" + imageId + this.constService.keyDir;
        return urlDir;
    }
}
