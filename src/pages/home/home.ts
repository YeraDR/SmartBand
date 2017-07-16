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

  clearStore(){
    let a = window.localStorage.getItem('arduino');
    console.log(a);
    window.localStorage.clear();
    let b = window.localStorage.getItem('arduino');
    console.log(b);
  }

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
    this.bluetoothStorageService.insert(messageData).then((data)=>{
      console.log('se envió ' + JSON.stringify(messageData));
      console.log('data result of insert' + data);
    });
  }
}
