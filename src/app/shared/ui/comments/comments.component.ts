import { DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { CommentsService } from '../../../core/services/comments.service';
import { Subscription } from 'rxjs';
import { Icomment } from '../../../core/interfaces/icomment';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [DatePipe,ReactiveFormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit,OnDestroy {

  private readonly _CommentsService=inject(CommentsService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);


  getPostCommentsSubs!:Subscription;
  createCommentSubs!:Subscription;
  updateCommentSubs!:Subscription;
  deleteCommentSubs!:Subscription;

  @Input ({required:true}) postId!:string;

  commntsList:WritableSignal<Icomment[]>=signal([]);

  commentForm!:FormGroup
  userID!:string;

  updateCommentForm:FormGroup=this._FormBuilder.group({
    content:[null]
  })

  ngOnInit(): void {
    this.commentForm=this._FormBuilder.group({
      content:[null],
      post:[this.postId]
    })
    this.getAllPostComments();
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.userID=localStorage.getItem('userID')!;

    }

    
  }

  getAllPostComments():void{
    this.getPostCommentsSubs = this._CommentsService.getPostComments(this.postId).subscribe({
      next:(res)=>{
        console.log(`postId ${this.postId}`,res.comments);
        this.commntsList.set(res.comments.reverse());
        
      }
    })
  }

  sendComment():void{
   this.createCommentSubs= this._CommentsService.createComment(this.commentForm.value).subscribe({
      next:(res)=>{
        console.log(res);
        this.commntsList.set(res.comments.reverse());
        this.commentForm.get('content')?.reset();
        
      }
    })
  }

  editComment(commentId:string):void{
    this.updateCommentSubs=this._CommentsService.updateComment(this.updateCommentForm.value,commentId).subscribe({
      next:(res)=>{
        if (res.message =='success') {
        this._ToastrService.success('Your comment updated successfuly')
          console.log(res);
          this.getAllPostComments();
          this.updateCommentForm.get('content')?.reset();
        }
       
      
        
      },
      error:(err)=>{
        this._ToastrService.error(err.error.error)
     
       }
    })
  }
  deleteComment(commentId:string):void{
    console.log(commentId);
    
    this.deleteCommentSubs=this._CommentsService.deleteComment(commentId).subscribe({
      next:(res)=>{
        this._ToastrService.success('Your comment deleted successfuly')
        console.log(res);
        this.getAllPostComments();
        this.updateCommentForm.get('content')?.reset();
      
        
      },
      error:(err)=>{
       this._ToastrService.error(err.error.message)
    
      }
    })
  }


  
  ngOnDestroy(): void {
    this.getPostCommentsSubs?.unsubscribe();
    this.createCommentSubs?.unsubscribe();
    this.updateCommentSubs?.unsubscribe();
    this.deleteCommentSubs?.unsubscribe();
  }

}
