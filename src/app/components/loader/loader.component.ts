import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {

  @Input() show: boolean;

  constructor() { }
}
