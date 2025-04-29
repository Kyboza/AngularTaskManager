import { Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Input,  } from '@angular/core';

@Component({
  selector: 'app-task-completion',
  imports: [MatProgressBarModule],
  templateUrl: './task-completion.component.html',
  styleUrl: './task-completion.component.scss'
})
export class TaskCompletionComponent  {
  @Input() public percentCompleted: number = 0;

}
