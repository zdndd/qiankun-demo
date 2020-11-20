import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { _HttpClient } from '../../../core/net/http.client';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../../../core/app.service';
import { NzMessageService } from 'ng-zorro-antd';

function mobileValidator(control: FormControl): any {
  const mobileReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  const result = mobileReg.test(control.value);
  return result ? null : { mobile: true };
}

function equalValidatorWithInfo(info) {
  return function equalValidator(group: FormGroup): any {
    const password = group.get('password') as FormControl;
    const confirmPassword = group.get('confirmPassword') as FormControl;
    if (password.touched && confirmPassword.touched && password.valid && confirmPassword.valid) {
      const isEqule: boolean = password.value === confirmPassword.value;
      return isEqule ? null : { equal: { info } };
    }
    return null;
  };
}

@Component({
  selector: 'app-getpwd-page',
  templateUrl: './getpwd.component.html',
  styleUrls: ['./getpwd.component.less']
})
export class GetPwdComponent implements OnInit {
  tabIndex = 0;
  smsForm: FormGroup;
  emailForm: FormGroup;
  smsCodeSending = false;
  emailCodeSending = false;

  smsCodeCd = false;
  emailCodeCd = false;

  smsCodeTime = -1; //秒
  emailCodeTime = -1; //秒

  smsServerMsg = '';
  emailServerMsg = '';

  smsCodeIntervalId = null;
  emailCodeIntervalId = null;

  constructor(
    public translateService: TranslateService,
    public messageService: NzMessageService,
    public appService: AppService,
    public http: _HttpClient,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.smsForm = this.fb.group(
      {
        mobile: this.fb.control('', [
          Validators.required,
          mobileValidator,
          Validators.maxLength(200)
        ]),
        phoneCode: this.fb.control(null, [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4)
        ]),
        password: this.fb.control(null, [Validators.required, Validators.minLength(8)]),
        confirmPassword: this.fb.control(null, [Validators.required])
      },
      { validator: equalValidatorWithInfo }
    );

    this.emailForm = this.fb.group(
      {
        email: this.fb.control('', [
          Validators.required,
          Validators.email,
          Validators.maxLength(200)
        ]),
        emailCode: this.fb.control(null, [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4)
        ]),
        password: this.fb.control(null, [Validators.required, Validators.minLength(8)]),
        confirmPassword: this.fb.control(null, [Validators.required])
      },
      { validator: equalValidatorWithInfo }
    );

    this.smsForm.get('mobile').valueChanges.subscribe(() => {
      this.smsServerMsg = '';
    });

    this.emailForm.get('email').valueChanges.subscribe(() => {
      this.emailServerMsg = '';
    });
  }

  getPwdBySms() {
    for (const i in this.smsForm.controls) {
      this.smsForm.controls[i].markAsTouched();
      this.smsForm.controls[i].updateValueAndValidity();
    }
    console.log(this.smsForm);
    if (this.smsForm.valid) {
      console.log(this.smsForm.value);
      let { mobile, phoneCode, password, confirmPassword } = this.smsForm.value;
      let postData = {
        MobileNumber: mobile,
        ValidationCode: phoneCode,
        Password: password,
        ConfirmPassword: confirmPassword
      };
      this.http.post('unauthorized/RecoverPasswordByMobile', postData).subscribe(
        (res: any) => {
          console.log(res);
          if (res.errorCode == '-1') {
            this.messageService.info(
              this.translateService.instant('Password recovery success tip')
            );
            this.router.navigateByUrl(this.appService.cmpid + '/auth/login');
          }
        },
        error => {}
      );
    }
  }

  getPwdByEmail() {
    for (const i in this.emailForm.controls) {
      this.emailForm.controls[i].markAsTouched();
      this.emailForm.controls[i].updateValueAndValidity();
    }
    console.log(this.emailForm);
    if (this.emailForm.valid) {
      console.log(this.emailForm.value);
      let { email, emailCode, password, confirmPassword } = this.emailForm.value;
      let postData = {
        Email: email,
        ValidationCode: emailCode,
        Password: password,
        ConfirmPassword: confirmPassword
      };
      this.http.post('unauthorized/RecoverPasswordByEmail', postData).subscribe(
        (res: any) => {
          console.log(res);
          if (res.errorCode == '-1') {
            this.messageService.info(
              this.translateService.instant('Password recovery success tip')
            );
            this.router.navigateByUrl(this.appService.cmpid + '/auth/login');
          }
        },
        () => {}
      );
    }
  }

  selectTab(index) {
    this.tabIndex = index;
  }

  sendSmsCode() {
    if (this.smsCodeSending || this.smsCodeCd) {
      return;
    }
    this.smsForm.get('mobile').markAsTouched();
    this.smsForm.get('mobile').updateValueAndValidity();
    if (this.smsForm.get('mobile').valid) {
      this.smsCodeSending = true;
      let sendData = {
        MobileNumber: this.smsForm.get('mobile').value
      };
      this.http.post('unauthorized/SendPhoneValidationCode', sendData).subscribe(
        (res: any) => {
          console.log(res);
          this.smsCodeSending = false;
          if (res.errorCode == '-1') {
            this.startSmsCd();
          } else {
            this.smsServerMsg = res.errorMsg;
          }
        },
        error => {
          this.smsCodeSending = false;
        }
      );
      // setTimeout(() => {
      //     this.smsCodeSending = false;
      //     //this.smsServerMsg = "用户不存在"
      //     //发送成功情况
      //     this.startSmsCd()
      // }, 3000)
    }
  }

  sendEmailCode() {
    if (this.emailCodeSending || this.emailCodeCd) {
      return;
    }
    this.emailForm.get('email').markAsTouched();
    this.emailForm.get('email').updateValueAndValidity();
    if (this.emailForm.get('email').valid) {
      this.emailCodeSending = true;
      let sendData = {
        Email: this.emailForm.get('email').value
      };
      this.http.post('unauthorized/SendMailValidationCode', sendData).subscribe(
        (res: any) => {
          console.log(res);
          this.emailCodeSending = false;
          if (res.errorCode == '-1') {
            this.startEmailCd();
          } else {
            this.emailServerMsg = res.errorMsg;
          }
        },
        error => {
          this.emailCodeSending = false;
        }
      );
      // setTimeout(() => {
      //     this.emailCodeSending = false;
      //     this.emailServerMsg = "邮箱不存在"
      //     //发送成功情况
      //    // this.startEmailCd()
      // }, 3000)
    }
  }

  cancelClick() {
    this.router.navigateByUrl(this.appService.cmpid + '/auth/login');
  }

  startSmsCd() {
    this.smsCodeTime = 100;
    this.smsCodeCd = true;
    this.smsCodeIntervalId = setInterval(() => {
      this.smsCodeTime--;
      if (this.smsCodeTime <= 0) {
        this.smsCodeCd = false;
        clearInterval(this.smsCodeIntervalId);
        this.smsCodeIntervalId = null;
      }
    }, 1000);
  }

  startEmailCd() {
    this.emailCodeTime = 100;
    this.emailCodeCd = true;
    this.emailCodeIntervalId = setInterval(() => {
      this.emailCodeTime--;
      if (this.emailCodeTime <= 0) {
        this.emailCodeCd = false;
        clearInterval(this.emailCodeIntervalId);
        this.emailCodeIntervalId = null;
      }
    }, 1000);
  }

  ngDestroy() {
    if (this.smsCodeIntervalId) {
      clearInterval(this.smsCodeIntervalId);
      this.smsCodeIntervalId = null;
    }

    if (this.emailCodeIntervalId) {
      clearInterval(this.emailCodeIntervalId);
      this.emailCodeIntervalId = null;
    }
  }
}
