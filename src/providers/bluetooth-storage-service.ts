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
      name:'data.db',
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

    let sql = "INSERT INTO samples(pulso,temperatura,acx,acy,acz,gx,gy,gz) VALUES (?,?,?,?,?,?,?,?)" ;
    return this.db.executeSql(sql, [sample.pulso,sample.temperatura, sample.acx, sample.acy, sample.acz, sample.gx, sample.gy, sample.gz]).then(
      value => console.log("retorno insert" + JSON.stringify(value)),
      error => console.log('ERROR! message not inserted')
    );
  }

  createTable(){
    let sql = " CREATE TABLE IF NOT EXISTS samples (id INTEGER PRIMARY KEY AUTOINCREMENT,pulso INTEGER,temperatura INTEGER,acx INTEGER,acy INTEGER,acz INTEGER,gx INTEGER,gy INTEGER,gz INTEGER)"
    return this.db.executeSql(sql, []);
  }

  delete(sample: any){
    let sql = 'DELETE FROM samples WHERE id=?';
    return this.db.executeSql(sql, [sample.id]);
  }

  getAll(){
    console.log('> > Service.getAll ! ');

    let sql = 'SELECT * FROM samples';
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
