import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../shared/services/projectId-service/project.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(private projectId: ProjectService) {}
  resetSelectId = (value: null) => {
    this.projectId.setProjectId(value);
  };
}
