import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BluetoothSerial } from 'ionic-native';///bluetooth-serial';
import { BluetoothStorageService } from '../../providers/bluetooth-storage-service';
import * as moment from 'moment';






@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  devicesArray = [];
  isScanning = false;
  text:string;
  valorDeLS: string = 'blabla';

  messages: any[] = [];

  date: moment.Moment;


  constructor(public navCtrl: NavController, public bluetoothStorageService:BluetoothStorageService
  ) {
    this.text="no connected!";

  }

  // clearStore(){
  //   let a = window.localStorage.getItem('arduino');
  //   console.log(a);
  //   window.localStorage.clear();
  //   let b = window.localStorage.getItem('arduino');
  //   console.log(b);
  // }

  startScanning(){
    let arrayDevices = [];
    console.log("Scanning Started");
    this.isScanning = true;
    BluetoothSerial.discoverUnpaired()
      .then (
      (devices) => {
        devices.forEach(function(device) {


          console.log('!! !! !! devices json >> ');
          console.log(JSON.stringify(devices));

          console.log('!! !! !! device json  !! !! !!>> ');
          console.log(JSON.stringify(device));


          arrayDevices.push(device);

        });

        setTimeout(() => {
            console.log("Scanning has stopped");
            //console.log(JSON.stringify(this.devices));
          this.devicesArray = arrayDevices;
          this.isScanning = false;
        }, 3000);
      });
  }

  connectToDevice(device) {
    var dataStored = [];

    // connect to device
    BluetoothSerial.connect(device.address).subscribe((result)=>{
      if(result === "OK"){

        // si connect OK -> leemos datos
        BluetoothSerial.subscribe("\n").subscribe(
          value => this.saveMessage(value),
          error => console.log('ERROR! message not found')
        );
      }
    });
  }

  saveMessage(bluetoothSerialData){
    console.log("Recibido:    " + bluetoothSerialData);
    let messageData = JSON.parse(bluetoothSerialData);

    let date = moment().format("YYYY-MM-DD HH:mm:ss");
    messageData.timeStamp = date;
    //
    // console.log('moment formar date ' + a);

    this.bluetoothStorageService.openDB();
    this.bluetoothStorageService.insert(messageData)
      .then(data=>{
        console.log('insert result' + JSON.stringify(data))
      })
      .catch(error =>{
        console.log('error insert result' )
      })

    if(messageData.accel[0] !=0 && messageData.accel[1] !=0  ){
      console.log('messageData.accel[0]' + JSON.stringify(messageData.accel[0]));
      console.log('messageData.accel[1]' + JSON.stringify(messageData.accel[1]));
      let date = moment().format("YYYY-MM-DD HH:mm:ss");
      let paso = {
        step:1,
        timeStamp:date
      }
      this.bluetoothStorageService.insertStep(paso);
    }
  }


  readAll = () => {
    console.log('dentro del readAll');
   this.bluetoothStorageService.getAll()
    .then(data => {
      console.log('bd data ' + JSON.stringify(data))
    })
    .catch(error =>{
      console.log('error getAll'+ error);
    });

  //  arrayTemperatura.map(item => [item.temperature , item.timeStamp]);

  }
}
