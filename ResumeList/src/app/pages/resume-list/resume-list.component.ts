import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-resume-list',
  templateUrl: './resume-list.component.html',
  styleUrls: ['./resume-list.component.scss']
})
export class ResumeListComponent implements OnInit {

  name = "";
  fromDate = "";
  toDate = "";
  today = new Date();
  displayedColumns: string[] = ['name', 'createdTime', 'operation'];
  dataSource!: MatTableDataSource<any>;
  empList: any;
  lists: any;
  list: any;
  id: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.lists = localStorage.getItem('list') || '[]';
    this.list = JSON.parse(this.lists);
    console.log(this.list)
    setTimeout(() => {
      this.dataSource = new MatTableDataSource(this.list);
      this.dataSource.paginator = this.paginator;
    });
  }

  onSearch() {
    this.name ? this.list.name = this.name : '';
    //this.fromDate ? payload['fromDate'] = moment(this.fromDate).format('YYYY/MM/DD') : '';
  }

  createResume() {
    this.router.navigate(['/create-resume']);
  }

  editData(id:any) {
    this.router.navigate(['/edit-resume/'+id]);
  }

  deleteData(id: any) {
    let localData = localStorage.getItem('list') || '[]';
    let newList = JSON.parse(localData)
    let index = newList.findIndex((item:any) => item.id === id)
    newList.splice(index, 1);
    localStorage.setItem('list', JSON.stringify(newList));
    this.getData();
  }

  detailList(id:any){
 this.router.navigate(['/detail/'+id]);
  }

}
