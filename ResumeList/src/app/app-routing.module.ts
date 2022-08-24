import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateResumeComponent } from './pages/create-resume/create-resume.component';
import { DetailListComponent } from './pages/detail-list/detail-list.component';
import { ResumeListComponent } from './pages/resume-list/resume-list.component';

const routes: Routes = [
  {
    path: '',
    component: ResumeListComponent
  },
  {
    path: 'resume-list',
    component: ResumeListComponent
  },
  {
    path: 'create-resume',
    component: CreateResumeComponent
  },
  {
    path: 'edit-resume/:id',
    component : CreateResumeComponent
  },
  {
    path: 'detail/:id',
    component:DetailListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
