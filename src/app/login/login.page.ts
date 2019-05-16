import { SignupPage } from './../signup/signup.page';
import { Toast } from '@ionic-native/toast/ngx';
import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import url  from '../url';

@Component({
  selector: 'app-home',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {

  username: string = "";
  password: string = "";

  constructor(
    private http: HTTP,
    private storage: Storage,
    private router: Router,
    private toast: Toast
    ){

    }
  
  login(){
    this.http.post(url+'auth/login',{
      'username': this.username,
      'password': this.password
    }, {
      'contentType': 'application/json'
    }
    ).then((res) => {
      let data = JSON.parse(res.data);
      if(data.success == 'true'){
        this.toast.show('Welcome ' + this.username, '4000', 'bottom').subscribe();
        this.storage.set('user', {
          'username':data.username,
          'email': data.email,
          'id': data.id
        });
        this.router.navigate(['./home'], {replaceUrl: true});
      }
        
      else if(data.success == 'false')
        alert(data.message);
    }).catch((err) => {
      alert('error authenticating to server. Please try again.');
    })
  }

  signup(){
    this.router.navigate(['/signup']);
  }

}
