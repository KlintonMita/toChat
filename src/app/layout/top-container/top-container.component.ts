import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-top-container',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './top-container.component.html',
  styleUrl: './top-container.component.scss'
})
export class TopContainerComponent {

}
