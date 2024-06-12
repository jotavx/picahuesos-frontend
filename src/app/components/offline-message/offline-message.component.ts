import { Component, OnInit } from '@angular/core';
import { debounceTime, fromEvent } from 'rxjs';

@Component({
  selector: 'app-offline-message',
  templateUrl: './offline-message.component.html',
  styleUrls: ['./offline-message.component.css'],
})
export class OfflineMessageComponent implements OnInit {
  public netStatus: boolean = true;

  constructor() {}

  ngOnInit(): void {
    fromEvent(window, 'offline')
      .pipe(debounceTime(100))
      .subscribe((event: Event) => {
        console.log(event);
        this.netStatus = false;
      });
    fromEvent(window, 'online')
      .pipe(debounceTime(100))
      .subscribe((event: Event) => {
        console.log(event);
        this.netStatus = true;
      });
  }
}
