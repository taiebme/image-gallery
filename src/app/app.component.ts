import {Component, HostListener, OnChanges, SimpleChanges} from '@angular/core';
import {Subject} from 'rxjs';
import {FlickrService, IFlickrRes} from './services/flickr.service';
import {TypeaheadMatch} from 'ngx-bootstrap';
import {SearchHistoryService} from './services/search-history.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public images: any;
  public searchTerm$ = new Subject<string>();
  public showLoader = false;
  public searchValue = [];
  public historyValues: string[];
  public showSaveMessage: boolean;

  private isLastPage: boolean;

  constructor(private flickrService: FlickrService,
              private searchHistoryService: SearchHistoryService) {
    flickrService.search(this.searchTerm$)
      .subscribe(res => {
        this.images = res.photos;
        this.isLastPage = res.isLastPage;
        this.showLoader = false;
      });
  }

  // handler for add query tag
  onAdd($event: any): void {
    this.searchHistoryService.addTerm($event.value);
    this.historyValues = this.searchHistoryService.getHistoryList();
    this.searchImages(this.getSearchQuery());
  }

  // handler for removed query tag
  onRemove($event: string): void {
    this.searchImages(this.getSearchQuery());
  }

  // call flickr service to search photos for the current query value
  searchImages(searchQuery): void {
    this.images = [];
    if (searchQuery) {
      this.showLoader = true;
      this.searchTerm$.next(searchQuery);
    }
  }

  getSearchQuery(): string {
    return this.searchValue.map((term) => {
      return term.value;
    }).join(' ');
  }

  // get photos on typing
  onTextChange($event: string) {
    if($event) {
      this.searchImages(`${this.getSearchQuery()} ${$event}`)
    }
  }
  // listener for window scroll - trigger to load more photos
  @HostListener("window:scroll", ["$event"])
  onWindowScroll(): void {
    if (Math.ceil(window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.getNextPage();
    }
  }

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



  /*onKeyUp(term) {
    if (term && term.length > 2) {
      this.showLoader = true;
      this.searchTerm = term;
      this.searchTerm$.next(term);
    }
    if (!term) {
      this.images = [];
      this.searchTerm = '';
    }
  }*/


}
