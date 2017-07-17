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
  lineChart2: any;
  barChart: any;
  objectString : any;
  currentPulse : any;
  currentTemperature : any;



  bdata: any[] = [];
  arrayTemperature: any[] = [];
  arrayPulse: any[] = [];
  arrayTimeStamp: any[] = [];

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



  readAll = () => {
    console.log('dentro del readAll');
   this.bluetoothStorageService.getAll()
    .then(data => {
      console.log('bd data ' + JSON.stringify(data));
      this.showBD(this.bdata = data);
    })
    .catch(error =>{
      console.log('error getAll'+ error);
    });

  //  arrayTemperatura.map(item => [item.temperature , item.timeStamp]);
  //  this.getMax();
  }

  showBD(items){
    console.log('datos bd' + JSON.stringify(items));
    let currentSample = items[items.length-1];
    this.currentPulse = JSON.stringify(currentSample.pulso);
    this.currentTemperature = JSON.stringify(currentSample.temperatura);

    this.arrayTemperature  = items.map(item => item.temperatura );
    this.arrayPulse  = items.map(item => item.pulso );
    this.arrayTimeStamp = items.map(item => item.timeStamp);

    console.log(' array of temp' + this.arrayTemperature);
    console.log(' array of pulse' + this.arrayPulse);


    this.drawGraph();

  }


  drawGraph() {
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
                labels: this.arrayTimeStamp,
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
                        data: [[this.arrayPulse] ,[this.arrayTemperature]],
                        spanGaps: false,
                    }
                ]
            }

        });
        // this.lineChart2 = new Chart(this.lineCanvas2.nativeElement, {
        //     type: 'line',
        //     data: {
        //         labels: this.arrayTimeStamp,
        //         datasets: [
        //             {
        //                 label: "My second dataset",
        //                 fill: false,
        //                 lineTension: 0.1,
        //                 backgroundColor: "rgba(75,192,192,0.4)",
        //                 borderColor: "rgba(75,192,192,1)",
        //                 borderCapStyle: 'butt',
        //                 borderDash: [],
        //                 borderDashOffset: 0.0,
        //                 borderJoinStyle: 'miter',
        //                 pointBorderColor: "rgba(75,192,192,1)",
        //                 pointBackgroundColor: "#fff",
        //                 pointBorderWidth: 1,
        //                 pointHoverRadius: 5,
        //                 pointHoverBackgroundColor: "rgba(75,192,192,1)",
        //                 pointHoverBorderColor: "rgba(220,220,220,1)",
        //                 pointHoverBorderWidth: 2,
        //                 pointRadius: 1,
        //                 pointHitRadius: 10,
        //                 data: this.arrayTemperature,
        //                 spanGaps: false,
        //             }
        //         ]
        //     }
        //
        // });
    }

}
