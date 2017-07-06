import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {DevicePage} from '../device/device';
import {BluetoothSerial} from 'ionic-native';///bluetooth-serial';
import { Storage, SqlStorage } from 'ionic-framework/ionic';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  devicesArray = [];
  isScanning = false;
  text:string;

  constructor(public navCtrl: NavController) {
    this.text="no connected!";
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

    let d = device;
    BluetoothSerial.connect(device.address).subscribe((result)=>{
      console.log("Connect To Device");
      console.log(result);
      if(result === "OK"){
        console.log("dentro de OK ");
        BluetoothSerial.subscribe("\n").subscribe((data) => {
          console.log("Recibido:    " + data);
          var dataStored = new Array(JSON.parse(localStorage.getItem("arduino")));
          console.log("dataStored:     " + dataStored);
          var dataItem = JSON.parse(data);
          console.log("A guardar: " + JSON.stringify(dataItem));
          dataStored.push(JSON.stringify(dataItem));
          console.log("Guardado:    " + dataStored);
          localStorage.setItem("arduino", JSON.stringify(dataStored));
        } );

      }
    });

  }

}
