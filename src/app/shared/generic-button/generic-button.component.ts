import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Input } from '@angular/core';

@Component({
  selector: 'app-generic-button',
  imports: [MatButtonModule],
  templateUrl: './generic-button.component.html',
  styleUrls: ['./generic-button.component.scss'],
})
export class GenericButtonComponent {
  @Input() type: string = 'button';
  @Input() text: string = '';
  @Input() disabled: boolean = false;
}
