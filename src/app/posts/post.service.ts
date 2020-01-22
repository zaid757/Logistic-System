import { Injectable } from '@angular/core';
import { Subject} from 'rxjs';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


import {Post} from './post-list/post.model';
import { environment } from 'src/environments/environment';


const BACKEND_URL = environment.apiUrl + '/posts/'; // nie utk api dia sama ja so pakai nie mudah amik url kat environment


@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = []; // dia create sini hah shell kosong  drpde postlist/post then gune kat bwh msukkan data kat post data
  private postsUpdated = new Subject<{ posts: Post[], postCount: number}>(); /// ni dia javascript object yg ade array of post property
    // nie untuk create post baru samakean dgn yg postlist/post model tu

  constructor(private http: HttpClient, private router: Router) {} // htpp client untuk amik data drpde api

  getPosts(postsPerPage: number, currentPage: number) { // sini function dia dpat dapat data drpde backend datbase
    // nie untuk yg kat bawah tu .function dia amik data drpde blkng api , juge sini untuk setting page
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`; // nie nak buat query untuk paging page yg kat bawah tu
    this.http
      .get<{ message: string; posts: any, maxPosts: number }>( // sini dia dapat maxpost:number drpde blkng kat post.js post query
        // message tu contohnya ' post updated succesfully tu', posts tuh database lah semua yg dibuat
        BACKEND_URL + queryParams // nie amik data drpde api yg backend_url tu
      )
      .pipe( // pipe mksdnya salurkan data obeservable drpde blkng api terus ker destinasi dlm situasi nie ke postData
        map((postData) => {
        return {
          posts: postData.posts.map(post => { /* pipe yg drpde api tu akn gune pakai postData pstu amik value pkai .posts yg ade post:any tu
            pastu dia kene convert kat bawah  'kire nie dia dah dpt drpde database la */
          return { // sini lah dia akan convert dlu
            title: post.title, // nie smua data drpde post drpde back end
            content: post.content,
            id: post._id, // dia nk convert nie
            imagePath: post.imagePath,
            creator: post.creator // acces from server
          }; // semua nie akan jadi observable yg akan dipkai nntie
        }),
         maxPosts: postData.maxPosts // sini dia dapt data drpde postdata.maxpost
      };
      })
      )
      .subscribe(transformedPostsData => { // nie lah result lpas map convert atas tu
        console.log(transformedPostsData);
        this.posts = transformedPostsData.posts; // nie untuk update post ke dlm bentuk yg dah diconvert tu
        this.postsUpdated.next({posts: [...this.posts],  // nie untuk update front end dgn data yg dah ade dpt drpde blkng tu /
          // dia bagi javascript object tu skli dgn nie post count
          postCount: transformedPostsData.maxPosts // ni dia hold value tu nntie boleh bg angular front pakai
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) { /* nie function dia utk bg data information tentang ape yg sedang di edit. amik id sebab single id per edit .
    nntie seblum edit dia akan appear dlm form */
    return this.http.get<{ // nie untuk amik data kat api
      _id: string, // nie nak create clone untuk di edit nntie kt bawh
      title: string,
      content: string,
      imagePath: string,
      creator: string     //  nie untuk get data bagi kat post-create component
      }>(
      BACKEND_URL + id); // return balik semua nie as observable
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData(); // nie untuk data yang baru akan isi ke dlm datbase  and yg database yg bawah tu untuk update database
    postData.append('title', title); // nie untuk samekan data dgn api tu bawah nie  dia sbb asyn
    postData.append('content', content); // append maksd dia tambah
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>( // sini lah dia akan send data tu kan post tu
        // nie dia akan post data tuh yg kat dlm router.post  dlam posts.js yg ade data message dgn data lain
        BACKEND_URL,
        postData // tu dia amik yg shell kosong post data tu samekan dgn dlm database nie async
      )
      .subscribe(responseData => { // sini utk post list saja. dia boleh  amik direct kat db
        this.router.navigate(['/']); // nie utk post list
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    // ats sini declare untuk bgi bwh tu . nie database untuk edit punya
 let postData: Post | FormData;
 if (typeof(image) === 'object') { // nie check type of image , sebab dia kan type of file
    postData = new FormData(); // nie nak masukkan data drpde form data yg kt dpn tu ke database tgok nama dia sebelah ke sblh
    postData.append('id', id); // nie id post sendiri
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
  } else {
  postData = {
    // tslint:disable-next-line: object-literal-shorthand
    id: id,
    // tslint:disable-next-line: object-literal-shorthand
    title: title,
    // tslint:disable-next-line: object-literal-shorthand
    content: content,
    imagePath: image,
    creator: null // null supaya takda orng edit
  };
}
 this.http
  .put(BACKEND_URL + id, postData) // nie function masuk kan data balik ke back end
  .subscribe(response => {
    this.router.navigate(['/']);
  });
}

deletePost(postId: string) {
return this.http // dia pg delete kat blkng api
  .delete(BACKEND_URL + postId); // sini dia akan jadi part of url yg postID nie
}
}
