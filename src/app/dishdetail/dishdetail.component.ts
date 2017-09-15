import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';

import 'rxjs/add/operator/switchMap';
 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
        state('shown', style({
            transform: 'scale(1.0)',
            opacity: 1
        })),
        state('hidden', style({
            transform: 'scale(0.5)',
            opacity: 0
        })),
        transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]})

export class DishdetailComponent implements OnInit {
   dish : Dish;
   dishcopy = null;
   dishIds: number[];
   prev: number;
   next: number;
   errMess: string;
   visibility= 'shown';

  newcommentForm: FormGroup;
  newcomment: Comment;


  formErrors = {
    'author': '',
    'comment': '',
  };

  validationMessages = {
    'author': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
      'minlength':     'Comment must be at least 2 characters long.',
      'maxlength':     'Comment cannot be more than 2500 characters long.'
    },
  };

   constructor(private dishservice: DishService,
     private route: ActivatedRoute,
     private location: Location,
     private newct: FormBuilder,
      @Inject('BaseURL') private BaseURL) { 
     this.createForm();

   }

   ngOnInit() {
     this.dishservice.getDishIds()
     .subscribe(dishIds => this.dishIds = dishIds);
     this.route.params
      .switchMap((param: Params) => {this.visibility = 'hidden'; return this.dishservice.getDish(+param['id'])})
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown';}, 
        errmess => this.errMess =<any>errmess);
   }

  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

  goBack(): void {
      this.location.back();
  }

  onValueChanged(data?: any) {
    if (!this.newcommentForm) { return; }
    const form = this.newcommentForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  createForm() {
    this.newcommentForm = this.newct.group({
      rating: 5,
      comment: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2500)] ],
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
    });

    this.newcommentForm.valueChanges.subscribe(data => this.onValueChanged(data));
  
    this.onValueChanged();

  }

  onSubmit() {
    this.newcomment = this.newcommentForm.value;
    this.newcomment.date = new Date().toISOString();
    console.log(this.newcomment);
    this.dishcopy.comments.push(this.newcomment);
    this.dishcopy.save().subscribe(dish => this.dish = dish);
    this.newcommentForm.reset({
      rating: 5,
      comment: '',
      author: '',
    });
  }

}
