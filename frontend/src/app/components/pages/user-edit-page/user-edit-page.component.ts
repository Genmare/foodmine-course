import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { User } from 'app/shared/models/User';
import { TitleComponent } from '../../partials/title/title.component';
import { TextInputComponent } from '../../partials/text-input/text-input.component';
import { DefaultButtonComponent } from '../../partials/default-button/default-button.component';
import { IUserEdit } from 'app/shared/interfaces/IUserEdit';

@Component({
  selector: 'app-user-edit-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TitleComponent,
    TextInputComponent,
    DefaultButtonComponent,
  ],
  templateUrl: './user-edit-page.component.html',
  styleUrl: './user-edit-page.component.css',
})
export class UserEditPageComponent implements OnInit {
  userEditForm!: FormGroup;
  isEditMode = false;
  userId!: string;
  isSubmitted = false;
  currentUser!: User; // permet d'éviter que le user s'enlève le droit administrateur

  constructor(
    private formBuilder: FormBuilder,
    activatedRouter: ActivatedRoute,
    private userService: UserService,
  ) {
    activatedRouter.params.subscribe(({ userId }) => {
      this.userId = userId;
      this.isEditMode = !!userId;

      if (this.isEditMode) this.loadUser();
      console.log('userId', userId);
      console.log('isEditMode', this.isEditMode);
    });
    this.currentUser = userService.currentUser;
  }

  ngOnInit(): void {
    this.userEditForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      // isAdmin: true,
      isAdmin: new FormControl<boolean>(true, { updateOn: 'submit' }),
    });
    console.log('userEditForm', this.userEditForm);
  }

  get fc() {
    return this.userEditForm.controls;
  }

  loadUser() {
    this.userService
      .getById(this.userId)
      .subscribe((user) => this.populateFormUser(user));
  }

  populateFormUser(user: User) {
    this.userEditForm.reset(user);
  }

  submit() {
    this.isSubmitted = true;

    // if (this.userEditForm.invalid) return;

    // const fv = this.userEditForm.value;

    // const user: IUserEdit = {
    //   id: this.userId,
    //   name: fv.name,
    //   email: fv.email,
    //   address: fv.address,
    //   isAdmin: fv.isAdmin,
    // };
    // this.userService.updateUser(user).subscribe(() => {});
  }
}
