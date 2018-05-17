import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";
import {URLSearchParams} from '@angular/http';

@Injectable()

export class CheckoutService {
    constructor(public http: Http, public constService: ConstService) {

    }

    /*placeOrder(body) {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let authtoken = localStorage.getItem('token');
        headers.append('Authorization', authtoken);
        return this.http.post(this.constService.base_url + 'api/orders', body, {
            headers: headers
        })
            .map((data: Response) => data.json() || {})
            //.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }*/

    getAvailablePayments(paymentId){
        //paymentId = 0, retourne tous les moyens de payments disponibles
        const headers = new Headers();
        var urlDir = this.constService.baseDirApiSoledis + this.constService.paymentDir + "/" + paymentId + this.constService.keyDir + this.constService.formatDir;
        return this.http.get(urlDir, {
            headers: headers
        }).map((data: Response) => data.json() || {})
    }

    postOrder(body){
        const headers = new Headers();
        var urlDir = this.constService.baseDir + this.constService.orderDir + this.constService.keyDir + this.constService.formatDir;
        return this.http.post(urlDir, body, {
            headers: headers
        }).map((data: Response) => data.json() || {})     
    }

    /*chargeStripe(token, currency, amount, stripe_secret_key) {
        let secret_key = stripe_secret_key;
        var headers = new Headers();
        var params = new URLSearchParams();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', 'Bearer ' + secret_key);
        params.append("currency", currency);
        params.append("amount", amount);
        params.append("description", "description");
        params.append("source", token);
        console.log("params-"+JSON.stringify(params));
        
        return new Promise(resolve => {
            this.http.post('https://api.stripe.com/v1/charges', params, {
                headers: headers
            }).map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                });
        });
    }*/

    /*savePaymentDetails(orderId, paymentDetails) {
        const headers = new Headers();
        let body: any = {};
        body.payment = paymentDetails;
        headers.append('Content-Type', 'application/json');
        let authtoken = localStorage.getItem('token');
        headers.append('Authorization', authtoken);
        return this.http.put(this.constService.base_url + 'api/orders/' + orderId, body, {
            headers: headers
        })
            .map((data: Response) => data.json() || {})
            //.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }*/

    /*saveLoyaltyPoints(userId, loyaltyData) {
        const headers = new Headers();
        const body = loyaltyData;
        headers.append('Content-Type', 'application/json');
        let authtoken = localStorage.getItem('token');
        headers.append('Authorization', authtoken);
        return this.http.put(this.constService.base_url + 'api/users/'+userId, body, {
            headers: headers
        })
            .map((data: Response) => data.json() || {})
            //.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }*/

    postCart(cartId, body){
         const headers = new Headers();
         //var urlDir = this.constService.baseDir + this.constService.cartDir + "/" + cartId + this.constService.keyDir + this.constService.formatDir;
         var urlDir = this.constService.baseDir + this.constService.cartDir + this.constService.keyDir + this.constService.formatDir;

         return this.http.post(urlDir, body, {
             headers: headers
         }).map((data: Response) => data.json() || {})
     }

     putCart(cartId, body){
         const headers = new Headers();
         var urlDir = this.constService.baseDir + this.constService.cartDir + this.constService.keyDir + this.constService.formatDir;

         return this.http.put(urlDir, body, {
             headers: headers
         }).map((data: Response) => data.json() || {})
     }
}
