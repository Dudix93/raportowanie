import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import {   ActionSheetController, AlertController, ToastController, NavController } from 'ionic-angular';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';
import { LoginPage } from '../login/login';
import { PreferencesPage } from '../preferences/preferences';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  userTask: any;
  tasks: any;
  user: any;
  projects: any;
  project:any;
  userProjectTasks:Array<any>;
  task = {title: '', id:''}
  userProject:Array<any>;
  login:string;
  radioButton =      {
    name: '',
    label: '',
    type: "radio",
    value: "",
    checked: false
  }
  radioButtons:Array<any>;
  userProjects = new Array<any>()
  constructor(public navCtrl: NavController, 
              private restapiService: RestapiServiceProvider, 
              private storage:Storage,
              private actionSheetCtrl:ActionSheetController,
              private alertCtrl:AlertController,
              private toastCtrl:ToastController) {
    this.storage.get('zalogowany').then((val) => {
      this.login = val;
    });
    this.getUserProjectsAndTasks();
  }

  getUserProjectsAndTasks() {
    this.storage.get('zalogowany_id').then((val) => {
      this.restapiService.getUser(val)
      .then(data => {
        this.user = data;
          this.restapiService.getProjects()
          .then(data => {
            this.projects = data;
            this.restapiService.getTasks()
            .then(data => {
              this.tasks = data;
              for(let userProject of this.user.projects){
                this.userProjectTasks = new Array<any>();
                for(let project of this.projects){
                  if(project.id == userProject){
                    //console.log(project);
                    this.project = project;
                    for(let userTask of this.user.tasks){
                      for(let projectTasks of project.tasks){
                        if(userTask == projectTasks){
                          for(let task of this.tasks){
                            if(task.id == projectTasks){
                              this.userProjectTasks.push(task);
                              continue;
                            }
                          }
                        }
                      }
                    }
                    this.userProject = new Array<any>();
                    this.userProject.push(this.project);
                    this.userProject.push(this.userProjectTasks);
                    this.userProjects.push(this.userProject);
                  }
                }
              }
              console.log(this.userProjects);
            });
          });
      });
    });
  }

  getTasks() {
      this.restapiService.getTasks()
      .then(data => {
        this.tasks = data;
      });
  }

  getUserTask(task_id:number) {
    this.restapiService.getUserTask()
    .then(data => {
      this.userTask = data;
      this.storage.get('zalogowany_id').then((user_id) => {
        for(let task of this.userTask){
          if(user_id == task.user_id && task_id == task.task_id){
            this.userTask = task;
            console.log(this.userTask);
            break;
          }
        }
      });
    });
}

  saveTask() {
    this.restapiService.saveTask(this.task).then((result) => {
      console.log(this.task);
      this.getTasks();
    }, (err) => {
      console.log(err);
    });
  }

  deleteTask(id:String) {
    this.restapiService.deleteTask(id).then((result) => {
      console.log(result);
      this.getTasks();
    }, (err) => {
      console.log(err);
    });
  }

  logout(){
    this.storage.set('zalogowany', null);
    this.storage.set('zalogowany_id', null);
    this.navCtrl.push(LoginPage);
  }

  preferences(){
    this.navCtrl.push(PreferencesPage);
  }

  menu() {
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Preferencje',
          icon:'md-options',
          handler: () => {
            this.preferences();
          }
        },
        {
          text: 'Wyloguj',
          icon:'md-power',
          handler: () => {
            this.logout();
          }
        }
      ]
    });
    actionSheet.present();
  }

  prepareRadioButtons(){
    this.radioButtons = new Array(); 
    for(let project of this.projects){
      for(let task of project.tasks){
        this.radioButton.label=task;
        this.radioButton.name=task;
        this.radioButton.value=task;
        console.log(this.radioButton);
        this.radioButtons.push(this.radioButton);
      }
    }
    return this.radioButtons;
  }

  updateTaskTime(task_id:number, updateTaskTime:number){

  }

  updateTask(task_id:number, task:string) {
    this.getUserTask(task_id);
    const alert = this.alertCtrl.create({
      title: task,
      message:"<b>Spędzony czas: "+this.userTask.time_spent+" godzin<br>"
              +"Ostatnia aktualizacja:<br>"
              +this.userTask.update_date+" o "+this.userTask.update_time+" godzin<br><b>",
      inputs: [
      {
        name: 'updateTaskTime',
        placeholder: 'Aktualizuj'
      }
    ],        
      buttons: [
        {
          text: 'Anuluj',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Aktualizuj',
          handler: data => {
            this.updateTaskTime(task_id, data.updateTaskTime);
          }
        }
      ]
    });
    alert.present();
  }

  finishTask(task:number) {
    const alert = this.alertCtrl.create({
      title: 'Zkończyć '+task+'?',
      buttons: [
        {
          text: 'Anuluj',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Zakończ',
          handler: () => {

          }
        }
      ]
    });
    alert.present();
  }

  startTask(project:string) {
    //this.prepareRadioButtons();
    const alert = this.alertCtrl.create({
      title: "Czynnosci w "+project,
      inputs: this.prepareRadioButtons(),        
      buttons: [
        {
          text: 'Anuluj',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Rozpocznij',
          handler: data => {
            //this.updateTaskTime(task_id, data.updateTaskTime);
          }
        }
      ]
    });
    alert.present();
  }
}
