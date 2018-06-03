import { Component } from '@angular/core';

//Components
import { ToastController, Platform } from 'ionic-angular';

//Plugins
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

//Service
import { HistorialProvider } from '../../providers/historial/historial';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(private barcodeScanner: BarcodeScanner,
              private toastCtrl: ToastController,
              private platform: Platform,
              private _historialService: HistorialProvider) { }

  scan() {
      console.log("Doing scan...");

      if(!this.platform.is('cordova')) {
        //this._historialService.addHistorial("http://google.com.ar");
        //this._historialService.addHistorial("geo:-24.1857864,-65.29947670000001");
        this._historialService.addHistorial("MATMSG:TO:adrian.ayarde@gmail.com;SUB:Hello World;BODY:Hello Ionic World!;;");
//         this._historialService.addHistorial( `BEGIN:VCARD
// VERSION:2.1
// N:Kent;Clark
// FN:Clark Kent
// ORG:
// TEL;HOME;VOICE:12345
// TEL;TYPE=cell:67890
// ADR;TYPE=work:;;;
// EMAIL:clark@superman.com
// END:VCARD` );
        return;
      }

      this.barcodeScanner.scan().then(barcodeData => {

        console.log('result:'+ JSON.stringify( barcodeData ));

        if ( barcodeData.cancelled == false && barcodeData.text != null) {
          this._historialService.addHistorial(barcodeData.text);
        }

      }).catch(err => {
          console.log('Error', err);
          this.showError('Error: ' + err);
      });
  }

  showError(message:string) {

    let toast = this.toastCtrl.create({
      message: message,
      duration: 2500
    });
    toast.present();

  }


}
