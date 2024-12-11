import { Component, OnInit } from '@angular/core';
import { TitleComponent } from '../../partials/title/title.component';
import {
  FormBuilder,
  FormControlOptions,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PasswordsMatchValidator } from '../../../shared/validators/password_match_validators';
import { IUserRegister } from '../../../shared/interfaces/IUserRegister';
import { TextInputComponent } from '../../partials/text-input/text-input.component';
import { DefaultButtonComponent } from '../../partials/default-button/default-button.component';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    DefaultButtonComponent,
    ReactiveFormsModule,
    RouterLink,
    TitleComponent,
    TextInputComponent,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitted = false;

  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(5)]],
        confirmPassword: ['', Validators.required],
        address: ['', [Validators.required, Validators.minLength(8)]],
      },
      {
        validators: PasswordsMatchValidator(
          'password',
          'confirmPassword',
        ) as FormControlOptions,
      },
    );

    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  get fc() {
    return this.registerForm.controls;
  }

  submit() {
    console.log('submit');
    this.isSubmitted = true;
    console.log('this.registerForm.invalid', this.registerForm.invalid);

    if (this.registerForm.invalid) return;

    const fv = this.registerForm.value;
    const user: IUserRegister = {
      name: fv.name,
      email: fv.email,
      password: fv.password,
      confirmPassword: fv.confirmPassword,
      address: fv.address,
    };

    this.userService
      .register(user)
      .subscribe((_) => this.router.navigateByUrl(this.returnUrl));
  }
}
