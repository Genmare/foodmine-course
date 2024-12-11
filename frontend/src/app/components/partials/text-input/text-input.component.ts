import { Component, Input, OnInit } from '@angular/core';
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
export class TextInputComponent implements OnInit {
  @Input()
  control!: AbstractControl;
  @Input()
  showErrorsWhen: boolean = true;
  @Input()
  label!: string;
  @Input()
  disabled = false;
  @Input()
  type: 'text' | 'password' | 'number' | 'checkbox' | 'email' = 'text';
  @Input()
  message!: string;

  constructor() {}

  ngOnInit(): void {
    if (this.disabled) this.formControl.disable();
  }

  get formControl() {
    return this.control as FormControl;
  }

  get value() {
    const fc = this.control as FormControl;
    return fc.value;
  }

  onCheckboxChange(event: Event): void {
    if (this.type === 'checkbox') {
      const isChecked = (event.target as HTMLInputElement).checked;
      this.formControl.setValue(isChecked);
    }
  }
}
