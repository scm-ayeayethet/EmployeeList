import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { dateValidator } from 'src/app/validators/custom-date.validator';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-create-resume',
  templateUrl: './create-resume.component.html',
  styleUrls: ['./create-resume.component.scss']
})
export class CreateResumeComponent implements OnInit {

  resumeForm!: FormGroup;
  today = new Date();
  resumeArr: any = [];
  formArray: any = [];
  educationList: any;

  constructor(
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.resumeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      phone: ['', Validators.required],
      education: this.fb.array([this.edu()])
    });
    this.educationList = this.resumeForm.controls['education'] as FormArray;
  }

  get myForm() {
    return this.resumeForm.controls;
  }

  get education() {
    return this.resumeForm.controls["education"] as FormArray;
  }

  edu(): FormGroup {
    return this.fb.group({
      task: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', [Validators.required, dateValidator]],
      status: ['']
    },
      {
        validator: dateValidator('startDate', 'endDate')
      });
  }

  addEducation() {
    this.educationList.push(this.edu());
  }

  educationcon(index: any) {
    this.educationList = this.resumeForm.get('education') as FormArray;
    const formGroup = this.educationList.controls[index] as FormGroup;
    return formGroup;
  }

  deleteEducation(eduIndex: number) {
    this.education.removeAt(eduIndex);
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  createEducation() {
    this.resumeArr = {
      id : uuidv4(),
      name : this.resumeForm.controls['name'].value,
      email : this.resumeForm.controls['email'].value,
      phone : this.resumeForm.controls['phone'].value,
      education: this.resumeForm.controls['education'].value
    };
    let resume = localStorage.getItem('list') || '[]';
    let list = JSON.parse(resume);
    list.push(this.resumeArr);
    localStorage.setItem('list', JSON.stringify(list));
    this.router.navigate(['/resume-list']);
  }

  drop(event: CdkDragDrop<string[]>) {
    this.formArray = this.resumeForm.controls["education"] as FormArray;
    const from = event.previousIndex;
    const to = event.currentIndex;
    this.moveItemInFormArray(this.formArray, from, to);
    //moveItemInArray(this.formArray, event.previousIndex, event.currentIndex); 
  }

  moveItemInFormArray(formArray: FormArray, fromIndex: number, toIndex: number): void {
    const from = this.clamp(fromIndex, formArray.length - 1);
    const to = this.clamp(toIndex, formArray.length - 1);

    if (from === to) {
      return;
    }

    const previous = formArray.at(from);
    const current = formArray.at(to);
    formArray.setControl(to, previous);
    formArray.setControl(from, current);
  }

  /** Clamps a number between zero and a maximum. */
  clamp(value: number, max: number): number {
    return Math.max(0, Math.min(max, value));
  }
}
