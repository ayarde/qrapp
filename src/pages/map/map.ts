import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  lat: number;
  lng: number;

  constructor(public navParams: NavParams, private viewCtrl: ViewController) {

    // this.lat = -24.1857864;
    // this.lng = -65.29947670000001;

    let coordsArray = this.navParams.get("coords").split(",");

    this.lat = Number(coordsArray[0].replace("geo:",""));
    this.lng = Number(coordsArray[1]);

    console.log(this.lat, this.lng);
  }

  close_modal() {
    this.viewCtrl.dismiss();
  }

}
