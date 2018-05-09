var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ViewChild, Component } from '@angular/core';
import { Content } from 'ionic-angular/index';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ChatService } from "./chat.service";
import { UserService } from '../../providers/user-service';
import { SocketService } from '../../providers/socket-service';
var ChatPage = /** @class */ (function () {
    function ChatPage(navCtrl, navParams, loadingCtrl, chatService, userService, socketService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.chatService = chatService;
        this.userService = userService;
        this.socketService = socketService;
        this.chatData = {
            message: '',
            sentBy: 'sender',
            sender: '',
            receiver: ''
        };
        this.chatList = [];
        this.participantsInfo = {};
        this.imageUrl = 'assets/img/profile.jpg';
    }
    ChatPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        console.log('ionViewDidLoad ChatPage');
        var date = new Date();
        var midnight = date.setUTCHours(0, 0, 0, 0);
        this.sevenDaysBack = midnight - 7 * 24 * 60 * 60 * 1000;
        this.loader = this.loadingCtrl.create({
            content: 'please wait...'
        });
        this.loader.present();
        this.chatService.getRestaurantInfo()
            .subscribe(function (info) {
            console.log("info-" + JSON.stringify(info));
            _this.participantsInfo.sellerName = info.name;
            _this.chatData.receiver = info._id;
            _this.getAllConversations(_this.chatData.receiver);
        }, function (error) {
            _this.loader.dismiss();
        });
        this.getUserInfo();
        this.getLastMessage();
    };
    ChatPage.prototype.getAllConversations = function (receiverId) {
        var _this = this;
        this.chatService.getChatList(receiverId)
            .subscribe(function (response) {
            console.log("res-" + JSON.stringify(response));
            _this.chatList = response;
            _this.scrollToBottom();
            _this.loader.dismiss();
        }, function (error) {
            _this.loader.dismiss();
        });
    };
    ChatPage.prototype.getUserInfo = function () {
        var _this = this;
        this.userService.getUser()
            .subscribe(function (userInfo) {
            console.log("info-" + JSON.stringify(userInfo));
            _this.chatData.sender = userInfo._id;
            _this.participantsInfo.userName = userInfo.name;
            _this.imageUrl = userInfo.imageUrl != null ? _this.imageUrl = userInfo.imageUrl : _this.imageUrl = 'assets/img/profile.jpg';
        });
    };
    ChatPage.prototype.getLastMessage = function () {
        var _this = this;
        this.socketService.getLastMessage().subscribe(function (message) {
            var lastMesage = message;
            console.log("message->" + JSON.stringify(message));
            if (_this.chatData.receiver == lastMesage.receiver) {
                _this.chatList.push(message);
                _this.scrollToBottom();
            }
        });
    };
    ChatPage.prototype.onSend = function () {
        var _this = this;
        this.chatService.sendMessage(this.chatData)
            .subscribe(function (response) {
            console.log("sent-" + JSON.stringify(response));
            _this.chatList.push(response);
            _this.chatData.message = '';
            _this.scrollToBottom();
        });
    };
    ChatPage.prototype.scrollToBottom = function () {
        var _this = this;
        setTimeout(function () {
            _this.content.scrollToBottom();
        });
    };
    __decorate([
        ViewChild(Content),
        __metadata("design:type", Content)
    ], ChatPage.prototype, "content", void 0);
    ChatPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-chat',
            templateUrl: 'chat.html',
            providers: [ChatService]
        }),
        __metadata("design:paramtypes", [NavController,
            NavParams,
            LoadingController,
            ChatService,
            UserService,
            SocketService])
    ], ChatPage);
    return ChatPage;
}());
export { ChatPage };
//# sourceMappingURL=chat.js.map