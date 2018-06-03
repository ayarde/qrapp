import { Component } from '@angular/core';
import { HistorialProvider } from '../../providers/historial/historial';
import { ScanData } from '../../models/scan-data.model';
/**
 * Generated class for the SavedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-saved',
  templateUrl: 'saved.html',
})
export class SavedPage {

    historial:ScanData[] = [] ;

  constructor( private _historialProvider: HistorialProvider) {
  }

  ionViewDidLoad() {
    this.historial = this._historialProvider.loadHistorial();
  }

  openScand(index:number) {
    this._historialProvider.openScan(index);
  }

}
