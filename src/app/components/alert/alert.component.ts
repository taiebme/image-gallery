import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {AlertService} from '../../services/alert.service';
import {AlertMessage} from '../../models';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert.component.html'
})

export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  message: AlertMessage;

  constructor(private alertService: AlertService) {
  }

  // subscription for new message via alert service
  ngOnInit() {
    this.subscription = this.alertService.getMessage().subscribe(message => {
      this.message = message;
      setTimeout(() => {
        this.message = null;
      }, 2000);
    });
  }

  // unsubscribe on destroy
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
