import { Component, inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../core/services/users.service';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnDestroy {

  private readonly _UsersService = inject(UsersService)
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);
  private readonly _ToastrService = inject(ToastrService);

  signUpSubs!: Subscription

  registerForm: FormGroup = this._FormBuilder.group({
    name: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]],
    rePassword: [null],
    dateOfBirth: [null, [Validators.required]],
    gender: [null, [Validators.required]]

  }, { validators: this.confirmPassword })

  confirmPassword(g: AbstractControl) {
    if (g.get('password')?.value === g.get('rePassword')?.value) {
      return null;
    } else {
      return { mismatch: true };
    }

  }

  submit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      this.signUpSubs = this._UsersService.signUp(this.registerForm.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.message === 'success') {
            this._ToastrService.success('Success and navigate to login after 2s')
            setTimeout(() => {
              this._Router.navigate(['/login']);
            }, 2000)

          }

        }
      })


    } else {
      this.registerForm.markAllAsTouched()
    }

  }

  date(e: any) {
    console.log(e.target.value);
    this.registerForm.get('dateOfBirth')?.setValue(e.target.value)

  }

  ngOnDestroy(): void {
    this.signUpSubs?.unsubscribe()
  }



}
