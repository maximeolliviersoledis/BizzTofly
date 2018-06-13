import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {map} from 'rxjs/Operator/map'
import {ConstService} from "../../providers/const-service";


@Injectable()
export class RatingService {

    constructor(private http: Http,
                public constService:ConstService) {
    }


     getComments(productId, customerId = null){
         var urlDir = this.constService.baseDirApiSoledis + this.constService.commentsDir + "/" + productId + this.constService.keyDir + this.constService.formatDir + this.constService.idCustomer + customerId;
         return this.http.get(urlDir).map((data:Response) => data.json() || {})
     }
     
     postComments(productId, customerId, grade, title, content){
     	 var urlDir = this.constService.baseDirApiSoledis + "/add_comment" + "/" + productId + this.constService.keyDir + this.constService.formatDir + 
     	 this.constService.idCustomer + customerId + "&grade=" + grade + "&title=" + title + "&content="+ content;
         return this.http.get(urlDir).map((data:Response) => data.json() || {})
     }

     postCommentUsefulness(commentId, customerId, usefulness){
         var urlDir = this.constService.baseDirApiSoledis + this.constService.commentUsefulnessDir + "/" + commentId + this.constService.keyDir + this.constService.formatDir + 
         this.constService.idCustomer + customerId + this.constService.uselfuness + usefulness;
         return this.http.get(urlDir).map((data:Response) => data.json() || {})
     }

     postReportComment(commentId, customerId){
         var urlDir = this.constService.baseDirApiSoledis + this.constService.reportCommentDir + "/" +commentId + this.constService.keyDir + this.constService.formatDir + 
         this.constService.idCustomer + customerId;
         return this.http.get(urlDir).map((data:Response) => data.json() || {})
     }
}