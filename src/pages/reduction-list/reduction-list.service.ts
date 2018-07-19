import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()

export class ReductionListService {
    constructor(public http: HttpClient, public constService: ConstService) {

    }

     getCustomerReductions(customerId) : any{
         var urlDir = this.constService.baseDirApiSoledis + this.constService.reductionDir + "/" +  customerId + this.constService.keyDir + this.constService.formatDir + this.constService.idCart + null;
         return this.http.get(urlDir).retryWhen(error => {
            return error.flatMap((error:any) => {
                if(error.status === 401){
                    return Observable.of(error.status).delay(this.constService.delayOfRetry);
                }
                return Observable.throw({error: 'No retry'});
            }).take(this.constService.nbOfRetry).concat(Observable.throw({error: 'Sorry, there was an error after 5 retries'}));
        });
     }

}