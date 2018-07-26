import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {URLSearchParams} from '@angular/http';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class CheckoutService {
    constructor(public http: HttpClient, public constService: ConstService) {

    }

    getAvailablePayments(paymentId) : any{
        var urlDir = this.constService.baseDirApiSoledis + this.constService.paymentDir + "/" + paymentId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir).retryWhen(error => {
            return error.flatMap((error:any) => {
                if(error.status === 401){
                    return Observable.of(error.status).delay(this.constService.delayOfRetry);
                }
                return Observable.throw({error: 'No retry'});
            }).take(this.constService.nbOfRetry).concat(Observable.throw({error: 'Sorry, there was an error after 5 retries'}));
        });
    }

    postOrder(body) : any{
        var urlDir = this.constService.baseDir + this.constService.orderDir + this.constService.keyDir + this.constService.formatDir;
        return this.http.post(urlDir, body);     
    }

    payOrder(cartId, paymentModuleName) : any{
        var urlDir = this.constService.baseDirApiSoledis + "/paid/" + cartId + this.constService.keyDir + this.constService.formatDir + "&payment=" + paymentModuleName;
        return this.http.get(urlDir).retryWhen(error => {
            return error.flatMap((error:any) => {
                if(error.status === 401){
                    return Observable.of(error.status).delay(this.constService.delayOfRetry);
                }
                return Observable.throw({error: 'No retry'});
            }).take(this.constService.nbOfRetry).concat(Observable.throw({error: 'Sorry, there was an error after 5 retries'}));
        });
    }

    chargeStripe(token, currency, amount, stripe_secret_key) : any {
        let secret_key = stripe_secret_key;
        /*params.append("currency", currency);
        params.append("amount", amount);
        params.append("description", "description");
        params.append("source", token);
        console.log("params-"+JSON.stringify(params));*/

        /*let params = {
            currency: currency,
            amount: amount,
            description: "description",
            source: token
        };*/
        let params = "&currency="+currency+"&amount="+amount+"&description=description&source="+token;
        console.log(params);
        var urlDir = 'https://api.stripe.com/v1/charges';
        return new Promise<any>(resolve => {
            this.http.post(urlDir, params, {
                headers: new HttpHeaders({
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + secret_key
                })
            }).subscribe(data => {
                resolve(data);
            });
        });
        /*return new Promise(resolve => {
            this.http.post('https://api.stripe.com/v1/charges', params, {
                headers: headers
            }).map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                });
        });*/
    }

    postCart(cartId, body) : any{
         var urlDir = this.constService.baseDir + this.constService.cartDir + this.constService.keyDir + this.constService.formatDir;
         return this.http.post(urlDir, body);
     }

     putCart(cartId, body) : any{
         var urlDir = this.constService.baseDir + this.constService.cartDir + this.constService.keyDir + this.constService.formatDir;
         return this.http.put(urlDir, body);
     }
}
