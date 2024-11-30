import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodService } from 'app/services/food.service';
import { TitleComponent } from '../../partials/title/title.component';
import { TextInputComponent } from '../../partials/text-input/text-input.component';
import { InputContainerComponent } from '../../partials/input-container/input-container.component';
import { Food } from 'app/shared/models/food';
import { DefaultButtonComponent } from '../../partials/default-button/default-button.component';
import { UploadService } from 'app/services/upload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ActiveToast, ToastrService } from 'ngx-toastr';
import { IFood } from 'app/shared/interfaces/IFood';

@Component({
  selector: 'app-food-edit-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TitleComponent,
    TextInputComponent,
    InputContainerComponent,
    DefaultButtonComponent,
  ],
  templateUrl: './food-edit-page.component.html',
  styleUrl: './food-edit-page.component.css',
})
export class FoodEditPageComponent implements OnInit {
  foodId!: string;
  isEditMode!: boolean;
  imageUrl!: string;
  isSubmitted = false;

  formFoodEdit!: FormGroup;

  constructor(
    activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private foodService: FoodService,
    private uploadService: UploadService,
    private toast: ToastrService,
    private router: Router,
  ) {
    this.foodId = activatedRoute.snapshot.params.foodId;
    this.isEditMode = !!this.foodId;
    this.formFoodEdit = new FormGroup({
      name: new FormControl(),
      price: new FormControl(),
      tags: new FormControl(),
      origins: new FormControl(),
      cookTime: new FormControl(),
    });
  }

  ngOnInit(): void {
    const nameValidators: Validators[] = [
      Validators.required,
      Validators.minLength(5),
    ];
    const priceValidators: Validators[] = [Validators.required];
    const originsValidators: Validators[] = [Validators.required];
    const cookTimeValidators: Validators[] = [Validators.required];

    if (this.isEditMode) {
      this.foodService.getFoodbyId(this.foodId).subscribe((food) => {
        if (food) {
          this.imageUrl = food.imageUrl;
          this.formFoodEdit = this.formBuilder.group({
            id: [food.id], // non utilisé pour le formulaire
            name: [food.name, nameValidators],
            price: [food.price, priceValidators],
            tags: [food.tags],
            favorite: [food.favorite], // non utilisé pour le formulaire
            origins: [food.origins, originsValidators],
            cookTime: [food.cookTime, cookTimeValidators],
          });
        }
      });
    } else {
      this.formFoodEdit = this.formBuilder.group({
        name: ['', nameValidators],
        price: [0, priceValidators],
        tags: [[]],
        origins: [[], originsValidators],
        cookTime: ['', cookTimeValidators],
      });
    }

    // console.log('this.formFoodEdit.controls', this.formFoodEdit.controls);
  }

  get fc() {
    return this.formFoodEdit.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.formFoodEdit.invalid) return;

    const fv = this.formFoodEdit.value;
    const food: IFood = {
      id: fv.id,
      name: fv.name,
      price: fv.price,
      tags: fv.tags,
      favorite: fv.favorite,
      // stars: fv.stars,
      imageUrl: this.imageUrl,
      origins: fv.origins,
      cookTime: fv.cookTime,
    };

    if (this.isEditMode) {
      this.foodService.update(food);
      console.log('food', food);

      this.toast.success(`Food "${food.name}" updated successfully!`);
      return;
    }

    let newFood: Food;
    this.foodService.addFood(food).subscribe({
      next: (nFood) => {
        newFood = nFood;
        this.toast.success(`Food "${food.name}" added successfully!`);
        this.router.navigateByUrl('admin/editFood/' + newFood.id, {
          replaceUrl: true,
        });
      },
      error: (err) => console.error('Error', err),
    });
  }

  update(event: Event) {
    let toastInstance: ActiveToast<any> | null = null;

    this.uploadService.uploadImage(event)?.subscribe({
      next: (event) => {
        let eventTotal = 5000;
        this.getEventType(event);
        // console.log('event', event);

        switch (event.type) {
          case HttpEventType.UploadProgress:
            eventTotal =
              (event.total !== undefined ? event.total / event.loaded : 1) *
              1000;
            // console.log('UploadProgress');

            // if (toastInstance !== null && toastInstance.toastId)
            if (toastInstance === null)
              toastInstance = this.toast.info(
                'Uploading...',
                'Uploading file(s)',
                {
                  progressBar: true,
                  timeOut: eventTotal,
                },
              );
            break;
          case HttpEventType.Response:
            // console.log('Response');
            if (event.body) {
              this.imageUrl = event.body;
              this.toast.clear(toastInstance?.toastId);
              toastInstance = null;
            }
            break;
        }
      },
      error: (errorResponse) => {
        console.error('errorResponse', errorResponse);
        // this.toastrService.error(errorResponse, 'Cart'),
      },

      // this.imageUrl = (imageUrl as HttpResponse<string>);
    });
  }

  private getEventType(event: HttpEvent<string>) {
    switch (event.type) {
      case HttpEventType.DownloadProgress:
        console.log('DownloadProgress');
        break;
      case HttpEventType.Response:
        console.log('Response');
        break;
      case HttpEventType.ResponseHeader:
        console.log('ResponseHeader');
        break;
      case HttpEventType.Sent:
        console.log('Sent');
        break;
      case HttpEventType.UploadProgress:
        console.log('UploadProgress');
        break;
      case HttpEventType.User:
        console.log('User');
        break;
    }
  }
}
