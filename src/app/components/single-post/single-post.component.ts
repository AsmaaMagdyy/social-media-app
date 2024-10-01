import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostsService } from '../../core/services/posts.service';
import { Ipost } from '../../core/interfaces/ipost';
import { CommentsComponent } from "../../shared/ui/comments/comments.component";
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-single-post',
  standalone: true,
  imports: [CommentsComponent,DatePipe,FormsModule],
  templateUrl: './single-post.component.html',
  styleUrl: './single-post.component.scss'
})
export class SinglePostComponent implements OnInit,OnDestroy {
  
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _PostsService = inject(PostsService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _Router = inject(Router);

  
  paramMapSub!:Subscription;
  getSinglePostSub!:Subscription;
  deletePostSubs!:Subscription;
  updatePostSubs!:Subscription;

  savedFile!: File;
  content!:string;

  // post!:Ipost
    post: WritableSignal<Ipost>=signal({} as Ipost);

  posts: Ipost[] = [];

  ngOnInit(): void {
    this.paramMapSub=this._ActivatedRoute.paramMap.subscribe({
      next:(p)=>{
        // console.log(p.get('id'));
        let postId:WritableSignal<string|null> = signal(p.get('id'))
        this.getSinglePost(postId());
        

        

      }
    })
  }

  getSinglePost(postId:string|null):void{
    this.getSinglePostSub= this._PostsService.getSinglePost(postId).subscribe({
      next:(res)=>{
        // console.log(res.post);
            // this.post=res.post
      this.post.set(res.post)
          }
     })
  }
  
  deletePost(postId:string):void{
    this.deletePostSubs=this._PostsService.deletePost(postId).subscribe({
      next:(res)=>{
        if (res.message ==='success') {
          this._Router.navigate(['/myPosts'])
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

  
  changeImage(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      console.log(input.files[0]);
      this.savedFile=input.files[0];
    }

  }

  updatePost(postId:string): void {
    const formData = new FormData();
    formData.append('body', this.content);
    formData.append('image', this.savedFile);
    this.updatePostSubs=this._PostsService.updatePost(postId,formData).subscribe({
      next: (res) => {
        if (res.message == 'success') {
          console.log(res);
          this._ToastrService.success('Your post updated successfully')
          this.getSinglePost(postId);


        }
      },
    })

  }
  ngOnDestroy(): void {
    this.getSinglePostSub?.unsubscribe();
    this.deletePostSubs?.unsubscribe();
    this.paramMapSub?.unsubscribe();
    this.updatePostSubs?.unsubscribe();
  }


}
