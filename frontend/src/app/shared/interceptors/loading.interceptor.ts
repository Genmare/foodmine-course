import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { tap } from 'rxjs';

var pendingRequest = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  loadingService.showLoading();
  pendingRequest += 1;
  return next(req).pipe(
    tap({
      next: (event) => {
        if (
          event.type === HttpEventType.Response
          // && !(req.body instanceof FormData)
        ) {
          handleHideLoading(loadingService);
        }
      },
      error: (_) => {
        handleHideLoading(loadingService);
      },
    }),
  );
};

function handleHideLoading(loadingService: LoadingService) {
  pendingRequest -= 1;
  if (pendingRequest === 0) loadingService.hideLoading();
}
