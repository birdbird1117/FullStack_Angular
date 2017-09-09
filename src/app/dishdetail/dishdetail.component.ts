import { Component, OnInit } from '@angular/core';
import { Dish } from '../shared/dish';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';

import 'rxjs/add/operator/switchMap';
 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {
   dish : Dish;
   dishIds: number[];
   prev: number;
   next: number;

  newcommentForm: FormGroup;
  newcomment: Comment;


   constructor(private dishservice: DishService,
     private route: ActivatedRoute,
     private location: Location,
     private newct: FormBuilder) { 
     this.createForm();

   }

   ngOnInit() {
     this.dishservice.getDishIds()
     .subscribe(dishIds => this.dishIds = dishIds);
     this.route.params.switchMap((param: Params) => this.dishservice.getDish(+param['id']))
      .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
   }

  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

  goBack(): void {
      this.location.back();
  }

  createForm() {
    this.newcommentForm = this.newct.group({
      rating: '',
      comment: '',
      author: '',
      date: '',
    });

    //this.feedbackForm.valueChanges.subscribe(data => this.onValueChanged(data));
  
    //this.onValueChanged();

  }

  onSubmit() {
    this.newcomment = this.newcommentForm.value;
    console.log(this.newcomment);
    this.newcommentForm.reset({
      rating: '',
      comment: '',
      author: '',
      date: '',
    });
  }

}
