import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UPLOAD_URL } from 'app/shared/constants/urls';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  toastId = null;

  constructor(
    private http: HttpClient,
    private toast: ToastrService,
  ) {}

  uploadImage(event: Event): Observable<HttpEvent<string>> | null {
    // uploadImage(event: Event) {
    // let toastId = null;
    const image = this.getImage(event);

    if (!image) return null;

    const formData = new FormData();
    formData.append('image', image, image.name);

    const imageUrl = this.http.post<string>(UPLOAD_URL, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'text' as 'json',
    });

    return imageUrl;
  }

  private getImage(event: Event) {
    const files = (<HTMLInputElement>event.target)!.files;

    if (!files || files.length <= 0) {
      this.toast.warning('Upload file is not selected', 'File Upload');
      return null;
    }

    const file = files[0];

    if (file.type !== 'image/jpeg') {
      this.toast.error('Only JPG type is allowed', 'File Type Error');
      return null;
    }

    return file;
  }
}
