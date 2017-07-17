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
    })
  }

  // add new message to db
  insert(sample: any){
    console.log('> > Service.insert ! ');
    let asam = JSON.stringify(sample);
    let item = JSON.parse(asam);
    let p, t, acx, acy, acz, gx, gy, gz: any;
    if(item.pulse){
       p = item.pulse;
      console.log('pulse ok');
    }
    if(item.temperature){
       t = item.pulse;
      console.log('temperature ok ')
    }
    if(item.accel[0]){
       acx = item.accel[0];
      console.log('acx ok')
    }
    if(item.accel[1]){
       acy = item.accel[1];
      console.log('acy ok')
    }
    if(item.accel[2]){
       acz = item.accel[2];
      console.log('acz ok')
    }
    if(item.gyro[0]){
       gx = item.gyro[0];
      console.log('gx ok')
    }
    if(item.gyro[1]){
       gy = item.gyro[1];
      console.log('gy ok')
    }
    if(item.gyro[2]){
       gz = item.gyro[2];
      console.log('gz ok')
    }



    console.log('sample sent' +  JSON.stringify(item));

    let sql = "INSERT INTO BTsamples (pulso,temperatura,acx,acy,acz,gx,gy,gz) VALUES (?,?,?,?,?,?,?,?)" ;
    return this.db.executeSql(sql, [p,t,acx,acy, acz, gx, gy, gz]).then(
      value => console.log("retorno insert" + JSON.stringify(value)),
      error => console.log('ERROR! message not inserted')
    );
  }

  createTable(){
    let sql = " CREATE TABLE IF NOT EXISTS BTsamples (id INTEGER PRIMARY KEY AUTOINCREMENT,pulso INTEGER,temperatura INTEGER,acx INTEGER,acy INTEGER,acz INTEGER,gx INTEGER,gy INTEGER,gz INTEGER)"
    return this.db.executeSql(sql, []).then(
      value => console.log('bd creada'),
      error => console.log('bd ya existe')
    );
  }

  delete(sample: any){
    let sql = 'DELETE FROM samples WHERE id=?';
    return this.db.executeSql(sql, [sample.id]);
  }

  getAll(){
    console.log('> > Service.getAll ! ');

    let sql = 'SELECT * FROM BTsamples';
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
    let sql = 'SELECT COUNT(*) FROM samples';
    return this.db.executeSql(sql, []).then( response =>{
      console.log('response getAll() :', response);
    })
  }

}
