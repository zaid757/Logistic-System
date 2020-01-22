import { Component, OnInit, OnDestroy } from '@angular/core';

import { Post } from '../driver.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DriversService } from '../driver.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { mimeType } from '../mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'createDriver',
  templateUrl: './driver-create.component.html',
  styleUrls: ['./driver-create.component.css']
})
export class DriverCreateComponent implements OnInit, OnDestroy {
  enteredDriverName = '';
  enteredDriverDescription = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'createDriver';
  private driverId: string;
  private autStatusSub: Subscription; // unutk buang loading spinner

  constructor(
    public postsService: DriversService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.autStatusSub = this.authService.getAuthStatusListener() // nie tgok auth status betul ke tak
    .subscribe(authStatus => {   // kalau ade any changes loading spinner akn jdi false
      this.isLoading = false;
    });
    this.form = new FormGroup({ // nie buat shell untuk depan html form group punya data
      driverName: new FormControl(null, { // nie amik drpde kat depan html tu
        validators: [Validators.required, Validators.minLength(3)] // nie utk validate ikut min ke tak isi driver tu
      }),
      driverDescription: new FormControl(null, { validators: [Validators.required] }),  // nie amik drpde kat depan html tu
      imageDriver: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType] // nie validator untuk jenis gmbr mcm jpeg
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => { // nie mcam nk tgok ape isi observable
      if (paramMap.has('driverId')) { // nie
        this.mode = 'edit';
        this.driverId = paramMap.get('driverId'); // nie dtg drpde post sbb kalau post ade post id dia ade post Id
        this.isLoading = true;
        this.postsService.getPost(this.driverId).subscribe(postData => { // dpt data drpde posts.js
          this.isLoading = false;
          this.post = { // dtg this.post tu drpde post nie akan diguna untuk di edit nntie kat bawh
            id: postData._id,
            driverName: postData.driverName,
            driverDescription: postData.driverDescription,
            imagePath: postData.imagePath,
            creator: postData.creator,
            driverLocation: postData.driverLocation,
            driverStatus: postData.driverStatus,
            document: postData.document
          };
          this.form.setValue({  // set value dia nie function untuk isi mase get tuh
            driverName: this.post.driverName,
            driverDescription: this.post.driverDescription,
            imageDriver: this.post.imagePath // sini nak samekan drppde database ke form
          });
        });
      } else {
        this.mode = 'createDriver';
        this.driverId = null;
      }
    });
  }

  onImagePicked(event: Event) { // nie untk dia jadi event which is click
    const file = (event.target as HTMLInputElement).files[0]; // sini lah dia dapat drpde dpn tu file data tu msuk ke file propperty
    this.form.patchValue({imageDriver: file}); // patch value nie untuk single form dia masukan value file kat image
    this.form.get('imageDriver').updateValueAndValidity(); // sini lah dia check image tu ade ke tak and update dekat front end form
    const reader = new FileReader(); // nie nk buat untuk image tu  boleh dibaca untuk buat image preview
    reader.onload = () => { // nie function dia
      this.imagePreview = reader.result as string; // sini dia masukkan reader punya sifat yg boleh dia baca url
    };
    reader.readAsDataURL(file); // sini lah dia dia baca data file tuh as url then  kluarkan result tu dimana dia kluarkan file kat ats
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'createDriver') {
      this.postsService.addPost(
        this.form.value.driverName,
        this.form.value.driverDescription,
        this.form.value.imageDriver);
    } else {
      this.postsService.updatePost( // sini la yg update atas tuh utuk get saja
        this.driverId,
        this.form.value.driverName,
        this.form.value.driverDescription,
        this.form.value.imageDriver,
        this.post.driverLocation,
        this.post.driverStatus,
        this.post.document
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.autStatusSub.unsubscribe(); // habis suda
  }
}
