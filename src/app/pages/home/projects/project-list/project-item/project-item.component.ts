import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Projects } from '../../../../../shared/models/projects';
import { EventService } from '../../../../../shared/services/event-service/event.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Output, EventEmitter } from '@angular/core';
import { ProjectService } from '../../../../../shared/services/projectId-service/project.service';


@Component({
  selector: 'app-project-item',
  imports: [CommonModule, MatIconModule, MatCheckboxModule],
  templateUrl: './project-item.component.html',
  styleUrl: './project-item.component.scss'
})
export class ProjectItemComponent {
  @Input() project!: Projects
  @Output() toggled = new EventEmitter<Projects>()
  @Output() enableBlur = new EventEmitter<boolean>()
  @Output() enableEdit = new EventEmitter<[boolean, Projects]>();

  public noEdit: boolean = false

  constructor(public events: EventService, public projectService: ProjectService){}

  removeTask = (project: Projects) => {
    const savedProjects = localStorage.getItem('savedProjects')
    if(savedProjects){
      this.events.emit('removeProject', project);
    }
  }

  editProject = (project: Projects) => {
    this.enableBlur.emit(true)
    this.enableEdit.emit([true, project]);
    this.noEdit = !this.noEdit;
  }

  updateDisplayId = (id: number) => {
    this.projectService.setProjectId(id)
  }
}
