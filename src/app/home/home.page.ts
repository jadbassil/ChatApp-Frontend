import { SearchComponent } from './../components/search/search.component';
import { HTTP } from '@ionic-native/http/ngx';
import { Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import url from '../url';
import { del } from 'selenium-webdriver/http';
import { ifStmt } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  chats: any[];
  chats_tmp: any[];
  userId: string;
  toggled: boolean; //search bar toggle
  searchval: String = '';

  constructor(
    private storage: Storage,
    private router: Router,
    private http:HTTP,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) { 
    console.log("hello");
    this.toggled = false;
    this.getChats();
  }

  ngOnInit(){} 

  toggleSearch(){
    if(this.toggled == false){
      this.toggled = true;
    }else{
      this.toggled = false;
      this.recoverChats();
    }
  }

  searchChat(event){
    this.searchval = event.target.value;
    if(this.searchval && this.searchval.trim() != ''){
      this.chats = this.chats.filter((chat)=>{
        return (chat.name.toLowerCase().indexOf(this.searchval.toLowerCase()) > -1);
      })
    }
  }

  recoverChats(){
    this.chats = this.chats_tmp;
    this.searchval = '';
  }

  async getChats(){
    await this.storage.get('user').then(user=>this.userId = user.id).then(() => {
      this.http.get(url+'chat/chat', {'userid': this.userId.toString()}, {}).then((res)=>{
        let data = JSON.parse(res.data);
        this.chats = data.privateChatsNames;
        this.chats_tmp = data.privateChatsNames;
      }).catch(err=>alert(err))
     });
  }

  openChat(chat){
    //alert(JSON.stringify(chat));
    let navigationExtras: NavigationExtras = {
      state: {
        chat_info: chat
      }
    }
    this.router.navigate(['/chat'], navigationExtras);
  }

  async showModal(){
    let modal = await this.modalCtrl.create({
      component: SearchComponent
    });

    await modal.present();
    
  }

  async doRefresh(event){
    console.log('Begin async operation');
    await this.getChats();
    await event.target.complete();
  }

  async press(chat){
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: '<strong>Are you sure you want to delete chat with '+chat.name+'</strong>???',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.http.delete(url+'chat/delete',{
              chatId: chat.id.toString(),
              userId: this.userId.toString()
            }, {}).then(res => {
              let data = JSON.parse(res.data);
              let deletedChat = this.chats.findIndex(c => c.id === chat.id);
              this.chats.splice(deletedChat,1);
              console.log(this.chats);
            })
          }
        }
      ]
    });

    await alert.present();
  }
    
  logout(){
    this.chats = [];
    this.storage.clear();
    this.router.navigate(['/login'], {replaceUrl: true});
  }

}
