import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite } from 'ionic-native';

/*
  Generated class for the BluetoothStorageService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
declare var window :any
@Injectable()
export class BluetoothStorageService {
  db: SQLite = null;


  constructor(public http: Http) {
    if(this.db === null){
      this.db = new SQLite;
    }
  }

  openDB(){
    console.log('en openDB');
    this.db.openDatabase({
      name:'samples.db',
      location:'default'
    })
    .then(() =>{
      console.log('OPENED DATA BASE!')
      this.createTable();
      this.createTableStep();
    })
  }

  // add new message to db
  insert(sample: any){
    console.log('> > Service.insert ! ');
    let asam = JSON.stringify(sample);
    let item = JSON.parse(asam);
    let p, t, acx, acy, acz, gx, gy, gz, ts: any;
    if(item.pulse){p = item.pulse;}
    if(item.temperature){t = item.temperature;}
    if(item.accel[0]){acx = item.accel[0];}
    if(item.accel[1]){acy = item.accel[1];}
    if(item.accel[2]){acz = item.accel[2];}
    if(item.gyro[0]){gx = item.gyro[0];}
    if(item.gyro[1]){gy = item.gyro[1];}
    if(item.gyro[2]){gz = item.gyro[2];}
    if(item.timeStamp){ts = item.timeStamp;}

    console.log('sample sent' +  JSON.stringify(item));

    let sql = "INSERT INTO BtoothSamples (pulso,temperatura,acx,acy,acz,gx,gy,gz,timeStamp) VALUES (?,?,?,?,?,?,?,?,?)" ;
    return this.db.executeSql(sql, [p,t,acx,acy, acz, gx, gy, gz,ts]).then(
      value => console.log("retorno insert BtoothSamples OK " ),
      error => console.log('ERROR! BtoothSamples message not inserted')
    );
  }
  insertStep(sample: any){
    console.log('> > INSERT STEP ! ');
    let asam = JSON.stringify(sample);
    console.log('step sample' + asam);
    let item = JSON.parse(asam);
    let s, ts: any;
    if(item.step){s = item.step;}
    if(item.timeStamp){ts = item.timeStamp;}

    console.log('sample sent' +  JSON.stringify(item));

    let sql = "INSERT INTO steps (step,timeStamp) VALUES (?,?)" ;
    return this.db.executeSql(sql, [s,ts]).then(
      value => console.log("retorno insert Steps Ok"),
      error => console.log('ERROR! Steps message not inserted')
    );
  }

  createTable(){
    let sql = " CREATE TABLE IF NOT EXISTS BtoothSamples (id INTEGER PRIMARY KEY AUTOINCREMENT,pulso INTEGER,temperatura INTEGER,acx INTEGER,acy INTEGER,acz INTEGER,gx INTEGER,gy INTEGER,gz INTEGER, timeStamp TEXT)"
    return this.db.executeSql(sql, []).then(
      value => console.log('bd BtoothSamples OK'),
      error => console.log('bd BtoothSamples ERROR')
    );
  }
  createTableStep(){
    let sql = " CREATE TABLE IF NOT EXISTS steps (id INTEGER PRIMARY KEY AUTOINCREMENT,step INTEGER, timeStamp TEXT)"
    return this.db.executeSql(sql, []).then(
      value => console.log('bd steps OK'),
      error => console.log('bd steps ERROR')
    );
  }

  delete(sample: any){
    let sql = 'DELETE FROM BtoothSamples WHERE id=?';
    return this.db.executeSql(sql, [sample.id]);
  }


  getPerDay(date: any){
    console.log('> > Service.getAll ! ');

    let sql = 'SELECT * FROM BtoothSamples WHERE timeStamp>?';
    return this.db.executeSql(sql, [date])
    .then( response =>{
      console.log('response getPerDay() :', response.rows);

      let messages = [];
      for (let index = 0; index < response.rows.length; index++){
        messages.push( response.rows.item(index));
      }
      return Promise.resolve( messages);

    })
  }
  getStepPerDay(date: any){
    console.log('> > Service.getStep ! ');

    let sql = 'SELECT * FROM steps WHERE timeStamp>?';
    return this.db.executeSql(sql, [date])
    .then( response =>{
      console.log('response getStepsPerDay() :', response.rows);

      let messages = [];
      for (let index = 0; index < response.rows.length; index++){
        messages.push( response.rows.item(index));
      }
      return Promise.resolve( messages);

    })
  }

  getAll(){
    console.log('> > Service.getAll ! ');

    let sql = 'SELECT * FROM BtoothSamples';
    return this.db.executeSql(sql, [])
    .then( response =>{
      console.log('response getAll() :', response.rows);

      let messages = [];
      for (let index = 0; index < response.rows.length; index++){
        messages.push( response.rows.item(index));
      }
      return Promise.resolve( messages);

    })
  }

  countRows(){
    let sql = 'SELECT COUNT(*) FROM BtoothSamples';
    return this.db.executeSql(sql, []).then( response =>{
      console.log('response getAll() :', response);
    })
  }

}
