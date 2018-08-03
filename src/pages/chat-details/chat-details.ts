import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { ChatService } from '../chat/chat-service';
import { ConstService } from '../../providers/const-service';

 @IonicPage()
 @Component({
 	selector: 'page-chat-details',
 	templateUrl: 'chat-details.html',
 	providers: [ChatService]
 })
 export class ChatDetailsPage {
 	header_data: any;
 	customerThread: any;
 	employees: any[] = [];
 	response: string = '';
 	customerMessages: any[] = [];
 	lastEmployeeId: number = 0;
	@ViewChild('content') content:Content;

 	constructor(public navCtrl: NavController, public navParams: NavParams, public chatService:ChatService, public constService:ConstService) {
 		this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'Chat'};
 		this.customerThread = this.navParams.get('customerThread');
 		if(!this.customerThread){
 			console.log(this.navParams.get('id'));
 			this.chatService.getCustomerThreads(this.navParams.get('id')).subscribe(data => {
 				this.customerThread = data;
 				console.log(data);
 				this.getMessages();
 			})
 		}

 	}

 	ionViewDidLoad() {
 		this.constService.presentLoader();
 		if(this.customerThread && this.customerThread.customer_thread && this.customerMessages.length == 0){
 			this.getMessages();
 		}
 	}

 	getMessages(){
 		var length = this.customerThread.customer_thread.associations.customer_messages.length;
 		for(var message of this.customerThread.customer_thread.associations.customer_messages){
 			this.chatService.getCustomerMessages(message.id).subscribe(messageData => {
 				this.customerMessages.push(messageData);
 				length--;
 				console.log(length);
 				if(length == 0){
 					this.constService.dismissLoader(); //Utile pour rafraichir l'affichage, sinon aucune données ne s'affiche
 				}

 				//Permet d'éviter des multiples requêtes identiques
 				if(this.lastEmployeeId == 0 || this.lastEmployeeId != messageData.customer_message.id_employee){
 					this.lastEmployeeId = messageData.customer_message.id_employee;
 					this.getEmployee(messageData.customer_message.id_employee);
 				}
 				this.sortMessageByDate();
 				this.content.resize();
 			})
 		}
 	}

 	getEmployee(id){
		if(id == 0 || id == null){
			return false;
		}

		var index = this.employees.find(elem => {
			console.log(elem.employee.id,id);
			return elem.employee.id == id;
		});

		if(!index){
			console.log("index : ",index);
			this.chatService.getEmployees(id).subscribe(employeeData => {
				if(!employeeData || !employeeData.employee){
					console.log('error');
				}else{
					this.employees.push(employeeData);
					index = employeeData;
				}
			})
		}
		
		return index;
	}

	getEmployeeFromArray(id){
		var ret = this.employees.find(elem => {
			return elem.employee.id == id;
		})

		if(!ret){
			return false;
		}else{
			return ret;
		}
	}

	getEmployeeInfo(id){
		var employee = this.getEmployeeFromArray(id);
		if(employee && employee.employee){
			employee = employee.employee;
			return employee.firstname + ' ' + employee.lastname;
		}else{
			return 'Unknown';
		}
	}

	sortMessageByDate(){
		return this.customerMessages.sort((a,b) => {
			console.log(a);
			a = Date.parse(a.customer_message.date_add);
			b = Date.parse(b.customer_message.date_add);
			return a - b;
		});
	}

	sendResponse(){
		console.log(this.response);
		const message = 
		{
			message: {
				id_customer_thread: this.customerThread.customer_thread.id,
				message: this.response,
				id_employee: 0
			}
		};
		this.chatService.sendMessage(message).subscribe(data =>{
			console.log(data);
			if(data && data.customer_message){
				this.constService.createToast({
					message: 'Message successfully sent',
					duration: 2000
				});
				this.customerMessages.push(data);
				this.customerThread.customer_thread.associations.customer_messages.push({id: data.customer_message.id});
				this.response = '';
			}else{
				this.constService.createToast({
					message: 'An error has occured. Your message cannot be send',
					duration: 2000
				});
			}
		})
	}

 }
