import {Injectable} from "@angular/core";
import {LocalStorageService} from './local-storage.service';


@Injectable()
export class SearchHistoryService {

  // search history map data structure for efficient search of terms
  private searchHistoryMap: Object;
  // list of all search history terms
  private searchHistoryList: string[];
  // reference to local storage
  private localStorageRef: any;
  // search history local storage key
  private localStorageKey: string = 'image-gallery-history';

  constructor(private localStorageService: LocalStorageService) {
    this.localStorageRef = this.localStorageService.nativeLocalStorage;
    this.setSearchHistoryDataStructures();
  }

  // initialize of data structures
  setSearchHistoryDataStructures(): void {
    this.searchHistoryMap = {};
    this.searchHistoryList = [];
    const localStorageData = this.localStorageRef.getItem(this.localStorageKey);
    if (localStorageData) {
      this.searchHistoryList = JSON.parse(localStorageData);
      this.searchHistoryList.forEach(term => {
        this.searchHistoryMap[term] = true;
      })
    }
  }

  // add new term to history if it's not exist
  public addTerm(term: string): void {
    if (!this.isTermExist(term)) {
      this.searchHistoryList.push(term);
      this.localStorageRef.setItem(this.localStorageKey, JSON.stringify(this.searchHistoryList));
    }
  }

  // get stored history list
  public getHistoryList(): string[] {
    return this.searchHistoryList;
  }

  // check if term exist in history map object
  private isTermExist(term): boolean{
    return this.searchHistoryMap[term];
  }


}
