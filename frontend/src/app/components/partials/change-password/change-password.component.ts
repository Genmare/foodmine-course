import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from 'app/services/user.service';
import { IUserPassword } from 'app/shared/interfaces/IUserPassword';
import { User } from 'app/shared/models/User';
import { PasswordsMatchValidator } from 'app/shared/validators/password_match_validators';
import { TitleComponent } from '../title/title.component';
import { TextInputComponent } from '../text-input/text-input.component';
import { DefaultButtonComponent } from '../default-button/default-button.component';

@Component({
  selector: 'change-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TitleComponent,
    TextInputComponent,
    DefaultButtonComponent,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  passwordForm!: FormGroup;
  user!: User;
  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.user = userService.currentUser;
  }

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(5)]],
        newPassword: ['', [Validators.required, Validators.minLength(5)]],
        confirmNewPassword: [
          '',
          [Validators.required, Validators.minLength(5)],
        ],
      },
      {
        validators: PasswordsMatchValidator(
          'newPassword',
          'confirmNewPassword'
        ),
      }
    );
  }

  get fc() {
    return this.passwordForm.controls;
  }

  submit() {
    this.userService.updateProfile;

    this.isSubmitted = true;
    if (this.passwordForm.invalid) return;

    const fv = this.passwordForm.value;
    const password: IUserPassword = {
      currentPassword: fv.password,
      newPassword: fv.newPassword,
    };
    this.userService.changePassword(password);
  }
}
