import { Component, inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../core/services/users.service';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly _UsersService = inject(UsersService)
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);
  private readonly _ToastrService = inject(ToastrService);

  signInSubs!: Subscription

  loginForm: FormGroup = this._FormBuilder.group({
   
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]],
   

  })



  submit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.signInSubs = this._UsersService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.message === 'success') {
            this._ToastrService.success('Success and navigate to home after 2s')
            localStorage.setItem('socialToken',res.token)
            setTimeout(() => {
              this._Router.navigate(['/timeline']);
            }, 2000)

          }

        }
      })


    } else {
      this.loginForm.markAllAsTouched()
    }

  }

  

  ngOnDestroy(): void {
    this.signInSubs?.unsubscribe()
  }



}
