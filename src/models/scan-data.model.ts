export class ScanData {

  info:string;
  type:string;

  constructor(typeFile:string) {

    this.type = "no defined";
    this.info = typeFile;

    if (typeFile.startsWith("http")) {
      this.type = "http";
    } else if(typeFile.startsWith("geo")){
       this.type = "map";
    } else if(typeFile.startsWith("BEGIN:VCARD")) {
       this.type = "contact";
    } else if(typeFile.startsWith("MATMSG")){
        this.type = "email";
    }

  }
}
