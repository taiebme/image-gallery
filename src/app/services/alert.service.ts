import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class AlertService {
  private subject = new Subject<any>();
  private showAlert = false;

  constructor() {
  }

  notify(message: string) {
    this.showAlertMessage();
    this.subject.next({error: false, text: message});
  }
  error(message: string) {
    this.showAlertMessage();
    this.subject.next({error: true, text: message});
  }

  showAlertMessage(): void {
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 2000);

  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
