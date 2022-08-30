import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-list',
  templateUrl: './detail-list.component.html',
  styleUrls: ['./detail-list.component.scss']
})
export class DetailListComponent implements OnInit {

  lists: any;
  list: any;
  public task: any;
  public arr: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    let id = this.route.snapshot.params['id'];
    this.lists = localStorage.getItem('list') || '[]';
    this.list = JSON.parse(this.lists);
    this.arr = this.list.filter((x: any) => id == x.id);
    this.task = this.arr.map((x: any) => {
      return x.education;
    });
  }

  downloadPDF() {
    window.print();
  }
}
