import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { SQLite } from 'ionic-native';

interface SampleInsertPayload {
	pulso: number;
	temperatura: number;
	acx: number;
	acy: number;
	acz: number;
	gx: number;
	gy: number;
	gz: number;
}

interface SampleItem extends SampleInsertPayload {
	id: number;
}

interface SampleInsertPartialPayload {
	id: number;
	pulso?: number;
	temperatura?: number;
	acx?: number;
	acy?: number;
	acz?: number;
	gx?: number;
	gy?: number;
	gz?: number;
}

/*
  Generated class for the BluetoothStorageService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
// declare var window :any
@Injectable()
export class BluetoothStorageService {
	private db: SQLite;
	private ready$: Subject<void>;
  constructor() {
		this.db = new SQLite;
		this.ready$ = new Subject<void>();
  }

	openDB(): Observable<any> {
		console.log('en openDB');
		let name = 'data.db';
		let location = 'default';
		return Observable.fromPromise(this.db.openDatabase({ name, location }))
			.do(() => console.log('OPENED DATA BASE!'))
			.switchMap(() => this.prepareDatabase())
			.do(() => this.ready$.complete());
	}

  // add new message to db
  insert(sample: SampleInsertPayload): Observable<any> {
    console.log('> > Service.insert ! ');
    let sql = "INSERT INTO samples(pulso,temperatura,acx,acy,acz,gx,gy,gz) VALUES (?,?,?,?,?,?,?,?)" ;
		let params = [
			sample.pulso,
			sample.temperatura,
			sample.acx,
			sample.acy,
			sample.acz,
			sample.gx,
			sample.gy,
			sample.gz
		];
		return this.chain(sql, params)
			.do(value => console.log("retorno insert" + JSON.stringify(value)))
			.catch(error => {
				console.log('ERROR! message not inserted');
				return Observable.throw(error);
			});
  }

  delete(sample: {id:number}): Observable<any> {
		let sql = 'DELETE FROM samples WHERE id=?';
		let params = [sample.id];
    return this.chain(sql, params);
  }

  getAll(): Observable<any> {
    console.log('> > Service.getAll ! ');
    let sql = 'SELECT * FROM samples';
    return this.chain(sql)
			.do(response =>{
				console.log('response getAll() :', response.rows);
				// let messages = [];
				// for (let index = 0; index < response.rows.length; index++){
				// 	messages.push( response.rows.item(index));
				// }
				// return Promise.resolve(messages);
			})
  }
  countRows() {
    let sql = 'SELECT COUNT(*) FROM samples';
    return this.chain(sql)
			.do(response => console.log('response getAll() :', response));
  }
	private prepareDatabase() {
		let sql = `
			CREATE TABLE IF NOT EXISTS samples (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				pulso INTEGER,
				temperatura INTEGER,
				acx INTEGER,
				acy INTEGER,
				acz INTEGER,
				gx INTEGER,
				gy INTEGER,
				gz INTEGER
			)`;
    return this.chain(sql);
	}
	private chain<T>(q:string, params=[]) {
		return Observable.concat(this.ready$, Observable.of(1))
			.switchMap(() => this.db.executeSql(q, params));
	}
}
