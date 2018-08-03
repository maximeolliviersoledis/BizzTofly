import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ChatService } from '../chat/chat-service';
import { ConstService } from '../../providers/const-service';

@IonicPage()
@Component({
	selector: 'page-chat',
	templateUrl: 'chat.html',
	providers: [ChatService]
})
export class ChatPage {
	header_data: any;
	user: any;
	customerThreads: any[] = [];
	customerMessages: any[] = [];
	//displayAllThreads: boolean = true;
	//employees: any[] = [];
	//response: string = '';
	//selectedThread: any;
	displayRedirectButton: boolean = false;
	//@ViewChild('content') content:Content;

	constructor(public navCtrl: NavController, public navParams: NavParams, public storage:Storage, public chatService:ChatService, public constService:ConstService) {
        this.header_data = {ismenu: false , isHome:false, isCart: false, enableSearchbar: true, title: 'Chat'};
	}

	ionViewDidLoad() {
		this.storage.get('user').then(userData => {
			if(!userData){
				this.navCtrl.push('LoginPage');
			}else{
				this.user = userData;
				this.getCustomerThreads();
			}
		});

		this.displayRedirectButton = JSON.parse(localStorage.getItem('appli_settings')).show_contact_page;
	}

	getCustomerThreads(){
		this.chatService.getCustomerThreads(null, this.user.id_customer).subscribe(threadData => {
			if(!threadData || !threadData.customer_threads ||threadData.customer_threads.length == 0){
				//alert('Pas de message');
				console.log("Pas de message");
			}else{
				//this.customerThreads = threadData.customer_threads;
				for(var thread of threadData.customer_threads){
					this.chatService.getCustomerThreads(thread.id).subscribe(data => {
						this.customerThreads.push(data);
						this.sortThreadById();
					})
				}
				console.log(this.customerThreads);
			}
		})
	}


	selectThread(thread){
		this.navCtrl.push('ChatDetailsPage', {
			customerThread: thread
		});
	}

	/*selectThread(thread){
		this.displayAllThreads = false;
		this.selectedThread = thread;
		var length = this.selectedThread.customer_thread.associations.customer_messages.length;
		for(var message of this.selectedThread.customer_thread.associations.customer_messages){
			this.chatService.getCustomerMessages(message.id).subscribe(messageData => {
				this.customerMessages.push(messageData);
				this.getEmployee(messageData.customer_message.id_employee);
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
			return elem.employee.id == id;
		})

		if(!index){
			this.chatService.getEmployees(id).subscribe(employeeData => {
				if(!employeeData || !employeeData.employee){
					alert('error');
				}else{
					this.employees.push(employeeData);
				}
			})
		}else{
			return index;
		}
	}

	getEmployeeInfo(id){
		var employee = this.getEmployee(id);
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
	}*/


	sortThreadById(){
		return this.customerThreads.sort((a,b) => {
			return b.customer_thread.id - a.customer_thread.id;
		})
	}

	/*sendResponse(){
		console.log(this.response);
		const message = 
		{
			message: {
				id_customer_thread: this.selectedThread.customer_thread.id,
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
				this.selectedThread.customer_thread.associations.customer_messages.push({id: data.customer_message.id});
				this.response = '';
			}else{
				this.constService.createToast({
					message: 'An error has occured. Your message cannot be send',
					duration: 2000
				});
			}
		})
	}

    private objectToArray(object){
      let item = Object.keys(object);
      let array = [];
      for(var i of item){
        array.push(object[i]);
      }
      return array;
    }

    GoBack(){
    	this.displayAllThreads = true;
    	this.customerMessages = [];
    }*/

    goToContactPage(){
    	this.navCtrl.setRoot('ContactPage');
    }
}
