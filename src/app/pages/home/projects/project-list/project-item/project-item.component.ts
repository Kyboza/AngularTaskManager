import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { Projects } from '../../../../../shared/models/projects';
import { HoverColorDirective } from '../../../../../shared/custom-directive/hover-color';
import { CapitalizePipe } from '../../../../../shared/custom-pipe/capitalize';
import { EventService } from '../../../../../shared/services/event-service/event.service';
import { ProjectService } from '../../../../../shared/services/projectId-service/project.service';

@Component({
  selector: 'app-project-item',
  standalone: true,
  imports: [CommonModule, CapitalizePipe, HoverColorDirective, MatIconModule, MatCheckboxModule],
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
})
export class ProjectItemComponent {
  @Input() public project!: Projects;
  @Input() public isLast: boolean = true;

  @Output() public toggled = new EventEmitter<Projects>();
  @Output() public enableBlur = new EventEmitter<boolean>();
  @Output() public enableEdit = new EventEmitter<[boolean, Projects]>();

  public now: Date = new Date();
  public noEdit: boolean = false;

  public constructor(
    public events: EventService,
    public projectService: ProjectService,
  ) {}

  public removeTask(project: Projects): void {
    const savedProjects = localStorage.getItem('savedProjects');
    if (savedProjects) {
      this.events.emit('removeProject', project);
    }
  }

  public editProject(project: Projects): void {
    this.enableBlur.emit(true);
    this.enableEdit.emit([true, project]);
    this.noEdit = !this.noEdit;
  }

  public toggleCompleted(): void {
    this.project.completed = !this.project.completed;
    this.toggled.emit(this.project);
  }

  public updateDisplayId(id: number): void {
    this.projectService.setProjectId(id);
  }
}
