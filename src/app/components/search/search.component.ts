import { Router, NavigationExtras } from '@angular/router';
import { stringify } from 'querystring';
import { Storage } from '@ionic/storage';
import { HTTP } from '@ionic-native/http/ngx';
import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import url from '../../url';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  searchval: string="";
  users: any[];
  users_tmp: any[];
  userId: string;


  constructor(
    private modalCtrl: ModalController,
    private http: HTTP,
    private storage: Storage,
    private router: Router
    ) { 
      const a = this.storage.get('user').then(user=>this.userId = user.id).then(() => {
        this.http.get(url+'users/search', {'userid': this.userId.toString(), 'search':''}, {}).then((res)=>{
          let data = JSON.parse(res.data);
          //alert(JSON.stringify(data));
          if(data.success == 'true'){
            this.users = data.users;
            this.users_tmp = data.users;
          }else if(data.success == 'false')
            alert(data.message);
        }).catch(err=>alert(err))
       });
    }

  ngOnInit() {}

  async close(){
    await this.modalCtrl.dismiss();
  }

  searchItems(event){
    this.searchval = event.target.value;
    this.users_tmp = this.users_tmp.filter(user => {
      if (user.username && this.searchval) {
        if (user.username.toLowerCase().indexOf(this.searchval.toLowerCase()) > -1) {
          return true;
        }
        return false;
        }
      })
      
  }

  recoverUsers(){
    this.users_tmp = this.users;
  }

  newChat(user){
    this.http.post(url+'chat/newchat', {
      'userid': this.userId.toString(),
      'newid': user.id.toString()
    }, {}).then((res)=>{
      let data = JSON.parse(res.data);
      if(data.success == 'true'){
        alert('chat added');
        let navigationExtras: NavigationExtras = {
          state: {
            chat_info: {id: data.id.toString(), name: data.name.toString()}
          },
          replaceUrl: true
        }
        this.router.navigate(['/chat'], navigationExtras);
        this.close();
      }else if(data.success == 'false'){
        alert(data.message);
      }
    }).catch((err) => alert(err));
  }

}
