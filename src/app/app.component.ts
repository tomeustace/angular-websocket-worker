import { Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';

export interface WebSocketControl {
  control: 'close' | 'open' | 'send';
}
export enum WebSocketEvent {
  CLOSE = "close",
  OPEN = "open",
  MESSAGE = "message"
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-websocket-worker';
  worker: Worker;
  state: WebSocketEvent;

  receivedMessage: string;
  sentMessage: string;

  @ViewChild('txtMessage') toTarget: ElementRef;

  ngAfterViewInit() {
    fromEvent(this.toTarget.nativeElement, 'keyup')
      .subscribe((res: any) => {
        this.sentMessage = res.target.value;
      });
  }

  openWebSocket() {
    if (typeof Worker !== 'undefined') {

      this.worker = new Worker('./app.worker', { type: 'module' });

      this.worker.onmessage = ({ data }) => {
        if (data.event === WebSocketEvent.OPEN) {
          this.state = WebSocketEvent.OPEN;
        }
        if (data.event === WebSocketEvent.CLOSE) {
          this.state = WebSocketEvent.CLOSE;
        }
        if (data.event === WebSocketEvent.MESSAGE) {
          this.receivedMessage = data.message;
        }
      };

      this.worker.postMessage({ event: WebSocketEvent.OPEN });
    } else {
      // Worker not supported!!!
    }
  }

  closeWebSocket() {
    this.worker.postMessage({ event: WebSocketEvent.CLOSE });
  }

  sendMessage() {
    this.worker.postMessage({event: WebSocketEvent.MESSAGE, message: this.sentMessage});
  }

  textAreaValue(value) {
    console.log("text are value", value);
  }
}

