import {ViewChild, Component} from '@angular/core';
import {Content} from 'ionic-angular/index';
import {IonicPage, NavController, NavParams,LoadingController} from 'ionic-angular';
import {ChatService} from "./chat.service";
import {UserService } from '../../providers/user-service';
import {SocketService } from '../../providers/socket-service';


@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  providers:[ChatService]
})
export class ChatPage {

	@ViewChild(Content) content: Content;
	    chatData:any={
        message:'',
        sentBy:'sender',
        sender:'',
        receiver:''
      };
      chatList:any[]=[];
      sevenDaysBack:number;
      participantsInfo:any={};
      public loader:any;
      public imageUrl:string='assets/img/profile.jpg';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl:LoadingController,
              public chatService:ChatService,
              public userService:UserService,
              public socketService:SocketService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
     let date = new Date();
     let midnight = date.setUTCHours(0, 0, 0, 0);
     this.sevenDaysBack = midnight - 7 * 24 * 60 * 60 * 1000;
    this.loader=this.loadingCtrl.create({
      content:'please wait...'
    })
    this.loader.present();
    this.chatService.getRestaurantInfo()
    .subscribe(info=>{
    	console.log("info-"+JSON.stringify(info));
      this.participantsInfo.sellerName=info.name;
    	this.chatData.receiver=info._id;
      this.getAllConversations(this.chatData.receiver);
     },error=>{
       this.loader.dismiss();
      })

    this.getUserInfo();
    this.getLastMessage();
    
  }

  getAllConversations(receiverId){
     this.chatService.getChatList(receiverId)
      .subscribe(response=>{
        console.log("res-"+JSON.stringify(response));
        this.chatList=response;
        this.scrollToBottom();
        this.loader.dismiss();
      },error=>{
       this.loader.dismiss();
      })
  }

  getUserInfo(){
     this.userService.getUser()
    .subscribe(userInfo=>{
      console.log("info-"+JSON.stringify(userInfo));
      this.chatData.sender=userInfo._id;
      this.participantsInfo.userName=userInfo.name;
      this.imageUrl=userInfo.imageUrl!=null?this.imageUrl=userInfo.imageUrl:this.imageUrl='assets/img/profile.jpg'
    })
  }

  getLastMessage(){
    this.socketService.getLastMessage().subscribe((message) => {
            let lastMesage:any = message;
            console.log("message->"+JSON.stringify(message))
            if (this.chatData.receiver == lastMesage.receiver) {
                this.chatList.push(message);
                this.scrollToBottom();
            }
        })
  }

  onSend(){
  	this.chatService.sendMessage(this.chatData)
  	.subscribe(response=>{
  		console.log("sent-"+JSON.stringify(response));
      this.chatList.push(response);
      this.chatData.message='';
      this.scrollToBottom();
  	})
  }

  scrollToBottom(){
  	setTimeout(()=>{
  		this.content.scrollToBottom();
  	})
  }

}
