import {Component, HostListener, OnDestroy} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {FlickrService} from './services/flickr.service';

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

  constructor(private flickrService: FlickrService) {
    // subscription for flicker service search callback
    this.searchSubscription = flickrService.search(this.searchTerm$)
      .subscribe(res => {
        this.images = res.photos;
        this.isLastPage = res.isLastPage;
        this.showLoader = false;
      });
  }

  // call flickr service when search query changed
  searchImages(searchQuery: string): void {
    this.images = [];
    if (searchQuery && searchQuery.trim()) {
      this.showLoader = true;
      this.searchTerm$.next(searchQuery);
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
    if(!this.isLastPage){
      this.showLoader = true;
      this.flickrService.getNextPage().subscribe(res => {
          this.isLastPage = res.isLastPage;
          this.images.push(...res.photos);
          this.showLoader = false;
        }
      );
    }
  }

  //
  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }
}
