import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TitleComponent } from 'app/components/partials/title/title.component';
import { UserService } from 'app/services/user.service';
import { TextInputComponent } from '../../partials/text-input/text-input.component';
import { User } from 'app/shared/models/User';
import { DefaultButtonComponent } from '../../partials/default-button/default-button.component';
import { IUserLogin } from 'app/shared/interfaces/IUserLogin';
import { IUserProfile } from 'app/shared/interfaces/IUserProfile';
import { ChangePasswordComponent } from '../../partials/change-password/change-password.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TitleComponent,
    TextInputComponent,
    DefaultButtonComponent,
    ChangePasswordComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  user!: User;
  isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.user = userService.currentUser;
  }

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      name: [this.user.name, [Validators.required, Validators.minLength(5)]],
      address: [
        this.user.address,
        [Validators.required, Validators.minLength(10)],
      ],
    });
  }

  get fc() {
    return this.profileForm.controls;
  }

  submit() {
    this.userService.updateProfile;

    this.isSubmitted = true;
    if (this.profileForm.invalid) return;

    const fv = this.profileForm.value;
    const user: IUserProfile = {
      name: fv.name,
      address: fv.address,
    };

    this.userService.updateProfile(user).subscribe();
  }
}
