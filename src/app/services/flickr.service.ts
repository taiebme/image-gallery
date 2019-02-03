import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {FlickrRes} from '../models/flicker-response';

@Injectable()
export class FlickrService {

  // holds number of available pages
  private pages: number;
  // holds current page number for farther calls
  private currentPage: number;
  private term: string;
  // get api url from environment configuration
  private baseUrl = `${environment.api}`;
  // get api query parameters from environment configuration
  private query = `${environment.apiQueryParams}`;

  constructor(private http: HttpClient) {
  }

  // manipulate search photo calls in order to reduce number of API calls
  public search(terms: Observable<string>): Observable<FlickrRes> {
    return terms.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      switchMap(term => this.searchPhotos(term))
    );
  }

  // call flickr search photo API
  searchPhotos(term: string): Observable<FlickrRes> {
    return this.http
      .get(`${this.baseUrl}${this.query}${term}`)
      .pipe(
        map((res: any) => {
          this.currentPage = res.photos.page;
          this.pages = res.photos.pages;
          this.term = term;
          return {
            photos: res.photos.photo,
            isLastPage: this.currentPage === this.pages
          };
        })
      )
  }

  // get next page of current search query
  getNextPage(): Observable<FlickrRes> {
    if (this.currentPage < this.pages) {
      return this.http
        .get(`${this.baseUrl}${this.query}${this.term}&page=${++this.currentPage}`)
        .pipe(
          map((res: any) => {
            return {
              photos: res.photos.photo,
              isLastPage: this.currentPage === this.pages
            };
          })
        );
    }
  }

  // get medium image size url
  getImageUrl(image): string {
    return `https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}_m.jpg`;
  }

  // get large image size url
  getFullSizeUrl(image): string {
    return `https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}_b.jpg`;
  }
}
