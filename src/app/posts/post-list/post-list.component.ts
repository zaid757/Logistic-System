import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';


import { Post } from '././post.model';
import { PostsService } from '../post.service';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2; // sini untuk pagination tu
  currentPage = 1; // sini untuk default value sama dgn atas nie nntie nie di hntr ke api pakai query params
  pageSizeOptions = [1, 2, 5, 10]; // sini nak pilih berapa bnyk item yg nk di show
  userIsAuthenticated = false ;
  userId: string; // function dia nantie untuk compare dgn sedia ada user id dlm data yg dah di post
  usernameId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService) {}


  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId(); // requst user id drpde auth service untuk compare id
    this.usernameId = this.authService.getUsernameId();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => { // sini dia amik data kat post.service kene same
        // dalam postUpdated atas skli
    this.isLoading = false;
    this.totalPosts = postData.postCount; // ni amik drpde blkng post.service yg ats
    this.posts = postData.posts; // nie amik drpde post.service yg atas tu
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    // nie same je mcm bawah tpi lebih straight forward pakai nie sebb yg bwh tk dpt run
    this.authStatusSub =  this.authService
    .getAuthStatusListener().subscribe(isAuthenticated => {  // nie pakai utk log out nntie
    this.userIsAuthenticated = isAuthenticated;
   // this.userId = this.authService.getUserId(); // requst user id drpde auth service untuk compare id
    });
  }

  onChangedPage(pageData: PageEvent) { // sini untuk change page bwh tuh . import page event drpde angular
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1; // sini tmbh satu sebab kat backend kita start drpde stu dfault data start drpde 0
    this.postsPerPage = pageData.pageSize; // sini yg user mintak tu
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {              // nie amik function kay blkng post.service dia amik delete post
    this.postsService.getPosts(this.postsPerPage, this.currentPage); //  sini lah response lepas dia delete kat ats nie dia pg buat nie
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}

