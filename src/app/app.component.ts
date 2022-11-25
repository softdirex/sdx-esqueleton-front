import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { environment } from 'src/environments/environment';
import { SessionService } from './services/session.service';
import { Commons } from './shared/Commons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'sdxFront';
  // some fields to store our state so we can display it in the UI
  idleState = "NOT_STARTED";
  countdown: number|null = null;
  lastPing: Date|null = null;

  // add parameters for Idle and Keepalive (if using) so Angular will inject them from the module
  constructor(
    private idle: Idle,
    keepalive: Keepalive,
    cd: ChangeDetectorRef,
    private router: Router,
    private sessionService: SessionService
  ) {
    // set idle parameters
    idle.setIdle(environment.sessionTimeMins * 60); // how long can they be inactive before considered idle, in seconds
    idle.setTimeout(5); // how long can they be idle before considered timed out, in seconds
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); // provide sources that will "interrupt" aka provide events indicating the user is active

    // do something when the user becomes idle
    idle.onIdleStart.subscribe(() => {
      this.closeSession()
      this.idleState = "IDLE";
    });
    // do something when the user is no longer idle
    idle.onIdleEnd.subscribe(() => {
      Commons.sessionRenew()
      this.idleState = "NOT_IDLE";
      this.countdown = null;
      cd.detectChanges(); // how do i avoid this kludge?
    });
    // do something when the user has timed out
    idle.onTimeout.subscribe(() => {
      this.closeSession()
      this.idleState = "TIMED_OUT"
    });
    // do something as the timeout countdown does its thing
    idle.onTimeoutWarning.subscribe(seconds => this.countdown = seconds);

    // set keepalive parameters, omit if not using keepalive
    keepalive.interval(15); // will ping at this interval while not idle, in seconds
    keepalive.onPing.subscribe(() => this.lastPing = new Date()); // do something when it pings

    this.sessionService.getUserLoggedIn().subscribe(userLoggedIn => {
      if (userLoggedIn) {
        this.reset()
      } else {
        idle.stop();
      }
    })
  }

  reset() {
    // we'll call this method when we want to start/reset the idle process
    // reset any component state and be sure to call idle.watch()
    this.idle.watch();
    this.idleState = "NOT_IDLE";
    this.countdown = null;
    this.lastPing = null;
  }

  ngOnInit(): void {
    // right when the component initializes, start reset state and start watching
    this.reset();
  }

  closeSession() {
    if (Commons.sessionIsOpen()) {
      this.idleState = "TIMED_OUT"
      this.sessionService.setUserLoggedIn(false);
      Commons.sessionClose()
      this.router.navigate([Commons.PATH_LOGIN], { queryParams: { arg: 'closed' } })
    }
  }
}
