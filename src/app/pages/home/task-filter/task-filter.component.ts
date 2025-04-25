import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Output, EventEmitter, Input } from '@angular/core';
import { Tasks } from '../../../shared/models/tasks';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

const filters = [
  (task: Tasks) => task,
  (task: Tasks) => task.completed,
  (task: Tasks) => !task.completed
]

@Component({
  selector: 'app-task-filter',
  imports: [CommonModule, FormsModule, MatSelectModule],
  templateUrl: './task-filter.component.html',
  styleUrl: './task-filter.component.scss'
})
export class TaskFilterComponent implements OnInit {
  @Input() filter: any;
  @Output() filterChange = new EventEmitter<any>()

  listFilter: any = '0';

  ngOnInit(): void {
    this.updateFilter(0)
  }

  updateFilter = (value: any) => {
    this.filter = filters[value];
    this.filterChange.emit(this.filter)
  }
}
