import { Component, OnInit, OnDestroy, inject, WritableSignal, signal } from '@angular/core';
import { CommentsComponent } from "../../../shared/ui/comments/comments.component";
import { DatePipe } from '@angular/common';
import { PostsService } from '../../services/posts.service';
import { Ipost } from '../../interfaces/ipost';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-myposts',
  standalone: true,
  imports: [CommentsComponent,DatePipe],
  templateUrl: './myposts.component.html',
  styleUrl: './myposts.component.scss'
})
export class MypostsComponent implements OnInit,OnDestroy {

  private readonly _PostsService = inject(PostsService);
  private readonly _Router = inject(Router);
  posts:WritableSignal< Ipost[]> = signal([]);
  getMyPostsSubs!:Subscription;
  deletePostSubs!:Subscription;


  ngOnInit(): void {
    this.getMyPosts();
  }
  getMyPosts():void{
    this.getMyPostsSubs=this._PostsService.getMyPosts().subscribe({
      next:(res)=>{
        console.log(res.posts);
        this.posts.set(res.posts.reverse());
        
      }
    })
  }

  deletePost(postId:string):void{
    this.deletePostSubs=this._PostsService.deletePost(postId).subscribe({
      next:(res)=>{
        if (res.message ==='success') {
          this.getMyPosts();
        }
      }
    })
  }
  confirmBox(postId:string){
    Swal.fire({
      title: 'Are you sure want to remove post?',
      text: 'You will not be able to recover this post!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Deleted!',
          'Your post has been deleted.',
          'success'
        )
        this.deletePost(postId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your post is safe :)',
          'error'
        )
      }
    })
  }
  getPost(postId:string):void{
    console.log(postId);
    this._Router.navigate(['/myPost',postId]);

    
  }
  ngOnDestroy(): void {
    this.getMyPostsSubs?.unsubscribe();
    this.deletePostSubs?.unsubscribe();
  }

}
