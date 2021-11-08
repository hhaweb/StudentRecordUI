import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigData } from 'src/app/model/system/system.model';
import { BroadcasterService } from 'src/app/service/utility/broadcaster.service';

@Injectable()
export class ConfigDataLoadedEvent {
  constructor(private broadcasterService: BroadcasterService) {}

  fire(data: ConfigData): void {
    this.broadcasterService.broadcast(ConfigDataLoadedEvent, data);
  }

  on(): Observable<ConfigData> {
    return this.broadcasterService.on<ConfigData>(ConfigDataLoadedEvent);
  }
}
