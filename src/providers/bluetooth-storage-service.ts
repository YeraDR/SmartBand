import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SQLite} from 'ionic-native';
import 'rxjs/add/operator/map';

/*
  Generated class for the BluetoothStorageService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BluetoothStorageService {
  db: SQLite = null;

  constructor(public http: Http) {
    console.log('Hello BluetoothStorageService Provider');
    this.db = new SQLite();
  }

  // add new message to db
  insert(message: any){
    console.log('> > Service.insert ! ');

    let mssg = JSON.stringify(message);
    let item = JSON.parse(mssg);

    console.log('item' + item);
    console.log(JSON.stringify(item));

    let sql = "INSERT INTO messages(pulso,temperatura,acx,acy,acz,gx,gy,gz) VALUES (?,?,?,?,?,?,?,?)" ;
    return this.db.executeSql(sql, [item.pulso,item.temperatura, item.acx, item.acy, item.acz, item.gx, item.gy, item.gz]).then(
      value => console.log("retorno insert" + JSON.stringify(value)),
      error => console.log('ERROR! message not inserted')
    );
  }

  createTable(){
    let sql = " CREATE TABLE IF NOT EXISTS messages(id INTEGER PRIMARY KEY AUTOINCREMENT,pulso INTEGER,temperatura INTEGER,acx INTEGER,acy INTEGER,acz INTEGER,gx INTEGER,gy INTEGER,gz INTEGER)"
    return this.db.executeSql(sql, []);
  }

  delete(message: any){
    let sql = 'DELETE FROM messages WHERE id=?';
    return this.db.executeSql(sql, [message.id]);
  }

  getAll(){
    console.log('> > Service.getAll ! ');

    let sql = 'SELECT * FROM messages';
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
    let sql = 'SELECT COUNT(*) FROM messages';
    return this.db.executeSql(sql, []).then( response =>{
      console.log('response getAll() :', response);
    })
  }

  openDatabase(){
    return this.db.openDatabase({
      name:'data.db',
      location: 'default'
    })
  }

}
