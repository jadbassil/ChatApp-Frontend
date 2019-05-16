import { Component, OnInit } from '@angular/core';
import { Toast } from '@ionic-native/toast/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Router } from '@angular/router';
import url from '../url';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  username: string = "";
  email: string = "";
  password: string = "";
  password_again: string = "";

  constructor(
    private toast: Toast,
    private http: HTTP,
    private router: Router
    ) { }

  ngOnInit() {
  }

  register(){
    if (this.password != this.password_again) {
      this.toast.show('Passwords mismatch', '5000', 'top').subscribe();
      return;
    }
    this.http.post(url + 'auth/signup',{
      'username': this.username,
      'email': this.email,
      'password': this.password
    },{}).then((res) => {
      let data = JSON.parse(res.data);
      if(data.success == 'true'){
        alert('You have successfully registered!\nYou can now login');
        this.router.navigate(['/login']);
      } else if(data.success == 'false'){
        alert(data.message);
      }
    }).catch((err) =>{
      alert(err);
    });
      
  }

}
