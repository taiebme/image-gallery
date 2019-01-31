import {Component, Input, OnInit} from '@angular/core';
import {FlickrService} from '../../services/flickr.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {

  @Input() images: any[];
  constructor(private flickrService: FlickrService) { }

  // get image url source
  getImageUrl(image): string {
    return this.flickrService.getImageUrl(image);
  }
}
