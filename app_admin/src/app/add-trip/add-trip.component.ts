import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Provides common directives like ngIf, ngFor
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.css']
})

// OnInit because we want a Component method to be called on startup of the ng
export class AddTripComponent implements OnInit {
  public addForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripService: TripDataService
  ) {}

  ngOnInit() {
    this.addForm = this.formBuilder.group(
      {
        _id: [],
        code: ['', Validators.required],
        name: ['', Validators.required],
        length: ['', Validators.required],
        start: ['', Validators.required],
        resort: ['', Validators.required],
        perPerson: ['', Validators.required],
        image: ['', Validators.required],
        description: ['', Validators.required],
      }
    )
  }

  public onSubmit() {
    this.submitted = true;
    if (this.addForm.valid) {
      // Pass the data to the Express application
      this.tripService.addTrip(this.addForm.value)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.router.navigate(['/']);
          },
          error: (error: any) => {
            console.log('Error: ' + error);
          }
        });
    }

  }
  // get the form short name to access the form fields
  get f() { return this.addForm.controls; }
}
