import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  users:any
  credentials = {login: '', password:''}
  correct=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public restapiService: RestapiServiceProvider, public storage:Storage) {
    this.storage.get('zalogowany').then((val) => {
      console.log('Zalogowany jako:', val);
    });
  }

  login() {
    //console.log(this.credentials);
    this.restapiService.getUsers()
    .then(data => {
      this.correct=false;
      this.users = data;
     // console.log(this.users);
      for (var item of this.users) {
        if(item.login == this.credentials.login){
          if(item.password == this.credentials.password){
            this.correct = true;
            this.storage.set('zalogowany', item.login);
            this.storage.set('zalogowany_id', item.id);
            break;
          }
        }
      }
      if(this.correct == true){
        this.navCtrl.push(HomePage);
      }
    });
  }

}
