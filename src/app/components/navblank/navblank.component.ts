import { Component, computed, inject, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navblank',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './navblank.component.html',
  styleUrl: './navblank.component.scss'
})
export class NavblankComponent {

  private readonly _UsersService = inject(UsersService);
  private readonly _Router = inject(Router);
  userAccountPhoto:Signal<string>=computed(()=> this._UsersService.userPhoto())
  
  signOut():void{
    localStorage.removeItem('socialToken');
    this._Router.navigate(['/login'])

  }
  confirmSignOut(){
    Swal.fire({
      title: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, sign out now!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.signOut();
      } 
    })
  }
}
