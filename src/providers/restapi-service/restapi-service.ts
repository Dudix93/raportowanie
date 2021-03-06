import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Response, Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import {GlobalVars} from '../../app/globalVars'
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RestapiServiceProvider {
  err:any;
  data:any;
  apiUrl:string;
  //apiUrl = 'http://192.168.137.1:9090';
  //apiUrl = 'http://localhost:3000';
  constructor(public http: Http, 
              public storage:Storage,
              public globalVar:GlobalVars){
  }

  // get(apiUrl,resource,id,headers):Promise<any>{
  //   console.log(apiUrl);
  //   if(id == null){
  //     console.log("nie ma id");
  //     return new Promise(resolve => {
  //       this.http.get(apiUrl+'/'+resource)
  //       .map(res => res.json())
  //       .subscribe(data => {
  //         this.data = data;
  //         resolve(this.data);
  //       });
  //   });
  //   }
  //   else{
  //     console.log("jest id");
  //     return new Promise(resolve => {
  //       this.http.get(apiUrl+'/'+resource+'/'+id)
  //       .map(res => res.json())
  //       .subscribe(data => {
  //         this.data = data;
  //         resolve(this.data);
  //       });
  //   });
  //   }
  // }

  // post(apiUrl,resource,data,headers):Promise<any>{
  //   return new Promise((resolve, reject) => {
  //       this.http.post(apiUrl+'/'+resource+'/',data,headers)
  //       .subscribe(res => {
  //         resolve(res);
  //       }, (err) => {
  //         reject(err);
  //       });
  //   });
  // }

  // delete(apiUrl,resource,id):Promise<any>{
  //   return new Promise((resolve, reject) => {
  //       this.http.delete(apiUrl+'/'+resource+'/',id)
  //       .subscribe(res => {
  //         resolve(res);
  //       }, (err) => {
  //         reject(err);
  //       });
  //   });
  // }

  headers():RequestOptions{
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', 'Bearer '+this.globalVar.getToken());
    headers.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return new RequestOptions({headers:headers});
  }

  getApiUrl():string {
    if(this.storage.get('apiUrl')!=null){
      this.storage.get('apiUrl').then((value) => {
        return value;
      });
    }
    else return null;
  }

  getUserId():string {
    if(this.storage.get('zalogowany_id')!=null){
      this.storage.get('zalogowany_id').then((value) => {
        return value;
      });
    }
    else return null;
  }

  login2(data) {
      let value = this.globalVar.getApiUrl();
        return this.http.post(value+'/authenticate', data)
        .map((response:Response) => {
          console.log("token: "+response.json().id_token);
          this.globalVar.setToken(response.json().id_token);
        });
  }

  login(data) {
    //console.log(JSON.stringify(data));
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        return this.http.post(value+'/authenticate', data)
        .subscribe(res => {
          console.log("token: "+res.json().id_token);
          this.globalVar.setToken(res.json().id_token);
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

  getUsers() {
    //this.get(this.getApiUrl,"users",null,this.headers);
    return new Promise(resolve => {
      this.storage.get('apiUrl').then((value) => {
        //console.log(value);
        this.http.get(value+'/users',this.headers())
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        }, (err) => {
          this.err = err;
          resolve(this.err);
        });
      });
    });
  }

  getUser() {
    //this.get(this.getApiUrl,"users",id,this.headers);
    return new Promise(resolve => {
      this.storage.get('apiUrl').then((value) => {
        //console.log(value);
        this.http.get(value+'/users/me/',this.headers())
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
      });
    });
  }

  getUserTask() {
    return new Promise(resolve => {
      this.storage.get('apiUrl').then((value) => {
        //console.log(options);
        this.http.get(value+'/userTask',this.headers())
        .map(res => res.json())
        .subscribe(data => {
         this.data = data;
         resolve(this.data);
        });
       });
    });
  }

  deleteUserTask(data){
    //console.log(data);
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.delete(value+'/userTask/'+data,this.headers())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

  saveUserTask(data) {
    //console.log(JSON.stringify(data));
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.post(value+'/userTask', data,this.headers())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

  updateUserTask(id,data) {
    //console.log(JSON.stringify(data));
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.put(value+'/userTask/'+id, data, this.headers())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

  getRaportUpdate() {
    return new Promise(resolve => {
      this.storage.get('apiUrl').then((value) => {
        //console.log(options);
        this.http.get(value+'/raport-updates',this.headers())
        .map(res => res.json())
        .subscribe(data => {
         this.data = data;
         resolve(this.data);
        });
       });
    });
  }

  deleteRaportUpdate(id:number){
    console.log(id);
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.delete(value+'/raport-updates/'+id,this.headers())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }
  
  saveRaportUpdate(data) {
    //console.log(JSON.stringify(data));
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.post(value+'/raport-updates', data,this.headers())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

  updateRaportUpdate(id,data) {
    //console.log(JSON.stringify(data));
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.put(value+'/raport-updates/', data, this.headers())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

  getTasks() {
     return new Promise(resolve => {
      this.storage.get('apiUrl').then((value) => {
      //console.log(options);
      this.http.get(value+'/tasks',this.headers())
      .map(res => res.json())
      .subscribe(data => {
        this.data = data;
        resolve(this.data);
      });
       });
    });
  }

  getMessages(id:number,read:any) {
    return new Promise(resolve => {
      let value = this.globalVar.getApiUrl();
          this.http.get(value+'/statements/user',this.headers())
          .map(res => res.json())
          .subscribe(data => {
          this.data = data;
          resolve(this.data);
          });
      });
  }

  getProjects() {
    return new Promise(resolve => {
      // this.storage.get('apiUrl').then((value) => {
        let value = this.globalVar.getApiUrl();
        //console.log(this.headers());
        //this.http.get(value+'/api/projects/user/',this.headers())
        this.http.get(value+'/projects/user',this.headers())
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
      // });
    });
  }

  register(value,data) {
    console.log(JSON.stringify(data));
    return new Promise((resolve, reject) => {

        this.http.post(value+'/register', data, this.headers())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });  

    });
  }

  getProjectTasks(id:number): Observable<any> {
     

        let value = this.globalVar.getApiUrl();
        //this.http.get(value+'/api/project-actions/project/'+id,this.headers())
        return this.http.get(value+'/project-actions/project/'+id,this.headers()).map((res: Response) => {
          const data = res.json();
          return data;
        });


        }

  getRaports(id:number) {
    if(id == null){
      return new Promise(resolve => {
        let value = this.globalVar.getApiUrl();
        //this.http.get(value+'/api/raports/user',this.headers())
        this.http.get(value+'/raports/user?_sort=action.id,startDate&_order=desc',this.headers())
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
          
        }, (err) => {
          this.err = err;
          resolve(this.err);
        });
    });
    }
    else{
      return new Promise(resolve => {
        let value = this.globalVar.getApiUrl();
        //this.http.get(value+'/api/raports/user/'+id,this.headers())
        this.http.get(value+'/raports/'+id,this.headers())
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
          
        }, (err) => {
          this.err = err;
          resolve(this.err);
        });
    });
    }
  }
  
  updateRaport(id,data) {
    //console.log(JSON.stringify(data));
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        //this.http.put(value+'/api/raports/user/'+id,data,this.headers())
        this.http.put(value+'/raports/',data,this.headers())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }
  
  deleteRaport(id) {
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        //this.http.put(value+'/api/raports/user/'+id,data,this.headers())
        this.http.delete(value+'/raports/'+id,this.headers())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

  saveRaport(data) {
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.post(value+'/raports', data,this.headers())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

  saveTask(data) {
    console.log(JSON.stringify(data));
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.post(value+'/tasks', data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

  getDayTask() {
    return new Promise(resolve => {
      this.storage.get('apiUrl').then((value) => {
        this.http.get(value+'/day-tasks?_sort=date,taskId&_order=asc',this.headers())
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
      });
    });
  }

  getAutoDayTask() {
    return new Promise(resolve => {
      this.storage.get('apiUrl').then((value) => {
        this.http.get(value+'/autoDayTasks?_sort=date,taskId&_order=asc',this.headers())
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
      });
    });
  }

  saveAutoDayTask(data) {
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.post(value+'/autoDayTasks', data,this.headers())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

  saveDayTask(data) {
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.post(value+'/day-tasks', data,this.headers())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

  deleteDayTask(data){
    //console.log(data);
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.delete(value+'/day-tasks/'+data,this.headers())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

  updateDayTask(id,data) {
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.put(value+'/day-tasks/', data, this.headers())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }


  deleteTask(data){
    console.log(data);
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.delete(value+'/tasks/'+data,this.headers())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }


  saveUser(data) {
    console.log(JSON.stringify(data));
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.post(value+'/users', data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });  
      });
    });
  }

  updateUser(id,data) {
    console.log(JSON.stringify(data));
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.post(value+'/account/', data, this.headers())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

  updateUserPassword(data) {
    console.log(JSON.stringify(data));
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.post(value+'/account/change-password/', data, this.headers())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

  deleteUser(data){
    console.log(data);
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.delete(value+'/users/'+data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });  
      });
    });
  }

  getUserPreferences() {
    return new Promise(resolve => {
      this.storage.get('apiUrl').then((value) => {
        this.http.get(value+'/preferences/user',this.headers())
        .map(res => res.json())
        .subscribe(data => {
         this.data = data;
         resolve(this.data);
        });
       });
    });
  }

  updateUserPreferences(id,data) {
    console.log(JSON.stringify(data));
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.put(value+'/preferences', data, this.headers())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

  saveUserPreferences(id,data) {
    console.log(JSON.stringify(data));
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.post(value+'/preferences', data, this.headers())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

  deleteUserPreferences(data){
    console.log(data);
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.delete(value+'/preferences/'+data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });  
      });
    });
  }

  savePausedTask(data) {
    console.log(JSON.stringify(data));
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.post(value+'/pausedTask', data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });  
      });
    });
  }

  updatePausedTask(id,data) {
    //console.log(JSON.stringify(data));
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.put(value+'/pausedTask/'+id, data, this.headers())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
      });
    });
  }

  saveDayTaskUpdate(data) {
    console.log(JSON.stringify(data));
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.post(value+'/dayTaskUpdate', data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });  
      });
    });
  }

  updateDayTaskUpdate(id,data) {
    console.log(JSON.stringify(data));
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((value) => {
        this.http.put(value+'/dayTaskUpdate/'+id, data)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });  
      });
    });
  }

  startTask(user,task){
    console.log(user);
    return new Promise((resolve, reject) => {
      this.storage.get('apiUrl').then((apiUrl) => {
        this.storage.get('zalogowany_id').then((id) => {
          this.updateUser(id,user)
          this.saveUserTask(task);
          }); 
      });
    });
  }

  getLatestDayTask(task_id:number) {
    return new Promise(resolve => {
      this.storage.get('apiUrl').then((value) => {
        this.http.get(value+'/dayTask?_sort=id&_order=desc&task_id='+task_id,this.headers())
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
      });
    });
  }

  getDayTaskUpdate(task_id:number,user_id:number,date:string) {
    return new Promise(resolve => {
      this.storage.get('apiUrl').then((value) => {
        this.http.get(value+'/dayTaskUpdate?user_id='+user_id+'&task_id='+task_id+'&date='+date,this.headers())
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        }, (err) => {
          this.err = err;
          resolve(this.err);
        });
      });
    });
  }

  getAllDayTaskUpdate() {
    return new Promise(resolve => {
      this.storage.get('apiUrl').then((value) => {
        this.http.get(value+'/dayTaskUpdate',this.headers())
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        }, (err) => {
          this.err = err;
          resolve(this.err);
        });
      });
    });
  }

  getLatestPausedTask(task_id:number,user_id:number) {
    return new Promise(resolve => {
      this.storage.get('apiUrl').then((value) => {
        this.http.get(value+'/pausedTask?_sort=pause_date,pause_hour&_order=desc,desc&task_id='+task_id+'&user_id='+user_id,this.headers())
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
      });
    });
  }

  updateMessages(id,data) {
    return new Promise(resolve => {
      this.storage.get('apiUrl').then((value) => {
        //console.log(options);
        this.http.put(value+'/messages/'+id,data)
        .map(res => res.json())
        .subscribe(data => {
         this.data = data;
         resolve(this.data);
        });
       });
    });
  }
}
