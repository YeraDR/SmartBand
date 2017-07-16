import { Component , ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
//import { Storage } from '@ionic/storage'
import { Chart } from 'chart.js';
import { BluetoothStorageService } from '../../providers/bluetooth-storage-service';






@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})

export class AboutPage {
  @ViewChild('lineCanvas') lineCanvas;
  @ViewChild('barCanvas') barCanvas;
  lineChart: any;
  barChart: any;
  objectString : any;

  //valorDeLS: string = 'blabla';

  constructor(public navCtrl: NavController, public bluetoothStorageService:BluetoothStorageService) {
    // get data from localStorage
    // this.processData(dataStored);
    // console.log('storageData > !! ');
    // console.log(dataStored);
    // let a  = storage.get('arduino');
    // console.log(' Esto es storage data en about');
    // console.log(a)
    //this.processData();
    //var dataStored = new Array(JSON.parse(storage.get('arduino')));

  }



  readFromLs = () => {
   this.objectString = JSON.stringify(this.bluetoothStorageService.getAll());
   console.log('bd en about.ts' + this.objectString);

   let prueba = this.bluetoothStorageService.countRows().then((item)=>{
     console.log('item' +  item);
   });
   console.log('prueba' + JSON.stringify(prueba) ); 

  //  arrayTemperatura.map(item => [item.temperature , item.timeStamp]);

  //  console.log('arrayTemperatura', arrayTemperatura);


  }


  ionViewDidLoad() {
        this.barChart = new Chart(this.barCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
                datasets: [{
                    label: 'Temperaturas',
                    data: [12, 19, 3, 5, 2, 3, 9],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 211, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 99, 211, 0.2)'

                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }

        });

        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                    {
                        label: "My First dataset",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [65, 59, 80, 81, 56, 55, 40],
                        spanGaps: false,
                    }
                ]
            }

        });
    }

}
