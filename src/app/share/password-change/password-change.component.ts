import { Router } from '@angular/router';
import { UtilityService } from './../../service/utility/utility.service';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/service/utility/authentication.service';
import { HttpResponseData } from 'src/app/model/config-model/response.data';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit {
  password: string;
  passwordRe: string;
  inputType1: string;
  inputType2: string;


  inputIcon1: string;
  inputIcon2: string;
  constructor(
    private utilityService: UtilityService,
    private authenticationService: AuthenticationService,
    private router: Router,
    public app: AppComponent
  ) { }

  ngOnInit(): void {
    this.inputType1 = 'password';
    this.inputType2 = 'password';

    this.inputIcon1 = 'pi pi-eye';
    this.inputIcon2 = 'pi pi-eye';
  }

  save() {
    if(!this.password || !this.passwordRe) {
      this.utilityService.showWarning('Warning', 'Please enter password');
      return;
    }
    if(this.password !== this.passwordRe) {
      this.utilityService.showWarning('Warning', 'Password does not match!');
      return;
    }

    this.utilityService.showLoading('Changing...')
    this.authenticationService.changePassword(this.passwordRe).subscribe(
      (response: HttpResponseData) => {
        if(response.status) {
          void this.router.navigate(['student/student-details/' + this.app.configData.studentId + '/view']);

        } else {
          this.utilityService.showError('Error', response.message);
        }
      }, (error: any) => {
        this.utilityService.subscribeError(error, 'Unable to change password');
      }, () => {
        this.utilityService.hideLoading();
      }
    );
  }

  showPassword(p: string) {
    if(p=='p1') {
      this.inputIcon1 =  this.inputIcon1 == 'pi pi-eye' ? 'pi pi-eye-slash' : 'pi pi-eye';
      this.inputType1 = this.inputType1 == 'password' ? 'text' : 'password';
    }

    if(p=='p2') {
      this.inputIcon2 =  this.inputIcon2 == 'pi pi-eye' ? 'pi pi-eye-slash' : 'pi pi-eye';
      this.inputType2 = this.inputType2 == 'password' ? 'text' : 'password';
    }
  }
}
