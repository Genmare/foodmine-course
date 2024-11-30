import { Component, Input } from '@angular/core';
import { InputContainerComponent } from '../input-container/input-container.component';
import { InputValidationComponent } from '../input-validation/input-validation.component';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'text-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputContainerComponent,
    InputValidationComponent,
  ],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css',
})
export class TextInputComponent {
  @Input()
  control!: AbstractControl;
  @Input()
  showErrorsWhen: boolean = true;
  @Input()
  label!: string;
  @Input()
  type: 'text' | 'password' | 'number' | 'email' = 'text';

  get formControl() {
    return this.control as FormControl;
  }
}
