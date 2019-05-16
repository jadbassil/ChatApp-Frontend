import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private router: Router,
    private nav: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if(this.platform.is('android')) {
        this.statusBar.styleBlackOpaque();
      }else{
        this.statusBar.styleDefault();
      }
      this.splashScreen.hide();
      this.storage.get('user').then(data => {
        if(data)
          this.router.navigate(['/home']);
        else
          this.router.navigate(['/login']);
      })
    });
  }
}
