import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';


export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const _ToastrService = inject(ToastrService);


  return next(req).pipe(catchError((err) => {
    if (!req.url.includes('comments')) {
      _ToastrService.error(err.error.error)
      console.log(err.error.error);
    }


    return throwError(() => err)
  }));
};
