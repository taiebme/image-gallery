import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SearchHistoryService} from '../../services/search-history.service';

@Component({
  selector: 'app-image-search',
  templateUrl: './image-search.component.html'
})
export class ImageSearchComponent implements OnInit {


  @Output() onTextChange = new EventEmitter<string>();
  public historyValues: string[];
  public searchValue = [];

  constructor(private searchHistoryService: SearchHistoryService) { }

  ngOnInit() {
    this.historyValues = this.searchHistoryService.getHistoryList();
  }

  // get search query either if it contains historical values or not
  getSearchQuery(): string {
    return this.searchValue.map((term) => {
      return term.value;
    }).join(' ');
  }

  // get photos on typing
  onTextChangeHandler($event: string) {
      this.onTextChange.emit(`${this.getSearchQuery()} ${$event}`)
  }

  // handler for add query tag
  onAddHandler($event: any): void {
    this.searchHistoryService.addTerm($event.value);
    this.historyValues = this.searchHistoryService.getHistoryList();
    this.onTextChange.emit(this.getSearchQuery());
  }

  // handler for removed query tag
  onRemoveHandler($event: string): void {
    this.onTextChange.emit(this.getSearchQuery());
  }

}
