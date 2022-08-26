import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-resume-list',
  templateUrl: './resume-list.component.html',
  styleUrls: ['./resume-list.component.scss']
})
export class ResumeListComponent implements OnInit {

  name = "";
  fromDate: any;
  toDate: any;
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
    this.lists = localStorage.getItem('list') || '[]';
    this.list = JSON.parse(this.lists);
    this.getData();
  }

  getData() {
    this.lists = localStorage.getItem('list') || '[]';
    this.list = JSON.parse(this.lists);
    setTimeout(() => {
      this.dataSource = new MatTableDataSource(this.list);
      this.dataSource.paginator = this.paginator;
    });
  }

  onSearch() {
    if (!this.name && !this.fromDate && !this.toDate) {
      this.getData();
    }
    if (this.name && !this.fromDate && !this.toDate) {
      let res = this.list.filter((res: any) => {
        return res.name.trim().toLowerCase().includes(this.name);
      });
      this.dataSource = new MatTableDataSource(res);
    } else if (!this.name && this.fromDate && this.toDate) {
      this.toDate.setTime(this.toDate.getTime() + ((23 * 60 + 59) * 60 + 59) * 1000);
      let res = this.list.filter((res: any) => {
        return new Date(res.createdAt) >= this.fromDate &&
          new Date(res.createdAt) <= this.toDate;
      });
      this.dataSource = new MatTableDataSource(res);
    } else {
      let result = this.list.filter((res: any) => {
        return res.name.trim().toLocaleLowerCase().includes(this.name)
          && new Date(res.createdAt) >= this.fromDate
          && new Date(res.createdAt) <= this.toDate
      });
      this.dataSource = new MatTableDataSource(result);
    }
    this.dataSource.paginator = this.paginator;
  }

  createResume() {
    this.router.navigate(['/create-resume']);
  }

  editData(id: any) {
    this.router.navigate(['/edit-resume/' + id]);
  }

  deleteData(id: any) {
    let localData = localStorage.getItem('list') || '[]';
    let newList = JSON.parse(localData)
    let index = newList.findIndex((item: any) => item.id === id)
    newList.splice(index, 1);
    localStorage.setItem('list', JSON.stringify(newList));
    this.getData();
  }

  detailList(id: any) {
    this.router.navigate(['/detail/' + id]);
  }

}
