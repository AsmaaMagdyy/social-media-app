import { Component, ElementRef, inject, OnDestroy, OnInit, PLATFORM_ID, signal, ViewChild, WritableSignal } from '@angular/core';
import { PostsService } from '../../core/services/posts.service';
import { Subscription } from 'rxjs';
import { Ipost } from '../../core/interfaces/ipost';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { CommentsComponent } from "../../shared/ui/comments/comments.component";
import { UsersService } from '../../core/services/users.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';





@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [DatePipe, CommentsComponent, FormsModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent implements OnInit, OnDestroy {

  private readonly _PostsService = inject(PostsService);
  private readonly _UsersService = inject(UsersService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);

  getAllPostsSubs!: Subscription;
  getUserDataSubs!: Subscription;
  deletePostSubs!: Subscription;

  posts: Ipost[] = [];
  userName: WritableSignal<string> = signal('');

  savedFile!: File;
  content!:string;
  userID!:string;

  ngOnInit(): void {

    this.getAllPosts();
    this.getUserDataSubs = this._UsersService.getUserData().subscribe({
      next: (res) => {
        console.log(res.user.name);
        this.userName.set(`What's on your mind , ${res.user.name}?`);
        localStorage.setItem('userID',res.user._id)

      }
    })
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.userID=localStorage.getItem('userID')!;

    }
  }

  getAllPosts(): void {
    this.getAllPostsSubs = this._PostsService.getAllPosts().subscribe({
      next: (res) => {
        console.log(res.posts);
        this.posts = res.posts;
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

  createPost(): void {
    const formData = new FormData();
    formData.append('body', this.content);
    formData.append('image', this.savedFile);
    this._PostsService.createPost(formData).subscribe({
      next: (res) => {
        if (res.message == 'success') {
          console.log(res);
          this._ToastrService.success('Your post created successfully')
          this.getAllPosts();


        }
      },
    })

  }
 

  deletePost(postId:string):void{
    this.deletePostSubs=this._PostsService.deletePost(postId).subscribe({
      next:(res)=>{
        if (res.message ==='success') {
          this.getAllPosts();
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

  ngOnDestroy(): void {
    this.getAllPostsSubs?.unsubscribe();
    this.getUserDataSubs?.unsubscribe();
    this.deletePostSubs?.unsubscribe();

  }

}
