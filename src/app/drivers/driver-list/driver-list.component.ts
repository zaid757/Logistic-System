import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';


import { Post } from '../driver.model';
import { DriversService } from '../driver.service';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.css']
})
export class DriverListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false ;
  userId: string; // function dia nantie untuk compare dgn sedia ada user id dlm data yg dah di post
  username: string;
  status: string;
  location: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public postsService: DriversService, private authService: AuthService) {} // sini dia amik data drpde driver service tu


  ngOnInit() {
    this.location = 'Dock/otw';
    this.status = 'Available';
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    // requst user id drpde auth service untuk compare id dah tk pakai dah skrg pkai username id saja
    this.username = this.authService.getUsernameId();
    this.postsSub = this.postsService.getPostUpdateListener() // nei amik drpde post driver service dah di declaree kat atas
      .subscribe((postData: {posts: Post[], postCount: number}) => { // amik data drpde post driver service
    this.isLoading = false;
    this.totalPosts = postData.postCount;
    this.posts = postData.posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    // nie same je mcm bawah tpi lebih straight forward pakai nie sebb yg bwh tk dpt run
    this.authStatusSub =  this.authService
    .getAuthStatusListener().subscribe(isAuthenticated => {  // nie pakai utk log out nntie
    this.userIsAuthenticated = isAuthenticated;
   // this.userId = this.authService.getUserId(); // requst user id drpde auth service untuk compare id
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {              // delete function
    this.postsService.getPosts(this.postsPerPage, this.currentPage); // fetch new post
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}

