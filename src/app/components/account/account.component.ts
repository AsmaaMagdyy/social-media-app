import { Component, inject, OnInit, OnDestroy, WritableSignal, signal } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { Iuser } from '../../core/interfaces/iuser';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [DatePipe, RouterLink, ReactiveFormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit, OnDestroy {

  private readonly _UsersService = inject(UsersService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _FormBuilder = inject(FormBuilder);
  userData: WritableSignal<Iuser> = signal({} as Iuser);
  savedFile!: File;

  getUserDataSubs!: Subscription
  uploadPhotoSubs!: Subscription
  changePasswordSubs!: Subscription

  changePasswordForm: FormGroup = this._FormBuilder.group({
    password: [null, [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]],
    newPassword: [null, [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]]
  })


  ngOnInit(): void {
    this.getUserData();
  }
  getUserData(): void {
    this.getUserDataSubs = this._UsersService.getUserData().subscribe({
      next: (res) => {
        console.log(res.user);
        this.userData.set(res.user);
        this._UsersService.userPhoto.set(res.user.photo);

      }
    })
  }

  changeImage(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      console.log(input.files[0]);
      this.savedFile = input.files[0];
    }


  }

  uploadPhoto(): void {
    const formData = new FormData();
    formData.append('photo', this.savedFile);
    this.uploadPhotoSubs = this._UsersService.uploadPhoto(formData).subscribe({
      next: (res) => {
        if (res.message == 'success') {
          console.log(res);
          this.getUserData();
          this._ToastrService.success('Profile picture updated successfully')


        }
      },
    })

  }

  changePass(): void {
    console.log(this.changePasswordForm.value);
    if (this.changePasswordForm.valid) {
      this.changePasswordSubs = this._UsersService.changePassword(this.changePasswordForm.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.message === 'success') {
            this._ToastrService.success('Your password has been changed successfully.');
            localStorage.setItem('socialToken', res.token)
          }

        }
      })
    } else {
      this.changePasswordForm.markAllAsTouched()
    }

  }
  ngOnDestroy(): void {
    this.getUserDataSubs?.unsubscribe();
    this.uploadPhotoSubs?.unsubscribe();
    this.changePasswordSubs?.unsubscribe();
  }


}
