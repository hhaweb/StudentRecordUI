import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { UtilityService } from './utility.service';


@Injectable()
export class GolbalErrorHandlerService implements ErrorHandler {
  constructor(
    private utilityService: UtilityService,
    private zone: NgZone
  ) {}

  handleError(error: Error) {
    this.zone.run(() => this.utilityService.errorSidebarOpen(error.message));
  }
}
