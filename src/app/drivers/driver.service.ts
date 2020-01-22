import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


import {Post} from './driver.model';
import { environment } from 'src/environments/environment';


const BACKEND_URL = environment.apiUrl + '/drivers/'; // nie utk api dia sama ja so pakai nie mudah amik url kat environment


@Injectable({ providedIn: 'root' })
export class DriversService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any, maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((postData) => {
        return {
          posts: postData.posts.map(post => {
          return {
            driverLocation: post.driverLocation,
             driverStatus: post.driverStatus,
           //  driverLocation: post.driverLocation,
            driverName: post.driverName,
            driverDescription: post.driverDescription,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator // acces from server
          };
        }),
         maxPosts: postData.maxPosts
      };
      })
      )
      .subscribe(transformedPostsData => {
        console.log(transformedPostsData);
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({posts: [...this.posts],
          postCount: transformedPostsData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {   // function untuk bg response object yg akan dimintak oleh service lain
    return this.http.get<{
      _id: string,
      driverStatus: string,
      driverLocation: string,
      driverName: string,
      driverDescription: string,
      imagePath: string,
      creator: string,
      document: string     //  nie untuk get data bagi kat post-create component
      }>(
      BACKEND_URL + id);
  }

  addPost(driverName: string, driverDescription: string, imageDriver: File) {
    const postData = new FormData();
    console.log(postData);
    postData.append('driverName', driverName);
    postData.append('driverDescription', driverDescription);
    postData.append('imageDriver', imageDriver, driverName);
    this.http
      .post<{ message: string; post: Post }>(
        BACKEND_URL,
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(['/driver-list']);
      });
  }

  // tslint:disable-next-line: max-line-length
  updatePost(id: string, driverName: string, driverDescription: string, imageDriver: File | string, driverLocation: string, driverStatus: string , document: string) {
 let postData: Post | FormData;
 if (typeof(imageDriver) === 'object') {
    postData = new FormData(); // apa fungsi ini
    postData.append('driverName', driverName);
    postData.append('driverDescription', driverDescription);
    postData.append('id', id);
    postData.append('imageDriver', imageDriver, driverName);
    postData.append('driverStatus', driverStatus);
    postData.append('driverLocation', driverLocation);
    postData.append('document', document);

 } else {
  postData = { // sini lah dia samekan dgn data drpde model
     // tslint:disable-next-line: object-literal-shorthand
    driverName: driverName,
     // tslint:disable-next-line: object-literal-shorthand
    driverLocation: driverLocation,
    // nie nak samekan dgn nilai drpde post . postList/postmodel
    // tslint:disable-next-line: object-literal-shorthand
    driverDescription: driverDescription,
    id,
    imagePath: imageDriver,
     // tslint:disable-next-line: object-literal-shorthand
     driverStatus: driverStatus,
    creator: null, // null supaya takda orng edit
    // tslint:disable-next-line: object-literal-shorthand
    document: document
  };
}
 this.http
  .put(BACKEND_URL + id, postData)
  .subscribe(response => {
    this.router.navigate(['/driver-list']);
  });
}

deletePost(postId: string) {
return this.http
  .delete(BACKEND_URL + postId);
}

// tslint:disable-next-line: max-line-length


}
