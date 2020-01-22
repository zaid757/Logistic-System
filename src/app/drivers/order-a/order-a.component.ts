import { Component, OnInit, OnDestroy } from '@angular/core';

import { Post } from '../driver.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrdersService } from '../order.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { mimeType } from '../mime-doc.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'orderA',
  templateUrl: './order-a.component.html',
  styleUrls: ['./order-a.component.css']
})
export class OrdersAComponent implements OnInit, OnDestroy {
  enteredDriverName = '';
  enteredDriverDescription = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: any;
  private status = 'Not Available';
  private mode;
  private orderId: string;
  private autStatusSub: Subscription; // unutk buang loading spinner

  constructor(
    private sanitizer: DomSanitizer,
    public postsService: OrdersService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.autStatusSub = this.authService.getAuthStatusListener() // nie tgok auth status betul ke tak
    .subscribe(authStatus => {   // kalau ade any changes loading spinner akn jdi false
      this.isLoading = false;
    });
    this.form = new FormGroup({ // nie buat shell untuk depan html form group punya data
      driverLocation: new FormControl(null,
        { validators: [Validators.required] }),
      driverName: new FormControl(null, { // nie amik drpde kat depan html tu
        validators: [Validators.required, Validators.minLength(3)] }), // nie utk validate ikut min ke tak isi driver tu
      driverDescription: new FormControl(null,
         { validators: [Validators.required] }),  // nie amik drpde kat depan html tu
        document: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType], // nie validator untuk jenis gmbr mcm jpeg
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => { // nie mcam nk tgok ape isi observable
      if (paramMap.has('orderId')) { // nie
        this.mode = 'edit';
        this.orderId = paramMap.get('orderId'); // nie dtg drpde post sbb kalau post ade post id dia ade post Id
        this.isLoading = true;
        this.postsService.getPost(this.orderId).subscribe(postData => { // dpt data drpde posts.js
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
            document,
            driverLocation: this.post.driverLocation
          });
        });
      }
    });
  }

  onDocPicked(event: Event) { // nie untk dia jadi event which is click
    const file = (event.target as HTMLInputElement).files[0]; // sini lah dia dapat drpde dpn tu file data tu msuk ke file propperty
    this.form.patchValue({document: file}); // patch value nie untuk single form dia masukan value file kat image
    this.form.get('document').updateValueAndValidity(); // sini lah dia check image tu ade ke tak and update dekat front end form
    const reader = new FileReader(); // nie nk buat untuk image tu  boleh dibaca untuk buat image preview
    reader.onload = () => { // nie function dia
      this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(reader.result as string); // nie utk baca pdf format
    };
    reader.readAsDataURL(file); // sini lah dia dia baca data file tuh as url then  kluarkan result tu dimana dia kluarkan file kat ats
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    console.log(this.form.value.driverName);
    console.log(this.form.value.driverLocation);
    console.log(this.form.value.document);
    {
      this.postsService.updateOrder( // sini la yg update atas tuh utuk get saja
        this.orderId,
        this.form.value.driverName,
       'heading to ' + this.form.value.driverLocation,
        this.form.value.driverDescription,
        this.form.value.document,
        this.post.imagePath,
        this.status,

      );
      console.log(this.status);
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.autStatusSub.unsubscribe(); // habis suda
  }
}
