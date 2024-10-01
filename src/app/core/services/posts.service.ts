import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environments';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private _HttpClient:HttpClient) { }

  createPost(data:object):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}posts`,data);
  }

  getAllPosts(currentPage?:number):Observable<any>{
    let url;
    if (currentPage) {
      url= this._HttpClient.get(`${environment.baseUrl}posts?page=${currentPage}`);
    }else{
      url= this._HttpClient.get(`${environment.baseUrl}posts?`);
    }
    

    return url;
  }

  getMyPosts(currentPage?:number):Observable<any>{
    let url;
    if (currentPage) {
      url=this._HttpClient.get(`${environment.baseUrl}users/664bcf3e33da217c4af21f00/posts?page=${currentPage}`);
    }else{
      url=this._HttpClient.get(`${environment.baseUrl}users/664bcf3e33da217c4af21f00/posts?`);

    }
    return url;
  }

 getSinglePost(postID:string|null):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}posts/${postID}`);
  }

  updatePost(postID:string,data:object):Observable<any>{
    return this._HttpClient.put(`${environment.baseUrl}posts/${postID}`,data);
  }

  deletePost(postID:string):Observable<any>{
    return this._HttpClient.delete(`${environment.baseUrl}posts/${postID}`);
  }

  
}
