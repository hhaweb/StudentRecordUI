import { BroadcasterService } from 'src/app/service/utility/broadcaster.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable()
export class FullScreenService {
  constructor(private broadcasterService: BroadcasterService) {}

  fire(): void {
    this.broadcasterService.broadcast(FullScreenService);
  }

  on(): Observable<any> {
    return this.broadcasterService.on<any>(FullScreenService);
  }
}
