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

    BluetoothSerial.connect(device.address).subscribe((result)=>{
      console.log("Connect To Device");
      console.log(result);
      if(result === "OK"){
        console.log("dentro de OK ");
        BluetoothSerial.subscribe("\n").subscribe((data) => {
          console.log("Recibido:    " + data);
          this.nativeStorage.getItem('arduino')
            .then(
              data => {console.log("arduino: " + data);dataStored = JSON.parse(data);},
              error => console.error(error)
          );

          console.log("dataStored:     " + dataStored);

          var dataItem = JSON.parse(data);
          console.log("A guardar: " + JSON.stringify(dataItem));

          //dataStored.concat(dataItem);
          dataStored.push(dataItem);
          //dataStored.push(dataItem);
          console.log("Guardado:    " + JSON.stringify(dataStored));

        this.nativeStorage.setItem('arduino', JSON.stringify(dataStored))
        .then(
          () => console.log('Stored item!'),
          error => console.error('Error storing item', error)
        );

        console.log('esto es lo que hay en STORAGE');
        this.nativeStorage.getItem('arduino')
          .then(
            data => console.log(data),
            error => console.error(error)
          );

        } );



      }
    });

  }

}
