import { Component, OnInit, inject, Signal, computed} from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith, map } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';

import { AllProjectsService } from '../services/projects-service/allProjects.service';

@Component({
  selector: 'app-searchbar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    MatOptionModule
  ],
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'] 
})
export class SearchbarComponent implements OnInit {
  searchControl = new FormControl('');
  filteredOptions: string[] = [];
  isBrowser = false;

  @Output() search = new EventEmitter<string>();

  constructor(private projectsService: AllProjectsService) {}

  ngOnInit(): void {
  this.searchControl.valueChanges
    .pipe(
      startWith(''),
      debounceTime(100),
      map(value => value || '')
    )
    .subscribe(value => {
      this.search.emit(value);
      this.filteredOptions = this._filter(value);
    });
}


  private _filter(value: string): string[] {
    const allProjects = this.projectsService.getMyProjects().map(p => p.title);
    const filterValue = value.toLowerCase();
    return allProjects.filter(option => option.toLowerCase().includes(filterValue));
  }
}
