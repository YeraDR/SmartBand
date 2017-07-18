import { Component , ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
//import { Storage } from '@ionic/storage'
import { Chart } from 'chart.js';
import { BluetoothStorageService } from '../../providers/bluetooth-storage-service';
import * as moment from 'moment';







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
  currentStep : any;


  date: moment.Moment;


  bdata: any[] = [];
  arrayTemperature: any[] = [];
  arrayPulse: any[] = [];
  arrayTimeStamp: any[] = [];
  lastSteps: any[] = [];
  datesStep : any [] = [];



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
    let date = moment().format("YYYY-MM-DD HH:mm:ss");
    let lastDay = moment(date).subtract(1,'day').format("YYYY-MM-DD HH:mm:ss");


   this.bluetoothStorageService.getPerDay(lastDay)
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

  getStep(){

    let date = moment().format("YYYY-MM-DD HH:mm:ss");

    let lastDay = moment(date).subtract(7,'day').format("YYYY-MM-DD HH:mm:ss");
    this.bluetoothStorageService.getStepPerDay(lastDay)
      .then( data => {
        console.log(' step data ' + JSON.stringify(data));
        this.proceessStep(data);
      })
      .catch(error => {
        console.log('step data error' + error)
      })

  }

  proceessStep(data){
    let temp : any [] = [];
    let date = moment().format("YYYY-MM-DD HH:mm:ss");
    this.lastSteps = [];
    let td : any [] = [];

    console.log('data entry' +  data );
    for(let i =7; i>0; i--){
      this.datesStep.push(moment(date).subtract(i,'day').format("YYYY-MM-DD HH:mm:ss"));

      data.forEach((item) =>{
        let a = moment(date).subtract(i+1,'day').format("YYYY-MM-DD HH:mm:ss");
        let b = moment(date).subtract(i-1,'day').format("YYYY-MM-DD HH:mm:ss");
        if( item.timeStamp > a &&  item.timeStamp <  b ){
          td.push(item);
        }
      })
      this.lastSteps.push(td.length);
    //  this.lastSteps.push( temp.map(item => item.timeStamp < moment(date).subtract(i,'day').format("YYYY-MM-DD HH:mm:ss") ).length)
    }
    this.currentStep = this.lastSteps[6];
    this.datesStep = this.datesStep.map(item => moment(item).format("DD-MM-YYYY"));


    console.log('lastSteps length' + JSON.stringify(this.lastSteps));
  }

  showBD(items){
    this.getStep();
    console.log('datos bd' + JSON.stringify(items));
    let currentSample = items[items.length-1];

    //currentSample of the day


    this.currentPulse = JSON.stringify(currentSample.pulso/10);
    this.currentTemperature = JSON.stringify(currentSample.temperatura);

    this.arrayTemperature  = items.map(item => item.temperatura );
    this.arrayPulse  = items.map(item => item.pulso/10 );
    this.arrayTimeStamp = items.map(item => moment(item.timeStamp).format("HH:mm:ss"));

    console.log(' array of temp' + this.arrayTemperature);
    console.log(' array of pulse' + this.arrayPulse);


    this.drawGraph();

  }


  drawGraph() {
        this.barChart = new Chart(this.barCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: this.datesStep,
                datasets: [{
                    label: 'Steps',
                    data: this.lastSteps,
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
                        label: ["temp"],
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(3, 169, 244,0.4)",
                        borderColor: "rgba(3, 169, 244,1.0)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(3, 169, 244,1.0)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(3, 169, 244,1.0)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: this.arrayTemperature,
                        spanGaps: false,
                    },
                    {
                        label: ["pulse"],
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(244, 67, 54,0.4)",
                        borderColor: "rgba(244, 67, 54,1.0)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(244, 67, 54,1.0)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(244, 67, 54,1.0)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: this.arrayPulse ,
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
