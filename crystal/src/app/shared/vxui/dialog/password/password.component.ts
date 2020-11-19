import { Component, OnInit } from '@angular/core';
import { Map } from 'immutable';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '../../../../core/net/http.client';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import {
    FormBuilder,
    NgForm,
    FormControl,
    FormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms';
@Component({
    selector: 'app-password',
    templateUrl: './password.component.html',
    host: {
        '[class.common-popup]': 'true',
    },
    styleUrls: ['./password.component.less'],
})
export class PasswordComponent implements OnInit {
    saving = false;
    txtOldPassword = '';
    txtNewPassword = '';
    txtConfirmPassword = '';

    formData = {
        oldpassword: '',
        password: '',
        repassword: '',
    };
    constructor(
        private fb: FormBuilder,
        public translateService: TranslateService,
        private http: _HttpClient,
        private messageService: NzMessageService,
        private modal: NzModalRef,
        public router: Router,
    ) {
        this.txtOldPassword = this.translateService.instant('Old Password');
        this.txtNewPassword = this.translateService.instant('New Password');
        this.txtConfirmPassword = this.translateService.instant('Confirm Password');

        this.validateForm = this.fb.group({
            oldpassword: ['', [Validators.required]],
            password: ['', [Validators.required]],
            confirm: ['', [this.confirmValidator]],
        });
    }
    ngOnInit() {}

    cancelHandler(): void {
        this.modal.triggerCancel();
    }

    validateForm: FormGroup;

    resetForm(e: MouseEvent): void {
        e.preventDefault();
        this.validateForm.reset();
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsPristine();
            this.validateForm.controls[key].updateValueAndValidity();
        }
    }

    validateConfirmPassword(): void {
        setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
    }

    confirmValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.validateForm.controls.password.value) {
            return { confirm: true, error: true };
        }
    };

    submitForm($event, form: NgForm|any) {
        $event.preventDefault();
        console.log(form);
        for (const key in this.validateForm.controls) {
            this.validateForm.controls[key].markAsDirty();
            this.validateForm.controls[key].updateValueAndValidity();
        }
        //this.modal.close()
        let { oldpassword, password, confirm } = form.value;
        if (form.valid && password == confirm) {
            console.log(form.value);
            this.saving = true;
            this.http
                .post('users/updatePwd', {
                    oldpassword: oldpassword,
                    newpassword: password,
                })
                .subscribe(
                    res => {
                        this.saving = false;
                        this.messageService.info(
                            this.translateService.instant('Pasword Modify Success'),
                        );
                        localStorage.removeItem("cacheUsername");
                        this.modal.triggerCancel();
                        this.router.navigateByUrl('/auth');
                    },
                    () => {
                        this.saving = false;
                    },
                );
        }
    }
}
