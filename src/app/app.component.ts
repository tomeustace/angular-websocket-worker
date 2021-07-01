import { Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';

export interface WebSocketControl {
  control: 'close' | 'open' | 'send';
}
export enum WebSocketEvent {
  CLOSE = "close",
  OPEN = "open",
  SEND = "send"
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-websocket-worker';
  worker: Worker;

  @ViewChild('message') toTarget: ElementRef;

  ngAfterViewInit() {
    fromEvent(this.toTarget.nativeElement, 'keyup')
      .subscribe((res: any) => console.log(res.target.value));
  }

  ngOnInit() { }

  openWebSocket() {
    if (typeof Worker !== 'undefined') {
      // Create a new
      this.worker = new Worker('./app.worker', { type: 'module' });
      this.worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data}`);
      };
      this.worker.postMessage(WebSocketEvent.OPEN);
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  sendMessage(message: string) {
    this.worker.postMessage({event: WebSocketEvent.SEND, message});
  }

  textAreaValue(value) {
    console.log("text are value", value);
  }
}

