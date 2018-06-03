import { Injectable } from '@angular/core';
import { ScanData } from '../../models/scan-data.model';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';

import { ModalController, Platform, ToastController } from 'ionic-angular';
import { MapPage } from '../../pages/map/map';
/*
  Generated class for the HistorialProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HistorialProvider {

  private _historial:ScanData[] =[];

  constructor(private iab: InAppBrowser, private modalCtrl: ModalController,
              private contacts: Contacts,
              private platform: Platform,
              private toastCtrl: ToastController) {}

  addHistorial(text:string) {
    let data = new ScanData(text);

    this._historial.unshift(data);

    console.log("Historial: " + this._historial);

    this.openScan(0);
  }

  loadHistorial() {
    return this._historial;
  }

  openScan(index: number) {
    let scanData = this._historial[index];
    console.log(scanData);

    switch (scanData.type) {
      case "http":
        this.iab.create(scanData.info, "_system");
      break;

      case "map":
        this.modalCtrl.create(MapPage, {coords: scanData.info}).present();
      break;

      case "contact":
        this.createContact(scanData.info);
      break;

      case "email":
        let htmlLink = scanData.info;

        htmlLink = htmlLink.replace("MATMSG:TO:","mailto:");
        htmlLink = htmlLink.replace(";SUB:","?subject=");
        htmlLink = htmlLink.replace(";BODY:","&body=");
        htmlLink = htmlLink.replace(";","");
        htmlLink = htmlLink.replace(/ /g,"%20");

        console.log(htmlLink);
        this.iab.create(htmlLink, "_system");
      break;

      default:
        console.error("Type is not supported");
    }
  }

  private createContact(text:string){
    let field:any = this.parse_vcard(text);

    console.log(field);


    let name = field['fn'];
    let phone = field.tel[0].value[0];

    if(!this.platform.is('cordova')){
      console.warn("I am in the computer, I don't create a contact");
      return;
    }

    let contact: Contact = this.contacts.create();

    contact.name = new ContactName(null, name);
    contact.phoneNumbers = [ new ContactField('mobile', phone)];

    contact.save().then(
      () => this.create_toast("Contact" + name + "created!"),
      (error) => this.create_toast("Error:" + error)
    );
  }

  private create_toast(message:string){
    this.toastCtrl.create({
      message: message,
      duration: 2500
    }).present();
  }


  private parse_vcard( input:string ) {

    var Re1 = /^(version|fn|title|org):(.+)$/i;
    var Re2 = /^([^:;]+);([^:]+):(.+)$/;
    var ReKey = /item\d{1,2}\./;
    var fields = {};

    input.split(/\r\n|\r|\n/).forEach(function (line) {
      var results, key;

      if (Re1.test(line)) {
        results = line.match(Re1);
        key = results[1].toLowerCase();
        fields[key] = results[2];
      } else if (Re2.test(line)) {
        results = line.match(Re2);
        key = results[1].replace(ReKey, '').toLowerCase();

        var meta = {};
        results[2].split(';')
        .map(function (p, i) {
          var match = p.match(/([a-z]+)=(.*)/i);
          if (match) {
            return [match[1], match[2]];
          } else {
            return ["TYPE" + (i === 0 ? "" : i), p];
          }
        })
        .forEach(function (p) {
          meta[p[0]] = p[1];
        });

        if (!fields[key]) fields[key] = [];

        fields[key].push({
          meta: meta,
          value: results[3].split(';')
        })
      }
    });

    return fields;
  };
}
