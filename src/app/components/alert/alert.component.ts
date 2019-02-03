import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {AlertService} from '../../services/alert.service';
import {AlertMessage} from '../../models';

@Component({
  selector: 'app-alert-message',
  template: `
    <div class="row">
      <div class="col-md-6 offset-md-3">

        <div *ngIf="message"
             [ngClass]="{ 'alert': message, 'alert-secondary': !message.error, 'alert-danger': message.error }">
          {{message.text}}
        </div>
      </div>
    </div>`
})

export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  message: AlertMessage;

  constructor(private alertService: AlertService) {
  }

  ngOnInit() {
    this.subscription = this.alertService.getMessage().subscribe(message => {
      this.message = message;
      setTimeout(() => {
        this.message = null;
      }, 2000);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
