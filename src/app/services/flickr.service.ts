import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap} from 'rxjs/operators';

export interface IFlickrRes {
  photos: any[],
  isLastPage: boolean
}

@Injectable()
export class FlickrService {

  private pages: number;
  private currentPage: number;
  private term: string;
  private baseUrl = `${environment.api}`;
  private query = `?api_key=bac9f1ccfd854f27894fd47c4f01b1e8&method=flickr.photos.search&safe_search=1&
    format=json&nojsoncallback=1&api_key=bac9f1ccfd854f27894fd47c4f01b1e8&content_type=1&is_getty=1&text=`;

  constructor(private http: HttpClient) {
  }

  public search(terms: Observable<string>): Observable<IFlickrRes> {
    return terms.pipe(
      debounceTime(600),
      distinctUntilChanged(),
      switchMap(term => this.searchPhotos(term))
    );
  }

  searchPhotos(term: string): Observable<IFlickrRes> {
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

  getNextPage(): Observable<IFlickrRes> {
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

  getImageUrl(image): string {
    return `https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}_m.jpg`;
  }
}
