import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  educationForm: any;
  public pageTitle: string = 'Create Task';
  public buttonname: string = 'Create';
  confirmView: Boolean = false;
  id: any;
  editList: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if (this.router.url.indexOf('/create-resume') !== -1) {
      this.resumeForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
        phone: ['', Validators.required],
        education: this.fb.array([this.edu()])
      });
    } else if (this.router.url.indexOf('/edit-resume') !== -1) {
      this.resumeForm = this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
        phone: ['', Validators.required],
        education: this.fb.array([], Validators.required)
      });
    }
    this.educationForm = this.resumeForm.controls['education'] as FormArray;
    this.id = this.route.snapshot.params['id'];

    if (this.router.url.indexOf('/edit-resume') !== -1 && this.id !== undefined) {
      this.pageTitle = 'Edit Task';
      this.buttonname = 'Update';

      let lists = localStorage.getItem('list') || '[]';
      let list = JSON.parse(lists);
      this.editList = list.filter((x: any) => x.id === this.id);
      if (this.editList) {
        this.resumeForm.patchValue({
          name: this.editList[0].name,
          email: this.editList[0].email,
          phone: this.editList[0].phone,
          education: this.editList[0].education.forEach((element: any) => {
            this.education.push(this.fb.group({
              task: element.task,
              startDate: element.startDate,
              endDate: element.endDate,
              status: element.status
            }))
          })
        });
      }
    }
  }

  get myForm() {
    return this.resumeForm.controls;
  }

  get education() {
    return this.resumeForm.controls['education'] as FormArray;
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
    let arr = this.fb.group({
      task: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', [Validators.required, dateValidator]],
      status: ['']
    },
      {
        validator: dateValidator('startDate', 'endDate')
      });
    this.educationForm.push(arr);
  }

  educationcon(index: any) {
    //this.educationForm = this.resumeForm.get('education') as FormArray;
    const formGroup = this.educationForm.controls[index] as FormGroup;
    return formGroup;
  }

  deleteEducation(eduIndex: number) {
    this.education.removeAt(eduIndex);
  }

  // keyPress(event: any) {
  //   const pattern = /[0-9\+\-\ ]/;
  //   let inputChar = String.fromCharCode(event.charCode);
  //   if (event.keyCode != 8 && !pattern.test(inputChar)) {
  //     event.preventDefault();
  //   }
  // }

  createUpdateEducation() {
    if (this.buttonname == 'Create') {
      this.resumeArr = {
        id: uuidv4(),
        name: this.resumeForm.controls['name'].value,
        email: this.resumeForm.controls['email'].value,
        phone: this.resumeForm.controls['phone'].value,
        education: this.resumeForm.controls['education'].value,
        createdAt: new Date()
      };
      let resume = localStorage.getItem('list') || '[]';
      let list = JSON.parse(resume);
      list.push(this.resumeArr);
      localStorage.setItem('list', JSON.stringify(list));
      this.router.navigate(['/resume-list']);

    } else if (this.buttonname == 'Update') {
      this.id = this.route.snapshot.params['id'];
      let arr = {
        id: this.id,
        name: this.resumeForm.controls['name'].value,
        email: this.resumeForm.controls['email'].value,
        phone: this.resumeForm.controls['phone'].value,
        education: this.resumeForm.controls['education'].value,
        createdAt: new Date()
      };
      let lists = localStorage.getItem('list') || '[]';
      let list = JSON.parse(lists);
      let index = list.findIndex((item: any) => item.id === this.id)
      list[index] = arr;
      localStorage.setItem('list', JSON.stringify(list));
      this.router.navigate(['/resume-list']);
    }

    // if(this.resumeForm.valid){
    //   this.resumeForm.controls['name'].disable();
    //   this.resumeForm.controls['email'].disable();
    //   this.resumeForm.controls['phone'].disable();
    //   this.resumeForm.controls['education'].disable();
    //   this.confirmView = true;
    // }
  }

  drop(event: CdkDragDrop<string[]>) {
    this.formArray = this.educationForm;
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
