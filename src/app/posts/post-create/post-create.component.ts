import { Component, OnInit, OnDestroy } from '@angular/core';

import { Post } from '../post-list/post.model'; // nie nak  bagi import post type
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';


// mula mula kan bukak page dia dulu so dia akan run semua drpde start export class tu

@Component({
  // tslint:disable-next-line: component-selector
    selector: 'createPost',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = ''; // start mula mula kat sini dia run
  enteredContent = '';
  post: Post; // nie nak store post drpde blkng post.service
  isLoading = false;
  form: FormGroup; // nie untuk create property untuk data depan html
  imagePreview: string; // nie nak create property nntie untuk buat image preview
  private mode = 'createPost'; // nie nk create property untuk mode
  private postId: string; // ni kosong declare nntie pakai kat bawh untuk dpt post id drpde route
  private autStatusSub: Subscription; // unutk buang loading spinner

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute, // sini dia dtg drpde route cth app-routing module . dia contain infrmation edit/:postId tu
    private authService: AuthService
  ) {}

  ngOnInit() {  // dia akan run semua yg kat ats nie then dia akan start ngOninit
    this.autStatusSub = this.authService.getAuthStatusListener()
    .subscribe(authStatus => {   // kalau ade any changes loading spinner akn jdi false
      this.isLoading = false;
    });
    this.form = new FormGroup({ // sini dia create new object yg boleh di store data
      title: new FormControl(null, { // create null untuk empty input
        validators: [Validators.required, Validators.minLength(3)]  // nie utk check ckup pnjng ke tak
      }),
      content: new FormControl(null, { // nie dtg drpde depan
        validators: [Validators.required] }), // validators.required tuh nak pastikan takde kosong
      image: new FormControl(null, {
        validators: [Validators.required], // nie untuk declare yg depan html
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
       // dia pakai param means dia observable yg boleh subscribe skrg nie dia subscribe kat param map tu then tgok ade ape dlm param map tu
      if (paramMap.has('postId')) { // postId dtg drpde route app-routing module
        this.mode = 'edit'; // nie dah bukan default dia mean dia else dia lalu sini
        this.postId = paramMap.get('postId'); // nie dapat drpde route tdi dia masukkan ke dalam post id yg dclre kat ats
        this.isLoading = true;
        this.postsService.getPost(this.postId) // nie this.postId dia jdi observable untk amik data kat  blkng tu postsService.getPost
        .subscribe(postData => { // dpt data drpde posts.js untuk disamekan nntie kat bawah
          this.isLoading = false;
          this.post = { // sini dia isi form ke dalam form
            id: postData._id, // nie smua drpde backend getPost posts.service.get post line 61 tu
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          this.form.setValue({  // set value dtg drpde database dia masukkan ke dlam form tgok set.value form
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = 'createPost'; // function dia nie tgok mode , kalau mode edit dia pg edit kalau mode createPost pstu dia pg bawah tu
        this.postId = null; // sini jadi null sebab nie bkn untuk edit  tgok line 58
        console.log(this.form.value.title); // sini takde value lagi sebab nie dia lom masuk value kat bawah tu
      }
    });
  }

  onImagePicked(event: Event) { // nie untk dia jadi event which is click
    const file = (event.target as HTMLInputElement).files[0]; // sini lah dia dapat drpde dpn tu file data tu msuk ke file propperty
    this.form.patchValue({image: file}); // patch value nie untuk single form dia masukan value file kat image
    this.form.get('image').updateValueAndValidity(); // sini lah dia check image tu ade ke tak and update dekat front end form
    const reader = new FileReader(); // nie nk buat untuk image tu  boleh dibaca untuk buat image preview
    reader.onload = () => { // nie function dia
      this.imagePreview = reader.result as string; // sini dia masukkan reader punya sifat yg boleh dia baca url
    };
    reader.readAsDataURL(file); // sini lah dia dia baca data file tuh as url then  kluarkan result tu dimana dia kluarkan file kat ats
  }

  onSavePost() { // nie kalau dia submit tuh dpt value tu
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'createPost') { // nie utk create post baru
      this.postsService.addPost(
        this.form.value.title, // nie amik value yg  drpde html yg form tu amik letak sini
        this.form.value.content,
        this.form.value.image);

      console.log(this.form.value.title);
      console.log(this.postId);
    } else {
      this.postsService.updatePost( // nie untuk update data post yg edit tu
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    console.log(this.postId);
    this.form.reset(); // nie akan clearkan data untuk form
  }

  ngOnDestroy() {
    this.autStatusSub.unsubscribe(); // habis suda
  }
}

