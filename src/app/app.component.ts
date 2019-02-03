import {Component, HostListener, OnDestroy} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {FlickrService} from './services/flickr.service';
import {AlertService} from './services/alert.service';
import {FlickrRes} from './models/flicker-response';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  // images array
  public images: any[];
  // search term subject - if change has been detected flickr API will be called
  public searchTerm$ = new Subject<string>();
  // show loader indicator
  public showLoader = false;

  // last page of current search indicator
  private isLastPage: boolean;
  // search subscription reference in order to unsubscribe on component destroy lifecycle hook
  private searchSubscription: Subscription;

  constructor(private flickrService: FlickrService,
              private alertService: AlertService) {
    // subscription for flicker service search callback
    this.searchSubscription = flickrService.search(this.searchTerm$)
      .subscribe(
        this.searchSuccess.bind(this),
        this.onError.bind(this));
  }

  // call flickr service when search query changed
  searchImages(searchQuery: string): void {
    this.images = [];
    if (searchQuery && searchQuery.trim()) {
      this.showLoader = true;
      this.searchTerm$.next(searchQuery);
    }
    else{
      this.showLoader = false;
    }
  }


  // listener for window scroll - trigger to load more photos
  @HostListener("window:scroll", ["$event"])
  onWindowScroll(): void {
    if (!this.showLoader && Math.ceil(window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.getNextPage();
    }
  }

  // get next page for current search if available
  private getNextPage() {
    if (!this.isLastPage) {
      this.showLoader = true;
      this.flickrService.getNextPage().subscribe(
        this.nextPageSuccess.bind(this),
        this.onError.bind(this)
      );
    } else {
      this.alertService.notify('No more images');
    }
  }

  //
  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

  private searchSuccess(res: FlickrRes): void {
    this.images = res.photos;
    this.isLastPage = res.isLastPage;
    this.showLoader = false;
    if (this.images && !this.images.length) {
      this.alertService.notify('No images found');
    }
  }

  private nextPageSuccess(res: any): void {
    this.isLastPage = res.isLastPage;
    this.images.push(...res.photos);
    this.showLoader = false;
  }

  private onError(error: any): void {
    console.log(error);
    this.showLoader = false;
    this.alertService.error('Something went wrong, please try again later...');
  }
}
