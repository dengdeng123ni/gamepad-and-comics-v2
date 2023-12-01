import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ImageService, MessageFetchService } from 'src/app/library/public-api';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent {
  @Input() src: string="";
  @Input() width: string | number | null="";
  @Input() height: string | number | null="";
  @Input() alt: string | number | null="";
  url: SafeUrl | undefined
  @ViewChild('box')
  box!: ElementRef;
  @Input() objectFit:string=""
  constructor(public image:ImageService){
    // console.log(this.src);



  }


  async getImage(str:string){
    // console.log(str.split("/")[3]);

    if(this.src.includes("small")){
      this.url=await this.image.getLocalSmallBlobUrl(this.src)
    }else if(this.src.includes("temporary_file_image")){
      console.log(str);

      this.url=await this.image.getTemporary_file_image(str) as any;

    }else{
      this.url=await this.image.getImage(str);
    }


  }

  ngAfterViewInit() {
    this.getImage(this.src)
  }
  ngOnDestroy() {
    this.image.delBlobUrl(this.src,this.url as any);
  }
}
