import {LoadingController, Loading, Events} from 'ionic-angular';
import {Injectable, Injector} from '@angular/core';
import {HttpRequest, HttpResponse, HttpInterceptor, HttpHandler, HttpEvent, HttpClient, HttpErrorResponse} from '@angular/common/http';
import 'rxjs/add/operator/do';
import {retryWhen} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ConstService} from './const-service';
import {Storage} from '@ionic/storage';
import {JWT} from './jwt-service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor{
	constructor(private constService:ConstService, private injector:Injector, private storage:Storage, public events:Events, private  jwt:JWT){}
	timeout=  false;
	lastRequest: any;

	intercept(req: HttpRequest<any>, next:HttpHandler){
		var newRequest;
		if(this.constService.accessToken && this.constService.user && this.constService.user.id_customer){
			newRequest = req.clone({
				setParams: {
					'JWT': this.jwt.encode({
						id_customer: this.constService.user.id_customer,
						token: this.constService.accessToken
					})
				}
			});
		}else{
			newRequest = req.clone();
		}

		return next.handle(newRequest).do(event => {
			if(event instanceof HttpResponse){
				//Si le code de la réponse est 200, mais qu'elle présente quand même le TimeOutTokenException, alors on traite cette requête comme une 
				//réponse 401
				if(event.body && event.body == "TimeOutTokenException"){
					const http = this.injector.get(HttpClient);
					this.lastRequest = newRequest;
					this.storage.get('user').then((userData) => {
						var urlDir = this.constService.baseDirApiSoledis + this.constService.getAccessToken + "/" + userData.id_customer + this.constService.keyDir + this.constService.formatDir;
						console.log(http.get(urlDir));
					})
					return Observable.throw(event);
				}
			}
		}).catch(event => {
			if(event.status == "401"){
				const http = this.injector.get(HttpClient);
				this.storage.get('user').then((userData) => {
					var urlDir = this.constService.baseDirApiSoledis + this.constService.getAccessToken + "/" + userData.id_customer + this.constService.keyDir + this.constService.formatDir;
					http.get(urlDir).subscribe((token:any) => {
						this.constService.accessToken = token;
					})

				})
			}
			return Observable.throw(event);
		})
	}
}