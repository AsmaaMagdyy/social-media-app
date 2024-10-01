import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authguardGuard: CanActivateFn = (route, state) => {
  const _PLATFORM_ID=inject(PLATFORM_ID);
  const _Router=inject(Router);

  if (isPlatformBrowser(_PLATFORM_ID)) {
    if(localStorage.getItem('socialToken')!== null){
      return true;
    }else{
      _Router.navigate(['/login']);
      return false;
    }
  }else{
    return false;
  }
  
};
