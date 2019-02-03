import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {FlickrService} from '../../services/flickr.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {

  @Input() images: any[];

  public fullSizeImageUrl: string;

  private modalRef: BsModalRef;

  constructor(private flickrService: FlickrService,
              private modalService: BsModalService) {
  }

  // get image url source
  getImageUrl(image): string {
    return this.flickrService.getImageUrl(image);
  }

  showFullSizeImage(image:any ,template: TemplateRef<any>) {
    this.fullSizeImageUrl = this.flickrService.getFullSizeUrl(image);
    this.modalRef = this.modalService.show(template);
  }
}
