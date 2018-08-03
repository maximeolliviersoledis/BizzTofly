import {Injectable} from '@angular/core';
import {ConstService} from "../../providers/const-service";
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ChatService {

    constructor(private http: HttpClient,
                public constService:ConstService) {
    }
    

    getCustomerThreads(threadId = null, customerId = null): any{
    	var urlDir;
    	if(threadId)
    		urlDir = this.constService.baseDir + this.constService.customerThreadDir + "/" + threadId + this.constService.keyDir + this.constService.formatDir;
    	else
    		urlDir = this.constService.baseDir + this.constService.customerThreadDir + this.constService.keyDir + this.constService.formatDir + this.constService.filterIdCustomer + customerId + this.constService.sortIdDesc;

    	return this.http.get(urlDir);
    }

    getCustomerMessages(messageId): any{
    	var urlDir = this.constService.baseDir + this.constService.customerMessageDir + "/" + messageId + this.constService.keyDir + this.constService.formatDir;
    	return this.http.get(urlDir);
    }

    getEmployees(employeeId): any {
    	var urlDir = this.constService.baseDir + this.constService.employeeDir + "/" + employeeId + this.constService.keyDir + this.constService.formatDir;
    	return this.http.get(urlDir);
    }

    sendMessage(message): any{
    	var urlDir = this.constService.baseDir + this.constService.customerMessageDir + this.constService.keyDir + this.constService.formatDir;
    	return this.http.post(urlDir, message);
    }
}