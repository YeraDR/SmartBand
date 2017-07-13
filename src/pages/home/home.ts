import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//import {DevicePage} from '../device/device';
import {BluetoothSerial} from 'ionic-native';///bluetooth-serial';
//import { Storage } from '@ionic/storage';
import { NativeStorage } from '@ionic-native/native-storage';





@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  devicesArray = [];
  isScanning = false;
  text:string;
  valorDeLS: string = 'blabla';


  constructor(public navCtrl: NavController, public nativeStorage: NativeStorage) {
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
    var dataStored = [];

    // connect to device
    BluetoothSerial.connect(device.address).subscribe((result)=>{
      if(result === "OK"){

        // si connect OK -> leemos datos
        BluetoothSerial.subscribe("\n").subscribe((bluetoothSerialData) => {
          console.log("Recibido:    " + bluetoothSerialData);

          // obtenemos lo que hay en el localStorage
          this.valorDeLS = window.localStorage.getItem('arduino');
          console.log('valorDeLS', this.valorDeLS);
          //si no existe datos en el localStorage
          if(this.valorDeLS != null){
            dataStored = JSON.parse(this.valorDeLS);
          };
          console.log("dataStored:     " + dataStored);
          //si ya habia datos en el localStorage
          if(dataStored){
            dataStored.push(bluetoothSerialData);
            window.localStorage.setItem('arduino', JSON.stringify(dataStored));
          }
          //si el localStorage estaba vacio
          else{
            let primero = [];
            primero.push(bluetoothSerialData);
            window.localStorage.setItem('arduino', JSON.stringify(primero));
          }

        });
      }
    });

  }

}
