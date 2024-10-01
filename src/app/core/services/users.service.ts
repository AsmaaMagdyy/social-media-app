import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environments';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  userPhoto:WritableSignal<string>=signal('');


  constructor(private _HttpClient:HttpClient) { 
    this.getUserData().subscribe({
      next: (res) => {
        console.log(res.user.photo);
        this.userPhoto.set(res.user.photo)

      }
    })
  }

  signUp(data:object):Observable<any>{
   return this._HttpClient.post(`${environment.baseUrl}users/signup`,data); 
  }

  signIn(data:object):Observable<any>{
   return this._HttpClient.post(`${environment.baseUrl}users/signin`,data); 
  }

  changePassword(data:object):Observable<any>{
   return this._HttpClient.patch(`${environment.baseUrl}users/change-password`,data); 
  }

  uploadPhoto(data:FormData):Observable<any>{
   return this._HttpClient.put(`${environment.baseUrl}users/upload-photo`,data); 
  }

  getUserData():Observable<any>{
   return this._HttpClient.get(`${environment.baseUrl}users/profile-data`); 
  }
}
