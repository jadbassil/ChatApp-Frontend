import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import url from '../url';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  chat_info: any;
  userId: string = "";
  message: string = "";
  messages: any[] = [];
  stompClient: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HTTP,
    private storage: Storage
  ) { 
    console.log("chat");
    this.storage.get('user').then(user=>this.userId = user.id);
    this.route.queryParams.subscribe(params => {
      if(this.router.getCurrentNavigation().extras.state){
        this.chat_info = this.router.getCurrentNavigation().extras.state.chat_info;
        this.getMessages();
        this.connect();
      }
    });
   
  }

  ionViewWillLeave(){
   this.disconnect();
  }

  ngOnInit() {}

  disconnect() {
    if (this.stompClient != null) {
        this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  connect(){
    console.log('connect');
    
    this.disconnect();
    //var socket = new SockJS(url + 'ChatApp-websocket');
    let socket = new SockJS(url+'ChatApp-websocket');
    this.stompClient = Stomp.over(socket);
    const _this = this;
    this.stompClient.connect({}, function (frame) {
      _this.stompClient.subscribe('/chat/'+_this.chat_info.id, (message) => {
        _this.getMessages();
      });
      console.log('Connected: ' + frame);
    });
  }

  sendMessage() {
    this.stompClient.send("/app/"+this.chat_info.id, {}, this.message+';'+this.userId+';'+this.chat_info.id);
  }

  getMessages(){
    console.log('getting messages');
    
    this.http.get(url+'messages/getMessages', {
      'chatid': this.chat_info.id
    }, {}).then((res) => {
      let data = JSON.parse(res.data);
      if(data.success == 'true'){
        this.messages = data.messages;
        this.messages.sort((msg1, msg2) => this.compareFn(msg1, msg2));
        //alert(JSON.stringify(this.messages) + 'got messages');
      } 
      else{
        alert(data.message);
      }
    }).catch(err => alert(JSON.parse(err)));
  }

  compareFn(msg1, msg2){
    if(Date.parse(msg1.time) > Date.parse(msg2.time))
      return 1;
    else return -1;
  }

  send(){
    if(this.message != "")
      this.stompClient.send("/app/"+this.chat_info.id, {}, this.message+';'+this.userId+';'+this.chat_info.id);
    this.message = "";
  }

}
