import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class RatingService {

    constructor(private http: HttpClient,
                public constService:ConstService) {
    }


     getComments(productId, customerId = null) : any{
         var urlDir = this.constService.baseDirApiSoledis + this.constService.commentsDir + "/" + productId + this.constService.keyDir + this.constService.formatDir + this.constService.idCustomer + customerId;
         return this.http.get(urlDir);
     }
     
     postComments(productId, customerId, grade, title, content) : any{
         var urlDir = this.constService.baseDirApiSoledis + this.constService.addCommentDir + "/" + productId + this.constService.keyDir + this.constService.formatDir + 
         this.constService.idCustomer + customerId + this.constService.grade + grade + this.constService.title + title + this.constService.content + content;
         return this.http.get(urlDir).retryWhen(error => {
            return error.flatMap((error:any) => {
                if(error.status === 401){
                    return Observable.of(error.status).delay(this.constService.delayOfRetry);
                }
                return Observable.throw({error: 'No retry'});
            }).take(this.constService.nbOfRetry).concat(Observable.throw({error: 'Sorry, there was an error after 5 retries'}));
        });
     }

     postCommentUsefulness(commentId, customerId, usefulness) : any{
         var urlDir = this.constService.baseDirApiSoledis + this.constService.commentUsefulnessDir + "/" + commentId + this.constService.keyDir + this.constService.formatDir + 
         this.constService.idCustomer + customerId + this.constService.uselfuness + usefulness;
         return this.http.get(urlDir).retryWhen(error => {
            return error.flatMap((error:any) => {
                if(error.status === 401){
                    return Observable.of(error.status).delay(this.constService.delayOfRetry);
                }
                return Observable.throw({error: 'No retry'});
            }).take(this.constService.nbOfRetry).concat(Observable.throw({error: 'Sorry, there was an error after 5 retries'}));
        });
     }

     postReportComment(commentId, customerId) : any{
         var urlDir = this.constService.baseDirApiSoledis + this.constService.reportCommentDir + "/" +commentId + this.constService.keyDir + this.constService.formatDir + 
         this.constService.idCustomer + customerId;
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